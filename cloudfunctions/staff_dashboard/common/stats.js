const { db, _ } = require('./db')
const { getTodayRange, getMonthRange } = require('./date')

async function sumOrders(where, range) {
  const { start, end } = range
  const { data } = await db.collection('orders').where({
    ...where,
    createdAt: _.gte(start).and(_.lte(end)),
  }).get()
  return data.reduce((sum, o) => sum + Number(o.amount || 0), 0)
}

exports.getInstitutionStats = async (institutionId) => {
  const where = { institutionId }
  const todayAmount = await sumOrders(where, getTodayRange())
  const monthAmount = await sumOrders(where, getMonthRange())

  let monthTarget = 0
  try {
    const { data: inst } = await db.collection('institutions').doc(institutionId).get()
    monthTarget = inst?.monthlyTarget || 0
  } catch (e) {
    monthTarget = 0
  }

  const monthProgress = monthTarget
    ? Math.min(100, Math.round((monthAmount / monthTarget) * 100))
    : 0

  return { todayAmount, monthAmount, monthTarget, monthProgress }
}

exports.getStaffStats = async (staffId, target) => {
  const where = { staffId }
  const todayAmount = await sumOrders(where, getTodayRange())
  const monthAmount = await sumOrders(where, getMonthRange())
  const monthTarget = target || 0
  const monthProgress = monthTarget
    ? Math.min(100, Math.round((monthAmount / monthTarget) * 100))
    : 0
  return { todayAmount, monthAmount, monthTarget, monthProgress }
}

exports.getStaffMonthAmount = async (staffId) => {
  return sumOrders({ staffId }, getMonthRange())
}
