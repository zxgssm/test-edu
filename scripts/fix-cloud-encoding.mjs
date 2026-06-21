import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '../cloudfunctions')

const t = (...codes) => String.fromCodePoint(...codes)

const MSG = {
  noPermission: t(0x65e0, 0x6743, 0x9650),
  required: t(0x8bf7, 0x586b, 0x5199, 0x5fc5, 0x586b, 0x9879),
  phoneExists: t(0x8be5, 0x624b, 0x673a, 0x53f7, 0x5df2, 0x5b58, 0x5728),
  bossExists: t(0x8001, 0x677f, 0x8d26, 0x53f7, 0x5df2, 0x5b58, 0x5728, 0xff0c, 0x8df3, 0x8fc7, 0x521d, 0x59cb, 0x5316),
  initDone: t(0x521d, 0x59cb, 0x5316, 0x5b8c, 0x6210),
  sunnyEdu: t(0x9633, 0x5149, 0x6559, 0x80b2),
  orgBoss: t(0x673a, 0x6784, 0x8001, 0x677f),
  employed: t(0x5728, 0x804c),
  loginFirst: t(0x8bf7, 0x5148, 0x767b, 0x5f55),
  incomplete: t(0x8bf7, 0x586b, 0x5199, 0x5b8c, 0x6574),
  wrongOldPassword: t(0x539f, 0x5bc6, 0x7801, 0x9519, 0x8bef),
  invalidAmount: t(0x8ba2, 0x5355, 0x91d1, 0x989d, 0x65e0, 0x6548),
}

const files = {
  'auth_changePassword/index.js': `const cloud = require('wx-server-sdk')
const { ok, fail } = require('./common/response')
const { db, getAuthUser } = require('./common/db')
const { verifyPassword, hashPassword, sanitizeUser } = require('./common/auth')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const { oldPassword, newPassword } = event
  const user = await getAuthUser(event)
  if (!user) return fail(401, '${MSG.loginFirst}')
  if (!oldPassword || !newPassword) return fail(401, '${MSG.incomplete}')
  if (!verifyPassword(oldPassword, user.passwordHash)) {
    return fail(401, '${MSG.wrongOldPassword}')
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
`,
  'seed_boss/index.js': `const cloud = require('wx-server-sdk')
const { ok, fail } = require('./common/response')
const { db } = require('./common/db')
const { hashPassword } = require('./common/auth')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const BOSS_PHONE = '13900000001'
const BOSS_PASSWORD = 'Boss@123'

exports.main = async () => {
  const { total } = await db.collection('users').where({ role: 'boss' }).count()
  if (total > 0) {
    return ok({ message: '${MSG.bossExists}' })
  }

  const now = db.serverDate()
  const { _id: institutionId } = await db.collection('institutions').add({
    data: {
      name: '${MSG.sunnyEdu}',
      monthlyTarget: 100000,
      createdAt: now,
    },
  })

  await db.collection('users').add({
    data: {
      institutionId,
      name: '${MSG.orgBoss}',
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
    message: '${MSG.initDone}',
    institutionId,
    bossPhone: BOSS_PHONE,
    bossPassword: BOSS_PASSWORD,
  })
}
`,
  'staff_create/index.js': `const cloud = require('wx-server-sdk')
const { ok, fail } = require('./common/response')
const { db, requireBoss, findUserByPhone } = require('./common/db')
const { hashPassword, sanitizeUser } = require('./common/auth')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const boss = await requireBoss(event)
  if (!boss) return fail(403, '${MSG.noPermission}')

  const { name, phone, password, target } = event
  if (!name || !phone || !password || !target) {
    return fail(401, '${MSG.required}')
  }

  const exists = await findUserByPhone(phone)
  if (exists) return fail(409, '${MSG.phoneExists}')

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
`,
  'staff_list/index.js': `const cloud = require('wx-server-sdk')
const { ok, fail } = require('./common/response')
const { db, requireBoss } = require('./common/db')
const { sanitizeUser } = require('./common/auth')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const boss = await requireBoss(event)
  if (!boss) return fail(403, '${MSG.noPermission}')

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
`,
  'staff_dashboard/index.js': `const cloud = require('wx-server-sdk')
const { ok, fail } = require('./common/response')
const { requireStaff } = require('./common/db')
const { getStaffStats } = require('./common/stats')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const staff = await requireStaff(event)
  if (!staff) return fail(403, '${MSG.noPermission}')

  const stats = await getStaffStats(staff._id, staff.target)
  return ok(stats)
}
`,
  'order_list/index.js': `const cloud = require('wx-server-sdk')
const { ok, fail } = require('./common/response')
const { db, requireStaff } = require('./common/db')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const staff = await requireStaff(event)
  if (!staff) return fail(403, '${MSG.noPermission}')

  const { data } = await db.collection('orders')
    .where({ staffId: staff._id })
    .orderBy('createdAt', 'desc')
    .limit(50)
    .get()

  const list = data.map((item) => ({
    id: item._id,
    studentName: item.studentName,
    courseName: item.courseName,
    student: item.courseName,
    teacher: item.studentName,
    amount: item.amount,
    remark: item.remark,
    createdAt: item.createdAt,
    time: formatTime(item.createdAt),
  }))

  return ok({ list })
}

function formatTime(value) {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return \`\${date.getFullYear()}-\${pad(date.getMonth() + 1)}-\${pad(date.getDate())} \${pad(date.getHours())}:\${pad(date.getMinutes())}\`
}
`,
  'order_create/index.js': `const cloud = require('wx-server-sdk')
const { ok, fail } = require('./common/response')
const { db, requireStaff } = require('./common/db')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const staff = await requireStaff(event)
  if (!staff) return fail(403, '${MSG.noPermission}')

  const { studentName, courseName, amount, remark = '' } = event
  if (!studentName || !courseName || !amount) {
    return fail(401, '${MSG.required}')
  }

  const orderAmount = Number(amount)
  if (!orderAmount || orderAmount <= 0) {
    return fail(401, '${MSG.invalidAmount}')
  }

  const order = {
    institutionId: staff.institutionId,
    staffId: staff._id,
    staffName: staff.name,
    studentName,
    courseName,
    amount: orderAmount,
    remark,
    createdAt: db.serverDate(),
  }

  const { _id } = await db.collection('orders').add({ data: order })

  return ok({
    order: {
      ...order,
      _id,
      id: _id,
    },
  })
}
`,
  'boss_target/index.js': `const cloud = require('wx-server-sdk')
const { ok, fail } = require('./common/response')
const { requireBoss } = require('./common/db')
const { getInstitutionStats } = require('./common/stats')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const boss = await requireBoss(event)
  if (!boss) return fail(403, '${MSG.noPermission}')

  const stats = await getInstitutionStats(boss.institutionId)
  return ok({
    monthAmount: stats.monthAmount,
    monthTarget: stats.monthTarget,
    completionRate: stats.monthProgress,
  })
}
`,
  'boss_dashboard/index.js': `const cloud = require('wx-server-sdk')
const { ok, fail } = require('./common/response')
const { requireBoss } = require('./common/db')
const { getInstitutionStats } = require('./common/stats')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const boss = await requireBoss(event)
  if (!boss) return fail(403, '${MSG.noPermission}')

  const stats = await getInstitutionStats(boss.institutionId)
  return ok(stats)
}
`,
  'boss_ranking/index.js': `const cloud = require('wx-server-sdk')
const { ok, fail } = require('./common/response')
const { db, requireBoss } = require('./common/db')
const { getStaffMonthAmount } = require('./common/stats')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const boss = await requireBoss(event)
  if (!boss) return fail(403, '${MSG.noPermission}')

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
        status: '${MSG.employed}',
      }
    }),
  )

  list.sort((a, b) => b.amount - a.amount)

  return ok({ list })
}
`,
}

for (const [relPath, content] of Object.entries(files)) {
  const file = join(root, relPath)
  writeFileSync(file, content, 'utf8')
  console.log('fixed', relPath)
}

console.log('done', JSON.stringify(MSG))
