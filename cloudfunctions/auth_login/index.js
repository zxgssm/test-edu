const cloud = require('wx-server-sdk')
const { ok, fail } = require('./common/response')
const { db, findUserByPhone, isOpenidUsedByOther } = require('./common/db')
const { verifyPassword, createToken, sanitizeUser, getOpenid } = require('./common/auth')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const { phone, password } = event
  const openid = getOpenid(cloud)

  if (!phone || !password) return fail(401, '手机号或密码错误')
  if (!openid) return fail(401, '无法获取 OPENID')

  const user = await findUserByPhone(phone)
  if (!user) return fail(404, '账号不存在，请联系老板')
  if (!verifyPassword(password, user.passwordHash)) {
    return fail(401, '手机号或密码错误')
  }

  if (await isOpenidUsedByOther(openid, user._id)) {
    return fail(409, '该微信已绑定其他账号，请联系老板处理')
  }

  await db.collection('users').doc(user._id).update({
    data: {
      openid,
      status: 'active',
    },
  })

  const updated = { ...user, openid, status: 'active' }
  const token = createToken(user._id)

  return ok({
    token,
    user: sanitizeUser(updated),
    mustChangePassword: !!updated.mustChangePassword,
  })
}
