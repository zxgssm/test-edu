<script setup>
import { reactive, ref } from 'vue'
import { bindPhone } from '@/api/auth'
import {
  clearPendingOpenid,
  getPendingOpenid,
  redirectByRole,
  setAuth,
} from '@/untils/auth'

const form = reactive({
  phone: '',
})

const loading = ref(false)

const useMockPhone = () => {
  form.phone = '13800000002'
}

const submitBind = async () => {
  if (!form.phone) {
    uni.showToast({
      title: '请输入手机号',
      icon: 'none',
    })
    return
  }

  loading.value = true
  const res = await bindPhone({
    openid: getPendingOpenid(),
    phone: form.phone,
  })
  loading.value = false

  if (res.code !== 0) {
    uni.showToast({
      title: res.message,
      icon: 'none',
    })
    return
  }

  setAuth(res.data)
  clearPendingOpenid()
  uni.showToast({
    title: '绑定成功',
    icon: 'success',
  })
  setTimeout(() => {
    redirectByRole(res.data.user.role)
  }, 500)
}
</script>

<template>
  <view class="bind-page">
    <view class="nav-placeholder">
      <view class="page-title">绑定手机号</view>
    </view>
    <view class="fixed-header-placeholder"></view>
    <view class="bind-card">
      <view class="title">请绑定老板创建的员工账号</view>
      <view class="desc">
        当前微信还没有绑定机构账号。只有当手机号已由老板在员工管理中创建，才可以完成绑定并进入系统。
      </view>

      <view class="form-item">
        <text class="label">手机号</text>
        <input
          v-model="form.phone"
          class="input"
          type="number"
          maxlength="11"
          placeholder="请输入老板创建的手机号"
        />
      </view>

      <view class="mock-tip" @click="useMockPhone">
        使用 mock 待绑定员工手机号：13800000002
      </view>

      <button
        class="submit-btn"
        :class="{ disabled: loading }"
        :disabled="loading"
        @click="submitBind"
      >
        {{ loading ? '绑定中...' : '确认绑定' }}
      </button>
    </view>

    <view class="rule-card">
      <view class="rule-title">绑定规则</view>
      <view class="rule-item">1. 老板先在员工管理中创建员工手机号。</view>
      <view class="rule-item">2. 员工首次打开小程序后，用该手机号绑定微信。</view>
      <view class="rule-item">3. 绑定成功后，后续打开小程序会自动进入员工端。</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.bind-page {
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

.bind-card,
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
  margin: 36rpx 0 20rpx;
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

.mock-tip {
  margin-bottom: 32rpx;
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
