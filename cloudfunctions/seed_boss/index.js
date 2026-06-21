const cloud = require('wx-server-sdk')
const { ok, fail } = require('./common/response')
const { db } = require('./common/db')
const { hashPassword } = require('./common/auth')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const BOSS_PHONE = '13900000001'
const BOSS_PASSWORD = 'Boss@123'

exports.main = async () => {
  const { total } = await db.collection('users').where({ role: 'boss' }).count()
  if (total > 0) {
    return ok({ message: '老板账号已存在，跳过初始化' })
  }

  const now = db.serverDate()
  const { _id: institutionId } = await db.collection('institutions').add({
    data: {
      name: '阳光教育',
      monthlyTarget: 100000,
      createdAt: now,
    },
  })

  await db.collection('users').add({
    data: {
      institutionId,
      name: '机构老板',
      phone: BOSS_PHONE,
      role: 'boss',
      passwordHash: hashPassword(BOSS_PASSWORD),
      mustChangePassword: true,
      status: 'pending_bind',
      target: 0,
      createdAt: now,
    },
  })

  return ok({
    message: '初始化完成',
    institutionId,
    bossPhone: BOSS_PHONE,
    bossPassword: BOSS_PASSWORD,
  })
}
