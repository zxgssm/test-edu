import { getToken } from '@/untils/auth'

export function callCloud(name, data = {}) {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    if (!wx.cloud) {
      reject(new Error('wx.cloud 不可用'))
      return
    }

    const token = getToken()
    wx.cloud.callFunction({
      name,
      data: {
        ...data,
        ...(token ? { token } : {}),
      },
      success: (res) => resolve(res.result),
      fail: reject,
    })
    // #endif

    // #ifndef MP-WEIXIN
    reject(new Error('仅支持微信小程序'))
    // #endif
  })
}
