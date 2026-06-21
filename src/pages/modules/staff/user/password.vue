<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { reactive, ref } from 'vue'
import { changePassword } from '@/api/auth'
import Header from '@/components/header/index.vue'
import PageContainer from '@/components/base/page-container.vue'
import DbbButton from '@/components/dbb-button.vue'
import { getUser, redirectByRole, updateUser } from '@/untils/auth'

const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const required = ref(false)
const loading = ref(false)

onLoad((options) => {
  required.value = options?.required === '1'
})

const savePassword = async () => {
  if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
    uni.showToast({
      title: '请填写完整',
      icon: 'none',
    })
    return
  }

  if (form.newPassword !== form.confirmPassword) {
    uni.showToast({
      title: '两次输入的密码不一致',
      icon: 'none',
    })
    return
  }

  loading.value = true
  const res = await changePassword({
    oldPassword: form.oldPassword,
    newPassword: form.newPassword,
  })
  loading.value = false

  if (res.code !== 0) {
    uni.showToast({
      title: res.message,
      icon: 'none',
    })
    return
  }

  const user = getUser()
  if (user) {
    updateUser({
      ...user,
      ...res.data.user,
      mustChangePassword: false,
    })
  }

  uni.showToast({
    title: '密码已更新',
    icon: 'success',
  })

  setTimeout(() => {
    redirectByRole(res.data.user?.role || user?.role)
  }, 400)
}
</script>

<template>
  <PageContainer>
    <Header :title="required ? '设置新密码' : '修改密码'" :show-back="!required" />
    <view class="form-card">
      <view v-if="required" class="tip">
        首次登录需要修改初始密码，完成后即可进入系统。
      </view>
      <view class="form-item">
        <text class="label">原密码</text>
        <input v-model="form.oldPassword" class="input" password placeholder="请输入原密码" />
      </view>
      <view class="form-item">
        <text class="label">新密码</text>
        <input v-model="form.newPassword" class="input" password placeholder="请输入新密码" />
      </view>
      <view class="form-item">
        <text class="label">确认新密码</text>
        <input v-model="form.confirmPassword" class="input" password placeholder="请再次输入新密码" />
      </view>
      <DbbButton text="保存" type="success" :disabled="loading" @click="savePassword" />
    </view>
  </PageContainer>
</template>

<style scoped lang="scss">
.form-card {
  padding: 32rpx 28rpx;
  border-radius: 24rpx;
  background: #ffffff;
}

.tip {
  margin-bottom: 28rpx;
  color: #7e8a9d;
  font-size: 26rpx;
  line-height: 40rpx;
}

.form-item {
  margin-bottom: 32rpx;
}

.label {
  display: block;
  margin-bottom: 16rpx;
  color: #182033;
  font-size: 28rpx;
  font-weight: 600;
}

.input {
  width: 100%;
  height: 88rpx;
  padding: 0 24rpx;
  border-radius: 12rpx;
  background: #f7f8fb;
  color: #182033;
  font-size: 28rpx;
}
</style>
