export const trendChart = {
  categories: ['5/1', '5/8', '5/15', '5/22', '5/31'],
  series: [
    {
      name: '实际业绩',
      data: [5200, 6100, 7200, 7800, 8620],
    },
    {
      name: '目标',
      data: [5000, 6000, 7000, 8200, 10000],
    },
  ],
}

export const courseChart = {
  series: [
    {
      data: [
        { name: '少儿英语', value: 58000 },
        { name: '数学思维', value: 28000 },
        { name: '编程启蒙', value: 12000 },
        { name: '绘画课程', value: 8200 },
      ],
    },
  ],
}

export const teachers = [
  { name: '张老师', phone: '138****0001', amount: 30000, target: 30000, rate: 100, status: '在职' },
  { name: '李老师', phone: '138****0002', amount: 25000, target: 25000, rate: 100, status: '在职' },
  { name: '王老师', phone: '138****0003', amount: 18000, target: 20000, rate: 90, status: '在职' },
  { name: '刘老师', phone: '138****0004', amount: 8600, target: 10000, rate: 86, status: '在职' },
  { name: '赵老师', phone: '138****0005', amount: 4400, target: 6000, rate: 73, status: '离职' },
]

export const rankingMap = {
  month: {
    label: '本月',
    list: teachers,
  },
  week: {
    label: '本周',
    list: [
      { name: '王老师', amount: 8200, target: 10000, rate: 82 },
      { name: '张老师', amount: 7600, target: 9000, rate: 84 },
      { name: '李老师', amount: 6100, target: 8000, rate: 76 },
      { name: '刘老师', amount: 3200, target: 5000, rate: 64 },
      { name: '赵老师', amount: 1800, target: 3000, rate: 60 },
    ],
  },
  today: {
    label: '今日',
    list: [
      { name: '李老师', amount: 2500, target: 3000, rate: 83 },
      { name: '张老师', amount: 1800, target: 2500, rate: 72 },
      { name: '刘老师', amount: 1500, target: 2000, rate: 75 },
      { name: '王老师', amount: 900, target: 1800, rate: 50 },
      { name: '赵老师', amount: 600, target: 1200, rate: 50 },
    ],
  },
}

export const orders = [
  { student: '少儿英语基础课', teacher: '张老师', amount: 1200, time: '2024-05-31 10:30' },
  { student: '数学提高班', teacher: '小红', amount: 2500, time: '2024-05-31 09:15' },
  { student: '编程启蒙课', teacher: '小明', amount: 900, time: '2024-05-30 18:20' },
  { student: '绘画课程', teacher: '小刚', amount: 1500, time: '2024-05-30 14:10' },
  { student: '钢琴初级课', teacher: '小兰', amount: 3000, time: '2024-05-29 19:00' },
]
