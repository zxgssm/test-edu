const TOKEN_KEY = 'edu_token'
const USER_KEY = 'edu_user'
const PENDING_OPENID_KEY = 'edu_pending_openid'
const MOCK_OPENID_KEY = 'edu_mock_openid'

export const roleHomeMap = {
  boss: '/pages/modules/boss/home/index',
  staff: '/pages/modules/staff/home/index',
}

export const setAuth = ({ token, user }) => {
  uni.setStorageSync(TOKEN_KEY, token)
  uni.setStorageSync(USER_KEY, user)
}

export const getToken = () => uni.getStorageSync(TOKEN_KEY)

export const getUser = () => uni.getStorageSync(USER_KEY)

export const clearAuth = () => {
  uni.removeStorageSync(TOKEN_KEY)
  uni.removeStorageSync(USER_KEY)
}

export const setPendingOpenid = (openid) => {
  uni.setStorageSync(PENDING_OPENID_KEY, openid)
}

export const getPendingOpenid = () => uni.getStorageSync(PENDING_OPENID_KEY)

export const clearPendingOpenid = () => {
  uni.removeStorageSync(PENDING_OPENID_KEY)
}

export const setMockOpenid = (openid) => {
  uni.setStorageSync(MOCK_OPENID_KEY, openid)
}

export const getMockOpenid = () => {
  return uni.getStorageSync(MOCK_OPENID_KEY) || 'mock-openid-unbound'
}

export const redirectByRole = (role) => {
  uni.redirectTo({
    url: roleHomeMap[role] || '/pages/auth/bind',
  })
}
