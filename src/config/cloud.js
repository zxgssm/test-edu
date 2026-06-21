// 填入微信云开发环境 ID；留空则小程序端使用 Mock
export const CLOUD_ENV_ID = 'cloud1-d9giz8hov35ed57f9'

export function isUseCloud() {
  // #ifdef MP-WEIXIN
  return !!(CLOUD_ENV_ID && typeof wx !== 'undefined' && wx.cloud)
  // #endif
  // #ifndef MP-WEIXIN
  return false
  // #endif
}
