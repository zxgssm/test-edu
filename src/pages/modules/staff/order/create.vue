<script setup>
import { reactive } from 'vue'
import Header from '@/components/header/index.vue'
import PageContainer from '@/components/base/page-container.vue'
import DbbButton from '@/components/dbb-button.vue'
import BottomNav from '@/components/business/bottom-nav.vue'
import { createOrder } from '@/api/order'

const form = reactive({
  student: '',
  course: '',
  amount: '',
  remark: '',
})

const saveOrder = async () => {
  if (!form.student || !form.course || !form.amount) {
    uni.showToast({ title: '请填写必填项', icon: 'none' })
    return
  }

  const res = await createOrder({
    studentName: form.student,
    courseName: form.course,
    amount: Number(form.amount),
    remark: form.remark,
  })

  if (res.code !== 0) {
    uni.showToast({ title: res.message || '保存失败', icon: 'none' })
    return
  }

  uni.showToast({ title: '订单已保存', icon: 'success' })
  setTimeout(() => {
    uni.navigateBack()
  }, 400)
}
</script>

<template>
  <PageContainer>
    <Header title="新增订单" show-back />
    <view class="form-card">
      <view class="form-item">
        <text class="label">学员姓名 *</text>
        <input v-model="form.student" class="input" placeholder="请输入学员姓名" />
      </view>
      <view class="form-item">
        <text class="label">课程名称 *</text>
        <input v-model="form.course" class="input" placeholder="请选择课程" />
      </view>
      <view class="form-item">
        <text class="label">订单金额 *</text>
        <input v-model="form.amount" class="input" type="digit" placeholder="请输入金额" />
      </view>
      <view class="form-item">
        <text class="label">备注</text>
        <textarea v-model="form.remark" class="textarea" placeholder="请输入备注（选填）" />
      </view>
      <DbbButton text="保存订单" type="success" @click="saveOrder" />
    </view>
    <view class="bottom-space" />
    <BottomNav role="staff" active="order" />
  </PageContainer>
</template>

<style scoped lang="scss">
.form-card {
  padding: 28rpx;
  border-radius: 24rpx;
  background: #ffffff;
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

.input,
.textarea {
  width: 100%;
  border-radius: 14rpx;
  background: #f6f8fb;
  color: #182033;
  font-size: 28rpx;
}

.input {
  height: 84rpx;
  padding: 0 22rpx;
}

.textarea {
  min-height: 150rpx;
  padding: 22rpx;
}

.bottom-space {
  height: calc(128rpx + constant(safe-area-inset-bottom));
  height: calc(128rpx + env(safe-area-inset-bottom));
}
</style>
