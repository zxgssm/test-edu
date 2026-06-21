const cloud = require('wx-server-sdk')
const { ok, fail } = require('./common/response')
const { requireBoss } = require('./common/db')
const { getInstitutionStats } = require('./common/stats')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const boss = await requireBoss(event)
  if (!boss) return fail(403, '无权限')

  const stats = await getInstitutionStats(boss.institutionId)
  return ok({
    monthAmount: stats.monthAmount,
    monthTarget: stats.monthTarget,
    completionRate: stats.monthProgress,
  })
}
