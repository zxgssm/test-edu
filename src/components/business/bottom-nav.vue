<script setup>
defineProps({
  role: {
    type: String,
    default: 'boss',
  },
  active: {
    type: String,
    default: 'home',
  },
})

const bossTabs = [
  { key: 'home', icon: '⌂', text: '首页', url: '/pages/modules/boss/home/index' },
  { key: 'target', icon: '□', text: '业绩目标', url: '/pages/modules/boss/target/index' },
  { key: 'ranking', icon: '↗', text: '销售排行', url: '/pages/modules/boss/ranking/index' },
  { key: 'staff', icon: '●', text: '员工管理', url: '/pages/modules/boss/staff/index' },
]

const staffTabs = [
  { key: 'home', icon: '⌂', text: '首页', url: '/pages/modules/staff/home/index' },
  { key: 'order', icon: '□', text: '订单', url: '/pages/modules/staff/order/list' },
  { key: 'user', icon: '●', text: '我的', url: '/pages/modules/staff/user/index' },
]

const goTab = (item) => {
  uni.redirectTo({ url: item.url })
}
</script>

<template>
  <view class="bottom-nav">
    <view class="nav-content">
      <view
        v-for="item in role === 'boss' ? bossTabs : staffTabs"
        :key="item.key"
        class="nav-item"
        :class="{ active: item.key === active }"
        @click="goTab(item)"
      >
        <view class="nav-icon">{{ item.icon }}</view>
        <view>{{ item.text }}</view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.bottom-nav {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  background: #ffffff;
  box-shadow: 0 -8rpx 24rpx rgba(31, 72, 136, 0.08);
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 104rpx;
}

.nav-item {
  flex: 1;
  color: #8a94a6;
  font-size: 22rpx;
  line-height: 1;
  text-align: center;
}

.nav-icon {
  margin-bottom: 10rpx;
  font-size: 32rpx;
  line-height: 32rpx;
}

.active {
  color: #2f7df6;
  font-weight: 700;
}

</style>
