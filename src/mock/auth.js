import { getMockOpenid, setMockOpenid } from '@/untils/auth'

const MOCK_ACCOUNTS_KEY = 'edu_mock_accounts'

const defaultAccounts = [
  {
    id: 1,
    name: '机构老板',
    phone: '13900000001',
    role: 'boss',
    openid: 'mock-openid-boss',
    status: 'active',
  },
  {
    id: 2,
    name: '张老师',
    phone: '13800000002',
    role: 'staff',
    openid: '',
    status: 'pending_bind',
    target: 10000,
  },
]

const delay = (data, timeout = 300) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), timeout)
  })
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

const createToken = (account) => {
  return `mock-token-${account.role}-${account.id}`
}

export const mockWechatSilentLogin = async ({ mockOpenid } = {}) => {
  const openid = mockOpenid || getMockOpenid()
  setMockOpenid(openid)

  const account = getAccounts().find((item) => item.openid === openid)
  if (!account) {
    return delay({
      code: 0,
      data: {
        bindStatus: 'unbound',
        openid,
      },
    })
  }

  return delay({
    code: 0,
    data: {
      bindStatus: 'bound',
      token: createToken(account),
      user: account,
    },
  })
}

export const mockBindPhone = async ({ openid, phone }) => {
  const accounts = getAccounts()
  const accountIndex = accounts.findIndex((item) => item.phone === phone)

  if (accountIndex < 0) {
    return delay({
      code: 404,
      message: '未找到老板预先创建的员工账号，请联系老板添加手机号',
    })
  }

  const account = accounts[accountIndex]
  if (account.openid && account.openid !== openid) {
    return delay({
      code: 409,
      message: '该手机号已绑定其他微信，请联系老板处理',
    })
  }

  accounts[accountIndex] = {
    ...account,
    openid,
    status: 'active',
  }
  saveAccounts(accounts)
  setMockOpenid(openid)

  return delay({
    code: 0,
    data: {
      token: createToken(accounts[accountIndex]),
      user: accounts[accountIndex],
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
    ...staff,
    id: Date.now(),
    role: 'staff',
    openid: '',
    status: 'pending_bind',
  }

  accounts.push(account)
  saveAccounts(accounts)

  return delay({
    code: 0,
    data: account,
  })
}
