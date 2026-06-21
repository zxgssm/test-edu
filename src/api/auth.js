import { isUseCloud } from '@/config/cloud'
import { callCloud } from '@/untils/cloud'
import {
  mockChangePassword,
  mockLogin,
  mockWechatSilentLogin,
} from '@/mock/auth'

export const wechatSilentLogin = (data) => {
  if (!isUseCloud()) return mockWechatSilentLogin(data)
  return callCloud('auth_silentLogin', data)
}

export const login = (data) => {
  if (!isUseCloud()) return mockLogin(data)
  return callCloud('auth_login', data)
}

export const changePassword = (data) => {
  if (!isUseCloud()) return mockChangePassword(data)
  return callCloud('auth_changePassword', data)
}
