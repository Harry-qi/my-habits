const schedule = require('node-schedule');
const notifier = require('node-notifier');
// 定时任务
function sendMsg(message, title) {
  notifier.notify({
    title: title || '嘿',
    message,
  });
}
// 根据count和delay得出多个时间
function getTimeByCount(time, count = 2, delay = 1) {
  const res = [];
  const temTime = time.split(':');
  const h = temTime[0] * 1;
  const m = temTime[1] * 1;
  for (let index = 0; index < count; index++) {
    res.push(`${h + Math.floor((delay * index) / 60)}:${m + ((delay * index) % 60)}`);
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
module.exports = {
  ScheduleClass,
  isWeek,
  getTimeByCount,
};
