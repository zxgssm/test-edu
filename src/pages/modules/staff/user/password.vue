<script setup>
import { reactive } from 'vue'
import Header from '@/components/header/index.vue'
import PageContainer from '@/components/base/page-container.vue'
import DbbButton from '@/components/dbb-button.vue'

const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const savePassword = () => {
  uni.showToast({
    title: '已保存',
    icon: 'success',
  })
}
</script>

<template>
  <PageContainer>
    <Header title="修改密码" show-back />
    <view class="form-card">
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
      <DbbButton text="保存" type="success" @click="savePassword" />
    </view>
  </PageContainer>
</template>

<style scoped lang="scss">
.form-card {
  padding: 32rpx 28rpx;
  border-radius: 24rpx;
  background: #ffffff;
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
