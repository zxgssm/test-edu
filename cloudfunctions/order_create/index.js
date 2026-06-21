const cloud = require('wx-server-sdk')
const { ok, fail } = require('./common/response')
const { db, requireStaff } = require('./common/db')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const staff = await requireStaff(event)
  if (!staff) return fail(403, '无权限')

  const { studentName, courseName, amount, remark = '' } = event
  if (!studentName || !courseName || !amount) {
    return fail(401, '请填写必填项')
  }

  const orderAmount = Number(amount)
  if (!orderAmount || orderAmount <= 0) {
    return fail(401, '订单金额无效')
  }

  const order = {
    institutionId: staff.institutionId,
    staffId: staff._id,
    staffName: staff.name,
    studentName,
    courseName,
    amount: orderAmount,
    remark,
    createdAt: db.serverDate(),
  }

  const { _id } = await db.collection('orders').add({ data: order })

  return ok({
    order: {
      ...order,
      _id,
      id: _id,
    },
  })
}
