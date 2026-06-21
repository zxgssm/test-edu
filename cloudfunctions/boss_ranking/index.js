const cloud = require('wx-server-sdk')
const { ok, fail } = require('./common/response')
const { db, requireBoss } = require('./common/db')
const { getStaffMonthAmount } = require('./common/stats')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const boss = await requireBoss(event)
  if (!boss) return fail(403, '无权限')

  const { data: staffList } = await db.collection('users').where({
    institutionId: boss.institutionId,
    role: 'staff',
    status: 'active',
  }).get()

  const list = await Promise.all(
    staffList.map(async (staff) => {
      const amount = await getStaffMonthAmount(staff._id)
      const target = staff.target || 0
      const rate = target ? Math.min(100, Math.round((amount / target) * 100)) : 0
      return {
        name: staff.name,
        amount,
        target,
        rate,
        status: '在职',
      }
    }),
  )

  list.sort((a, b) => b.amount - a.amount)

  return ok({ list })
}
