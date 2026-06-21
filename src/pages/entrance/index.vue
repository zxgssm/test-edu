<script setup>
import { onMounted, ref } from 'vue'
import { wechatSilentLogin } from '@/api/auth'
import { isUseCloud } from '@/config/cloud'
import {
  clearAuth,
  finishAuthFlow,
  redirectToChangePassword,
  redirectToLogin,
  setAuth,
  setMockOpenid,
} from '@/untils/auth'

const loadingText = ref('正在进行微信静默登录...')

const handleSilentLoginResult = (res) => {
  if (res.code !== 0) {
    uni.showToast({
      title: res.message || '登录失败',
      icon: 'none',
    })
    redirectToLogin()
    return
  }

  const { status, token, user } = res.data

  if (status === 'ok') {
    finishAuthFlow({ token, user })
    return
  }

  if (status === 'need_change_password') {
    setAuth({ token, user })
    redirectToChangePassword(true)
    return
  }

  redirectToLogin()
}

const runSilentLogin = async (mockOpenid) => {
  clearAuth()
  if (mockOpenid) setMockOpenid(mockOpenid)

  const res = await wechatSilentLogin({ mockOpenid })
  handleSilentLoginResult(res)
}

onMounted(() => {
  runSilentLogin()
})
</script>

<template>
  <view class="entrance-page">
    <view class="header">
      <view class="title">教培机构业绩助手</view>
      <view class="subtitle">随时随地掌握业绩，助力教培机构增长</view>
    </view>
    <view class="header-placeholder"></view>
    <view class="auth-card">
      <view class="loading-title">{{ loadingText }}</view>
      <view class="loading-desc">
        已绑定微信将自动进入系统；未绑定或更换微信后，需使用手机号和密码登录。
      </view>
      <view v-if="!isUseCloud()" class="mock-actions">
        <view class="mock-btn primary" @click="runSilentLogin('mock-openid-boss')">
          模拟已绑定老板
        </view>
        <view class="mock-btn" @click="runSilentLogin('mock-openid-unbound')">
          模拟需密码登录
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.entrance-page {
  min-height: 100vh;
  padding: 0 24rpx 40rpx;
  background: #f4f6fa;
}

.header {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 99;
  padding: calc(var(--status-bar-height) + 20rpx) 24rpx 24rpx;
  background: #f4f6fa;
}

.header-placeholder {
  height: calc(var(--status-bar-height) + 124rpx);
}

.title {
  color: #182033;
  font-size: 36rpx;
  font-weight: 700;
  line-height: 48rpx;
}

.subtitle {
  margin-top: 8rpx;
  color: #7e8a9d;
  font-size: 24rpx;
}

.auth-card {
  margin-top: 48rpx;
  padding: 36rpx 28rpx;
  border-radius: 24rpx;
  background: #ffffff;
  box-shadow: 0 12rpx 32rpx rgba(31, 72, 136, 0.06);
}

.loading-title {
  color: #182033;
  font-size: 34rpx;
  font-weight: 700;
}

.loading-desc {
  margin-top: 18rpx;
  color: #7e8a9d;
  font-size: 26rpx;
  line-height: 42rpx;
}

.mock-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 40rpx;
}

.mock-btn {
  flex: 1;
  height: 76rpx;
  border-radius: 14rpx;
  background: #eef3fb;
  color: #2f7df6;
  font-size: 26rpx;
  font-weight: 700;
  line-height: 76rpx;
  text-align: center;
}

.primary {
  background: #2f7df6;
  color: #ffffff;
}
</style>
