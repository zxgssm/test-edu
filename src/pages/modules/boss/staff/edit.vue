<script setup>
import { reactive } from 'vue'
import Header from '@/components/header/index.vue'
import PageContainer from '@/components/base/page-container.vue'
import DbbButton from '@/components/dbb-button.vue'
import { createStaffAccount } from '@/api/staff'

const form = reactive({
  name: '',
  phone: '',
  password: '',
  target: '',
})

const saveStaff = async () => {
  if (!form.name || !form.phone || !form.password || !form.target) {
    uni.showToast({
      title: '请填写必填项',
      icon: 'none',
    })
    return
  }

  const res = await createStaffAccount({
    name: form.name,
    phone: form.phone,
    password: form.password,
    target: Number(form.target),
  })

  if (res.code !== 0) {
    uni.showToast({
      title: res.message,
      icon: 'none',
    })
    return
  }

  uni.showToast({
    title: '已创建待登录账号',
    icon: 'success',
  })
}
</script>

<template>
  <PageContainer>
    <Header title="新增员工" show-back />
    <view class="form-card">
      <view class="avatar-upload">相机</view>
      <view class="form-item">
        <text class="label">姓名 *</text>
        <input v-model="form.name" class="input" placeholder="请输入员工姓名" />
      </view>
      <view class="form-item">
        <text class="label">手机号 *</text>
        <input v-model="form.phone" class="input" type="number" placeholder="请输入手机号（登录账号）" />
      </view>
      <view class="form-item">
        <text class="label">初始密码 *</text>
        <input v-model="form.password" class="input" password placeholder="员工首次登录使用" />
      </view>
      <view class="form-item">
        <text class="label">目标金额（月）*</text>
        <input v-model="form.target" class="input" type="digit" placeholder="请输入目标金额" />
      </view>
      <view class="tip">保存后员工需使用手机号和初始密码登录，首次登录须修改密码。</view>
      <DbbButton text="保存" @click="saveStaff" />
    </view>
  </PageContainer>
</template>

<style scoped lang="scss">
.form-card {
  padding: 32rpx 28rpx;
  border-radius: 24rpx;
  background: #ffffff;
}

.avatar-upload {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 112rpx;
  height: 112rpx;
  margin: 8rpx auto 36rpx;
  border-radius: 50%;
  background: #f2f4f8;
  color: #a5adbb;
  font-size: 24rpx;
}

.form-item {
  margin-bottom: 28rpx;
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
  height: 84rpx;
  padding: 0 22rpx;
  border-radius: 12rpx;
  background: #f7f8fb;
  color: #182033;
  font-size: 28rpx;
}

.tip {
  margin-bottom: 32rpx;
  color: #a5adbb;
  font-size: 24rpx;
}
</style>
