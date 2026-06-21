<script setup>
import { reactive, ref } from 'vue'
import { login } from '@/api/auth'
import { finishAuthFlow } from '@/untils/auth'
import { MOCK_CREDENTIALS } from '@/mock/auth'

const form = reactive({
  phone: '',
  password: '',
})

const loading = ref(false)

const useMockStaff = () => {
  form.phone = '13800000002'
  form.password = MOCK_CREDENTIALS.staff
}

const useMockBoss = () => {
  form.phone = '13900000001'
  form.password = MOCK_CREDENTIALS.boss
}

const submitLogin = async () => {
  if (!form.phone || !form.password) {
    uni.showToast({
      title: '请输入手机号和密码',
      icon: 'none',
    })
    return
  }

  loading.value = true
  const res = await login({
    phone: form.phone,
    password: form.password,
  })
  loading.value = false

  if (res.code !== 0) {
    uni.showToast({
      title: res.message,
      icon: 'none',
    })
    return
  }

  uni.showToast({
    title: '登录成功',
    icon: 'success',
  })

  setTimeout(() => {
    finishAuthFlow(res.data)
  }, 300)
}
</script>

<template>
  <view class="login-page">
    <view class="nav-placeholder">
      <view class="page-title">账号登录</view>
    </view>
    <view class="fixed-header-placeholder"></view>
    <view class="login-card">
      <view class="title">使用手机号登录</view>
      <view class="desc">
        首次登录或更换微信后，请使用老板提供的手机号和初始密码登录。登录成功后将自动绑定当前微信。
      </view>

      <view class="form-item">
        <text class="label">手机号</text>
        <input
          v-model="form.phone"
          class="input"
          type="number"
          maxlength="11"
          placeholder="请输入手机号"
        />
      </view>

      <view class="form-item">
        <text class="label">密码</text>
        <input
          v-model="form.password"
          class="input"
          password
          placeholder="请输入密码"
        />
      </view>

      <view class="mock-tips">
        <view class="mock-tip" @click="useMockBoss">mock 老板：13900000001</view>
        <view class="mock-tip" @click="useMockStaff">mock 员工：13800000002</view>
      </view>

      <button
        class="submit-btn"
        :class="{ disabled: loading }"
        :disabled="loading"
        @click="submitLogin"
      >
        {{ loading ? '登录中...' : '登录' }}
      </button>
    </view>

    <view class="rule-card">
      <view class="rule-title">登录说明</view>
      <view class="rule-item">1. 已绑定微信的用户，打开小程序会自动登录。</view>
      <view class="rule-item">2. 首次登录需使用老板创建的账号密码，并按要求修改密码。</view>
      <view class="rule-item">3. 更换微信后，需重新使用手机号密码登录。</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  padding: 0 24rpx 40rpx;
  background: #f4f6fa;
}

.nav-placeholder {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 99;
  display: flex;
  align-items: center;
  min-height: 88rpx;
  padding: var(--status-bar-height) 24rpx 0;
  background: #f4f6fa;
}

.fixed-header-placeholder {
  height: calc(var(--status-bar-height) + 88rpx);
}

.page-title {
  color: #182033;
  font-size: 36rpx;
  font-weight: 700;
}

.login-card,
.rule-card {
  padding: 32rpx 28rpx;
  border-radius: 24rpx;
  background: #ffffff;
  box-shadow: 0 12rpx 32rpx rgba(31, 72, 136, 0.06);
}

.title {
  color: #182033;
  font-size: 34rpx;
  font-weight: 700;
}

.desc {
  margin-top: 18rpx;
  color: #7e8a9d;
  font-size: 26rpx;
  line-height: 42rpx;
}

.form-item {
  margin-top: 28rpx;
}

.label {
  display: block;
  margin-bottom: 14rpx;
  color: #182033;
  font-size: 26rpx;
  font-weight: 600;
}

.input {
  width: 100%;
  height: 88rpx;
  padding: 0 24rpx;
  border-radius: 14rpx;
  background: #f7f8fb;
  color: #182033;
  font-size: 28rpx;
}

.mock-tips {
  margin: 20rpx 0 32rpx;
}

.mock-tip {
  margin-bottom: 8rpx;
  color: #2f7df6;
  font-size: 24rpx;
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 88rpx;
  border-radius: 16rpx;
  background: linear-gradient(135deg, #22bf74, #13a960);
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 600;
  line-height: 1;
}

.submit-btn::after {
  border: 0;
}

.disabled {
  opacity: 0.45;
}

.rule-card {
  margin-top: 24rpx;
}

.rule-title {
  margin-bottom: 18rpx;
  color: #182033;
  font-size: 28rpx;
  font-weight: 700;
}

.rule-item {
  color: #7e8a9d;
  font-size: 24rpx;
  line-height: 40rpx;
}
</style>
