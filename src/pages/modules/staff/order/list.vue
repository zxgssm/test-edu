<script setup>
import Header from '@/components/header/index.vue'
import PageContainer from '@/components/base/page-container.vue'
import SectionCard from '@/components/business/section-card.vue'
import BottomNav from '@/components/business/bottom-nav.vue'
import { orders } from '@/mock/dashboard'
</script>

<template>
  <PageContainer>
    <Header title="我的订单" show-back />
    <view class="tabs">
      <view class="tab active">全部</view>
    </view>
    <section-card title="">
      <view v-for="item in orders" :key="item.time" class="order-card">
        <view class="order-top">
          <view class="student">{{ item.student }}</view>
          <view class="amount">{{ item.amount.toLocaleString() }}元</view>
        </view>
        <view class="muted">学员：{{ item.teacher }}</view>
        <view class="order-bottom">
          <text class="muted">{{ item.time }}</text>
        </view>
      </view>
      <view class="empty-text">没有更多了</view>
    </section-card>
    <view class="bottom-space" />
    <bottom-nav role="staff" active="order" />
  </PageContainer>
</template>

<style scoped lang="scss">
.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20rpx;
}

.tab {
  position: relative;
  color: #182033;
  font-size: 28rpx;
  font-weight: 700;
}

.tab::after {
  position: absolute;
  right: 12rpx;
  bottom: -12rpx;
  left: 12rpx;
  height: 6rpx;
  border-radius: 999rpx;
  background: #21bd72;
  content: '';
}

.order-card {
  padding: 24rpx 0;
  border-bottom: 1rpx solid #eef1f6;
}

.order-card:last-child {
  border-bottom: 0;
}

.order-top,
.order-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.student {
  color: #182033;
  font-weight: 700;
}

.order-bottom {
  margin-top: 16rpx;
}

.amount {
  color: #182033;
  font-weight: 700;
}

.empty-text {
  padding: 36rpx 0 8rpx;
  color: #a5adbb;
  font-size: 24rpx;
  text-align: center;
}

.bottom-space {
  height: calc(128rpx + constant(safe-area-inset-bottom));
  height: calc(128rpx + env(safe-area-inset-bottom));
}
</style>
