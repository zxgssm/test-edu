<script setup>
defineProps({
  title: String,
  extra: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <view class="section-card">
    <view class="section-header">
      <view class="section-title">{{ title }}</view>
      <view v-if="extra" class="section-extra">{{ extra }}</view>
    </view>
    <slot />
  </view>
</template>

<style scoped lang="scss">
.section-card {
  margin-top: 24rpx;
  padding: 28rpx;
  border-radius: 24rpx;
  background: #ffffff;
  box-shadow: 0 12rpx 32rpx rgba(31, 72, 136, 0.06);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.section-title {
  color: #182033;
  font-size: 30rpx;
  font-weight: 700;
}

.section-extra {
  color: #8a94a6;
  font-size: 24rpx;
}
</style>
