const allHabits = require('../config');
const {
  ScheduleClass, getTimeByCount, getAllTask, verifyConfig, jumpDayType,
} = require('./utils');
const { IS_OFF_DAY, IS_OVERTIME_DAY } = require('./const');

// 开始任务
function startJob(time, message, title) {
  const q = {
    time,
    message,
    title,
  };
  const scheduleJob = new ScheduleClass(q);
  scheduleJob.sendScheduleMsg();
}

async function init() {
  if (!verifyConfig(allHabits)) {
    console.log('请检查config.js的配置');
    return;
  }
  getAllTask(allHabits);
  const dayType = await jumpDayType();
  for (let index = 0; index < allHabits.length; index++) {
    const item = allHabits[index];
    // 如果设置跳过了节假日,并且今天是休息的节假日,则不执行提醒
    if ((item.skipWeek && jumpDayType() === IS_OFF_DAY) || item.stop) {
      continue;
    }
    const {
      time, name: title, count, delay,
    } = item;
    let { message } = item;
    if (dayType === IS_OVERTIME_DAY) {
      message = `今天依旧是工作日，${message}`;
    }
    // 需要重复提醒的
    if (count) {
      const t = getTimeByCount(time, count, delay);
      t.forEach((tItem) => {
        startJob(tItem, message, title);
      });
    } else {
      // 不需要重复提醒
      startJob(time, message, title);
    }
  }
}
init();
