const cloud = require('wx-server-sdk')
const { ok, fail } = require('./common/response')
const { db, requireBoss } = require('./common/db')
const { sanitizeUser } = require('./common/auth')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const boss = await requireBoss(event)
  if (!boss) return fail(403, '无权限')

  const { data } = await db.collection('users').where({
    institutionId: boss.institutionId,
    role: 'staff',
  }).get()

  const list = data.map((item) => ({
    id: item._id,
    name: item.name,
    phone: item.phone,
    target: item.target,
    status: item.status,
  }))

  return ok({ list })
}
