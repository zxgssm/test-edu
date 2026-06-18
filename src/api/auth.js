import {
  mockBindPhone,
  mockCreateStaff,
  mockWechatSilentLogin,
} from '@/mock/auth'

export const wechatSilentLogin = (data) => {
  return mockWechatSilentLogin(data)
}

export const bindPhone = (data) => {
  return mockBindPhone(data)
}

export const createStaffAccount = (data) => {
  return mockCreateStaff(data)
}
