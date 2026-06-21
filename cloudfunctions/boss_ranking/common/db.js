const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const _ = db.command

exports.db = db
exports._ = _
exports.cloud = cloud

exports.findUserByOpenid = async (openid) => {
  const { data } = await db.collection('users').where({ openid }).limit(1).get()
  return data[0] || null
}

exports.findUserByPhone = async (phone) => {
  const { data } = await db.collection('users').where({ phone }).limit(1).get()
  return data[0] || null
}

exports.isOpenidUsedByOther = async (openid, excludeUserId) => {
  const { data } = await db.collection('users').where({ openid }).limit(1).get()
  const other = data[0]
  return other && other._id !== excludeUserId
}

exports.getAuthUser = async (event) => {
  const { OPENID } = cloud.getWXContext()
  const token = event.token || ''
  const userId = (token.match(/^edu-([^-]+)-/) || [])[1]
  if (!userId) return null

  try {
    const { data: user } = await db.collection('users').doc(userId).get()
    if (!user || user.openid !== OPENID) return null
    return user
  } catch (e) {
    return null
  }
}

exports.requireBoss = async (event) => {
  const user = await exports.getAuthUser(event)
  if (!user || user.role !== 'boss') return null
  return user
}

exports.requireStaff = async (event) => {
  const user = await exports.getAuthUser(event)
  if (!user || user.role !== 'staff') return null
  return user
}
