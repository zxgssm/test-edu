<script setup>
defineProps({
  list: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <view class="ranking-list">
    <view v-for="(item, index) in list" :key="item.name" class="ranking-item">
      <view class="rank" :class="{ top: index < 3 }">{{ index + 1 }}</view>
      <view class="avatar">{{ item.name.slice(0, 1) }}</view>
      <view class="info">
        <view class="name">{{ item.name }}</view>
        <view class="muted">目标达成 {{ item.rate }}%</view>
      </view>
      <view class="amount">{{ item.amount.toLocaleString() }}</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.ranking-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eef1f6;
}

.ranking-item:last-child {
  border-bottom: 0;
}

.rank {
  width: 44rpx;
  color: #9aa4b5;
  font-weight: 700;
  text-align: center;
}

.top {
  color: #f5a623;
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  height: 64rpx;
  margin: 0 18rpx;
  border-radius: 50%;
  background: #eef5ff;
  color: #2f7df6;
  font-size: 24rpx;
  font-weight: 700;
}

.info {
  flex: 1;
}

.name {
  margin-bottom: 8rpx;
  color: #182033;
  font-size: 28rpx;
  font-weight: 600;
}

.amount {
  color: #182033;
  font-family: DIN Alternate, Arial, sans-serif;
  font-size: 30rpx;
  font-weight: 700;
}
</style>
