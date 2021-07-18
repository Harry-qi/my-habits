module.exports = [
  {
    name: '滴眼药水',
    message: '休息会儿，给眼睛放松下',
    time: '10:00',
    skipWeek: true,
    count: 4,
    delay: 60 * 2,
  },
  {
    name: '吃维生素',
    message: '及时补充维生素',
    time: '09:00',
    count: 2,
    delay: [60 * 3 + 25, 60 * 6],
  },
  {
    name: '基金',
    time: '14:30',
    skipWeek: true,
    message: '加仓加仓',
  },
  {
    name: '点奶茶',
    time: '15:00',
    message: '三点几嚟,饮茶先啦',
  },
  {
    name: '下班',
    time: '18:00',
    message: '做咩啊，下班',
  },
];
