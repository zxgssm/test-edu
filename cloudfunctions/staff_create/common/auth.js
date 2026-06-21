const bcrypt = require('bcryptjs')

const SALT_ROUNDS = 10

exports.hashPassword = (plain) => bcrypt.hashSync(plain, SALT_ROUNDS)
exports.verifyPassword = (plain, hash) => bcrypt.compareSync(plain, hash)

exports.createToken = (userId) => `edu-${userId}-${Date.now()}`

exports.sanitizeUser = (user) => {
  const { passwordHash, ...rest } = user
  return { ...rest, id: user._id }
}

exports.getOpenid = (cloud) => cloud.getWXContext().OPENID
