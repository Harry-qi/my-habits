const schedule = require('node-schedule');
const notifier = require('node-notifier');
const axios = require('axios');
const dayjs = require('dayjs');
const { IS_WORK_DAY, IS_OFF_DAY, IS_OVERTIME_DAY } = require('./const');
// 定时任务
function sendMsg(message, title) {
  notifier.notify({
    title: title || '嘿',
    message,
  });
}
// 小于10补0
function toZero(n) {
  return n < 10 ? `0${n}` : n;
}
/*
将分钟数转为小时
例如： 62 -> '01:02+'
*/
function mtoH(minute) {
  if (typeof minute === 'string') {
    return minute;
  }
  const h = toZero(Math.floor(minute / 60));
  const m = toZero(minute % 60);
  return `${h}:${m}`;
}
/*
将时间转分钟
例如：'10:12' -> 612  (分钟)
*/
function hToM(timeStr) {
  const [temH, temM] = timeStr.split(':');
  const h = temH * 60;
  const m = temM * 1;
  return h + m;
}
/*
根据起始时间和delay数组转为数组
例如：time:"10:30" delay:[60,120] -> ["11:30","13:30"]
*/
function timeToArrayByDelay(time, delay) {
  const m = hToM(time);
  const temRes = [time]; // 起始时间也放在里面
  delay.reduce((a, c) => {
    temRes.push(a + c);
    return a + c;
  }, m);
  return temRes.map((item) => mtoH(item));
}
// 根据count和delay得出多个时间
function getTimeByCount(time, count = 2, delay) {
  let res = [];
  if (Array.isArray(delay)) {
    res = timeToArrayByDelay(time, delay);
  } else {
    const temDelay = [];
    for (let index = 0; index < count; index++) {
      temDelay.push(delay);
    }
    res = timeToArrayByDelay(time, temDelay);
  }
  return res;
}
// 判断是否是周末
function isWeek() {
  return [6, 0].includes(new Date().getDay());
}
class ScheduleClass {
  constructor({ time, message, title }) {
    this.time = time;
    this.message = message;
    this.title = title;
    this.job = null;
  }

  // 每天在指定的时间点提醒
  getTime() {
    const d = this.time.split(':');
    return {
      hour: d[0],
      minute: d[1],
    };
  }

  // 定时发送
  sendScheduleMsg() {
    const d = this.getTime();
    this.job = schedule.scheduleJob(d, () => {
      sendMsg(this.message, this.title);
    });
  }

  // 取消定时任务
  cancelJob() {
    this.job.cancel();
  }
}
// 获取所有习惯并根据时间排序
function getAllTask(arr) {
  const res = [];
  for (let index = 0; index < arr.length; index++) {
    const item = arr[index];
    const {
      name, time, count, delay, stop,
    } = item;
    if (stop) {
      continue;
    }
    if (count) {
      const t = getTimeByCount(time, count, delay);
      t.forEach((tItem) => {
        res.push({
          name,
          time: tItem,
        });
      });
    } else {
      res.push({
        name,
        time,
      });
    }
  }
  // 根据时间排序
  res.sort((a, b) => hToM(a.time) - hToM(b.time));

  // 打印最终排序的字符串
  let resStr = '下面是一天的安排\n';
  res.forEach((item) => {
    resStr += `${item.time} ${item.name}\n`;
  });
  console.log(resStr);
}
// 对config.js的格式进行验证
function verifyConfig(arr) {
  let res = true;
  for (let index = 0; index < arr.length; index++) {
    const item = arr[index];
    const {
      name, time, delay, count,
    } = item;
    if (!name) {
      res = false;
      break;
    }
    if (!time) {
      res = false;
      break;
    }
    if (typeof delay === 'number' && !count) {
      res = false;
      break;
    }
  }
  return res;
}
// 通过第三方接口获取节假日信息
// 仓库地址：https://github.com/NateScarlet/holiday-cn
async function getOffDay() {
  const year = new Date().getFullYear();
  const url = `https://natescarlet.coding.net/p/github/d/holiday-cn/git/raw/master/${year}.json`;
  const res = await axios.get(url);
  return res.data.days;
}
// 判断当前日期是需要调休的工作日、正常工作日还是节假日
async function jumpDayType() {
  const nowDay = dayjs(new Date()).format('YYYY-MM-DD');
  const offDayArr = await getOffDay();
  const targetDay = offDayArr.find((item) => item.date === nowDay);
  if (targetDay) {
    return targetDay.isOffDay ? IS_OFF_DAY : IS_OVERTIME_DAY;
  }
  return IS_WORK_DAY;
}
module.exports = {
  ScheduleClass,
  isWeek,
  getTimeByCount,
  getAllTask,
  verifyConfig,
  jumpDayType,
};
