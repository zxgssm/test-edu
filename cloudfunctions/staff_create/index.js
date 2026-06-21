const cloud = require('wx-server-sdk')
const { ok, fail } = require('./common/response')
const { db, requireBoss, findUserByPhone } = require('./common/db')
const { hashPassword, sanitizeUser } = require('./common/auth')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const boss = await requireBoss(event)
  if (!boss) return fail(403, '无权限')

  const { name, phone, password, target } = event
  if (!name || !phone || !password || !target) {
    return fail(401, '请填写必填项')
  }

  const exists = await findUserByPhone(phone)
  if (exists) return fail(409, '该手机号已存在')

  const now = db.serverDate()
  const { _id } = await db.collection('users').add({
    data: {
      institutionId: boss.institutionId,
      name,
      phone,
      passwordHash: hashPassword(password),
      role: 'staff',
      mustChangePassword: true,
      status: 'pending_bind',
      target: Number(target),
      createdAt: now,
    },
  })

  const user = {
    _id,
    institutionId: boss.institutionId,
    name,
    phone,
    role: 'staff',
    mustChangePassword: true,
    status: 'pending_bind',
    target: Number(target),
  }

  return ok(sanitizeUser(user))
}
