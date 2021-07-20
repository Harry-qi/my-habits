const allHabits = require('../config');
const {
  isWeek, ScheduleClass, getTimeByCount, getAllTask,
} = require('./utils');

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

function init() {
  getAllTask(allHabits);
  for (let index = 0; index < allHabits.length; index++) {
    const item = allHabits[index];
    // 如果设置跳过了周末,并且今天是周末,则不执行提醒
    if (item.skipWeek && isWeek()) {
      continue;
    }
    const {
      time, name: title, message, count, delay,
    } = item;
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
