const cloud = require('wx-server-sdk')
const { ok, fail } = require('./common/response')
const { requireStaff } = require('./common/db')
const { getStaffStats } = require('./common/stats')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const staff = await requireStaff(event)
  if (!staff) return fail(403, '无权限')

  const stats = await getStaffStats(staff._id, staff.target)
  return ok(stats)
}
