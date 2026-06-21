import { getMockOpenid, setMockOpenid } from '@/untils/auth'

const MOCK_ACCOUNTS_KEY = 'edu_mock_accounts'

const DEFAULT_PASSWORDS = {
  boss: 'Boss@123',
  staff: 'Staff@123',
}

const defaultAccounts = [
  {
    id: 1,
    name: '机构老板',
    phone: '13900000001',
    password: DEFAULT_PASSWORDS.boss,
    role: 'boss',
    openid: 'mock-openid-boss',
    mustChangePassword: false,
    status: 'active',
    target: 0,
  },
  {
    id: 2,
    name: '张老师',
    phone: '13800000002',
    password: DEFAULT_PASSWORDS.staff,
    role: 'staff',
    openid: '',
    mustChangePassword: true,
    status: 'pending_bind',
    target: 10000,
  },
]

const delay = (data, timeout = 300) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), timeout)
  })
}

const toPublicUser = (account) => {
  const { password, ...user } = account
  return user
}

const getAccounts = () => {
  const accounts = uni.getStorageSync(MOCK_ACCOUNTS_KEY)
  if (accounts) return accounts

  uni.setStorageSync(MOCK_ACCOUNTS_KEY, defaultAccounts)
  return defaultAccounts
}

const saveAccounts = (accounts) => {
  uni.setStorageSync(MOCK_ACCOUNTS_KEY, accounts)
}

const findAccountIndexByOpenid = (accounts, openid) => {
  return accounts.findIndex((item) => item.openid === openid)
}

const findAccountIndexByPhone = (accounts, phone) => {
  return accounts.findIndex((item) => item.phone === phone)
}

const createToken = (account) => {
  return `mock-token-${account.role}-${account.id}`
}

const isOpenidUsedByOther = (accounts, openid, excludeIndex = -1) => {
  return accounts.some((item, index) => index !== excludeIndex && item.openid === openid)
}

export const mockWechatSilentLogin = async ({ mockOpenid } = {}) => {
  const openid = mockOpenid || getMockOpenid()
  setMockOpenid(openid)

  const accounts = getAccounts()
  const accountIndex = findAccountIndexByOpenid(accounts, openid)

  if (accountIndex < 0) {
    return delay({
      code: 0,
      data: {
        status: 'need_login',
      },
    })
  }

  const account = accounts[accountIndex]
  const user = toPublicUser(account)
  const token = createToken(account)

  if (account.mustChangePassword) {
    return delay({
      code: 0,
      data: {
        status: 'need_change_password',
        token,
        user,
      },
    })
  }

  return delay({
    code: 0,
    data: {
      status: 'ok',
      token,
      user,
    },
  })
}

export const mockLogin = async ({ phone, password }) => {
  const openid = getMockOpenid()
  const accounts = getAccounts()
  const accountIndex = findAccountIndexByPhone(accounts, phone)

  if (accountIndex < 0) {
    return delay({
      code: 404,
      message: '账号不存在，请联系老板',
    })
  }

  const account = accounts[accountIndex]
  if (account.password !== password) {
    return delay({
      code: 401,
      message: '手机号或密码错误',
    })
  }

  if (isOpenidUsedByOther(accounts, openid, accountIndex)) {
    return delay({
      code: 409,
      message: '该微信已绑定其他账号，请联系老板处理',
    })
  }

  accounts[accountIndex] = {
    ...account,
    openid,
    status: 'active',
  }
  saveAccounts(accounts)
  setMockOpenid(openid)

  const updated = accounts[accountIndex]

  return delay({
    code: 0,
    data: {
      token: createToken(updated),
      user: toPublicUser(updated),
      mustChangePassword: updated.mustChangePassword,
    },
  })
}

export const mockChangePassword = async ({ oldPassword, newPassword }) => {
  const openid = getMockOpenid()
  const accounts = getAccounts()
  const accountIndex = findAccountIndexByOpenid(accounts, openid)

  if (accountIndex < 0) {
    return delay({
      code: 401,
      message: '请先登录',
    })
  }

  const account = accounts[accountIndex]
  if (account.password !== oldPassword) {
    return delay({
      code: 401,
      message: '原密码错误',
    })
  }

  accounts[accountIndex] = {
    ...account,
    password: newPassword,
    mustChangePassword: false,
  }
  saveAccounts(accounts)

  return delay({
    code: 0,
    data: {
      user: toPublicUser(accounts[accountIndex]),
    },
  })
}

export const mockCreateStaff = async (staff) => {
  const accounts = getAccounts()
  const exists = accounts.some((item) => item.phone === staff.phone)

  if (exists) {
    return delay({
      code: 409,
      message: '该手机号已存在',
    })
  }

  const account = {
    id: Date.now(),
    name: staff.name,
    phone: staff.phone,
    password: staff.password,
    role: 'staff',
    openid: '',
    mustChangePassword: true,
    status: 'pending_bind',
    target: staff.target,
  }

  accounts.push(account)
  saveAccounts(accounts)

  return delay({
    code: 0,
    data: toPublicUser(account),
  })
}

export const MOCK_CREDENTIALS = DEFAULT_PASSWORDS
