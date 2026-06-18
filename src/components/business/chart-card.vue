<script setup>
const canvasId = `eduChart${Math.random().toString(36).slice(2, 10)}`

defineProps({
  title: String,
  type: {
    type: String,
    default: 'line',
  },
  chartData: {
    type: Object,
    default: () => ({}),
  },
  opts: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<template>
  <view class="chart-card">
    <view class="chart-title">{{ title }}</view>
    <qiun-data-charts
      :type="type"
      :chartData="chartData"
      :opts="opts"
      :canvasId="canvasId"
      background="none"
    />
  </view>
</template>

<style scoped lang="scss">
.chart-card {
  margin-top: 24rpx;
  padding: 28rpx;
  border-radius: 24rpx;
  background: #ffffff;
  box-shadow: 0 12rpx 32rpx rgba(31, 72, 136, 0.06);
}

.chart-title {
  margin-bottom: 20rpx;
  color: #182033;
  font-size: 30rpx;
  font-weight: 700;
}
</style>
