<script setup>
defineProps({
  title: String,
  value: [String, Number],
  unit: {
    type: String,
    default: '元',
  },
  desc: {
    type: String,
    default: '',
  },
  progress: {
    type: Number,
    default: 0,
  },
  theme: {
    type: String,
    default: 'blue',
  },
})
</script>

<template>
  <view class="metric-card" :class="theme">
    <view class="top">
      <view>
        <view class="title">{{ title }}</view>
        <view class="value">{{ value }}<text class="unit">{{ unit }}</text></view>
      </view>
      <view v-if="progress" class="progress">{{ progress }}%</view>
    </view>
    <view v-if="desc" class="desc">{{ desc }}</view>
  </view>
</template>

<style scoped lang="scss">
.metric-card {
  min-height: 184rpx;
  padding: 28rpx;
  border-radius: 22rpx;
  color: #ffffff;
}

.blue {
  background: linear-gradient(135deg, #2f7df6, #1f63db);
}

.green {
  background: linear-gradient(135deg, #21bd72, #12a660);
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  opacity: 0.9;
  font-size: 24rpx;
}

.value {
  margin-top: 14rpx;
  font-family: DIN Alternate, Arial, sans-serif;
  font-size: 52rpx;
  font-weight: 700;
}

.unit {
  margin-left: 8rpx;
  font-size: 24rpx;
  font-weight: 400;
}

.progress {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96rpx;
  height: 96rpx;
  border: 8rpx solid rgba(255, 255, 255, 0.35);
  border-radius: 50%;
  font-size: 22rpx;
  font-weight: 700;
}

.desc {
  margin-top: 12rpx;
  opacity: 0.85;
  font-size: 22rpx;
}
</style>
