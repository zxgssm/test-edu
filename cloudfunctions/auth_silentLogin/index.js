const cloud = require('wx-server-sdk')
const { ok, fail } = require('./common/response')
const { findUserByOpenid } = require('./common/db')
const { createToken, sanitizeUser, getOpenid } = require('./common/auth')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async () => {
  const openid = getOpenid(cloud)
  if (!openid) return fail(401, '无法获取 OPENID')

  const user = await findUserByOpenid(openid)
  if (!user) {
    return ok({ status: 'need_login' })
  }

  const token = createToken(user._id)
  const publicUser = sanitizeUser(user)

  if (user.mustChangePassword) {
    return ok({ status: 'need_change_password', token, user: publicUser })
  }

  return ok({ status: 'ok', token, user: publicUser })
}
