const TOKEN_KEY = 'edu_token'
const USER_KEY = 'edu_user'
const MOCK_OPENID_KEY = 'edu_mock_openid'

export const roleHomeMap = {
  boss: '/pages/modules/boss/home/index',
  staff: '/pages/modules/staff/home/index',
}

export const LOGIN_URL = '/pages/auth/login'
export const ENTRANCE_URL = '/pages/entrance/index'
export const CHANGE_PASSWORD_URL = '/pages/modules/staff/user/password'

export const setAuth = ({ token, user }) => {
  uni.setStorageSync(TOKEN_KEY, token)
  uni.setStorageSync(USER_KEY, user)
}

export const updateUser = (user) => {
  uni.setStorageSync(USER_KEY, user)
}

export const getToken = () => uni.getStorageSync(TOKEN_KEY)

export const getUser = () => uni.getStorageSync(USER_KEY)

export const clearAuth = () => {
  uni.removeStorageSync(TOKEN_KEY)
  uni.removeStorageSync(USER_KEY)
}

export const setMockOpenid = (openid) => {
  uni.setStorageSync(MOCK_OPENID_KEY, openid)
}

export const getMockOpenid = () => {
  return uni.getStorageSync(MOCK_OPENID_KEY) || 'mock-openid-unbound'
}

export const redirectByRole = (role) => {
  uni.redirectTo({
    url: roleHomeMap[role] || LOGIN_URL,
  })
}

export const redirectToLogin = () => {
  uni.redirectTo({ url: LOGIN_URL })
}

export const redirectToChangePassword = (required = false) => {
  const url = required
    ? `${CHANGE_PASSWORD_URL}?required=1`
    : CHANGE_PASSWORD_URL
  uni.redirectTo({ url })
}

export const finishAuthFlow = ({ token, user, mustChangePassword }) => {
  setAuth({ token, user })

  if (mustChangePassword || user?.mustChangePassword) {
    redirectToChangePassword(true)
    return
  }

  redirectByRole(user.role)
}
