import { clearAuth, getToken } from '@/untils/auth'

const BASE_URL = ''

export default function request(options = {}) {
  const { url, method = 'GET', data = {}, header = {} } = options
  const token = getToken()

  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header: {
        'content-type': options.contentType || 'application/json',
        Authorization: token || '',
        ...header,
      },
      success: (res) => {
        if (res.data?.code === 401) {
          clearAuth()
          uni.redirectTo({ url: '/pages/entrance/index' })
          return
        }

        resolve(res.data)
      },
      fail: reject,
    })
  })
}
