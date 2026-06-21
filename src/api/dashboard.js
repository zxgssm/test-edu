import { isUseCloud } from '@/config/cloud'
import { callCloud } from '@/untils/cloud'
import { rankingMap } from '@/mock/dashboard'

const mockBossDashboard = {
  todayAmount: 5800,
  monthAmount: 86200,
  monthTarget: 100000,
  monthProgress: 86,
}

const mockStaffDashboard = {
  todayAmount: 1500,
  monthAmount: 8200,
  monthTarget: 10000,
  monthProgress: 82,
}

export const queryBossDashboard = () => {
  if (!isUseCloud()) {
    return Promise.resolve({ code: 0, data: mockBossDashboard })
  }
  return callCloud('boss_dashboard')
}

export const queryBossTarget = () => {
  if (!isUseCloud()) {
    return Promise.resolve({
      code: 0,
      data: {
        monthAmount: mockBossDashboard.monthAmount,
        monthTarget: mockBossDashboard.monthTarget,
        completionRate: mockBossDashboard.monthProgress,
      },
    })
  }
  return callCloud('boss_target')
}

export const queryBossRanking = () => {
  if (!isUseCloud()) {
    return Promise.resolve({
      code: 0,
      data: { list: rankingMap.month.list },
    })
  }
  return callCloud('boss_ranking')
}

export const queryStaffDashboard = () => {
  if (!isUseCloud()) {
    return Promise.resolve({ code: 0, data: mockStaffDashboard })
  }
  return callCloud('staff_dashboard')
}
