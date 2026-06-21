const cloud = require('wx-server-sdk')
const { ok, fail } = require('./common/response')
const { db, requireStaff } = require('./common/db')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const staff = await requireStaff(event)
  if (!staff) return fail(403, '无权限')

  const { data } = await db.collection('orders')
    .where({ staffId: staff._id })
    .orderBy('createdAt', 'desc')
    .limit(50)
    .get()

  const list = data.map((item) => ({
    id: item._id,
    studentName: item.studentName,
    courseName: item.courseName,
    student: item.courseName,
    teacher: item.studentName,
    amount: item.amount,
    remark: item.remark,
    createdAt: item.createdAt,
    time: formatTime(item.createdAt),
  }))

  return ok({ list })
}

function formatTime(value) {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}
