const cloud = require('wx-server-sdk')
const { ok, fail } = require('./common/response')
const { db, getAuthUser } = require('./common/db')
const { verifyPassword, hashPassword, sanitizeUser } = require('./common/auth')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const { oldPassword, newPassword } = event
  const user = await getAuthUser(event)
  if (!user) return fail(401, '请先登录')
  if (!oldPassword || !newPassword) return fail(401, '请填写完整')
  if (!verifyPassword(oldPassword, user.passwordHash)) {
    return fail(401, '原密码错误')
  }

  await db.collection('users').doc(user._id).update({
    data: {
      passwordHash: hashPassword(newPassword),
      mustChangePassword: false,
    },
  })

  const updated = {
    ...user,
    mustChangePassword: false,
  }

  return ok({ user: sanitizeUser(updated) })
}
