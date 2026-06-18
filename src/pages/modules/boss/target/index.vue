<script setup>
import Header from '@/components/header/index.vue'
import PageContainer from '@/components/base/page-container.vue'
import ChartCard from '@/components/business/chart-card.vue'
import SectionCard from '@/components/business/section-card.vue'
import BottomNav from '@/components/business/bottom-nav.vue'

const targetChart = {
  series: [
    {
      data: [{ name: '完成率', value: 0.86 }],
    },
  ],
}

const opts = {
  title: {
    name: '86%',
    fontSize: 24,
    color: '#182033',
  },
  subtitle: {
    name: '完成率',
    fontSize: 13,
    color: '#8a94a6',
  },
  extra: {
    arcbar: {
      type: 'circle',
      width: 18,
      backgroundColor: '#edf2f7',
      startAngle: 1.5,
      endAngle: 0.25,
      gap: 2,
    },
  },
}
</script>

<template>
  <PageContainer>
    <Header title="业绩目标" show-back />
    <view class="month-switch">‹ 2024年5月 ›</view>
    <chart-card title="" type="arcbar" :chart-data="targetChart" :opts="opts" />
    <section-card title="">
      <view class="target-row">
        <view class="target-block">
          <view class="amount">86,200</view>
          <view class="muted">已完成（元）</view>
        </view>
        <view class="target-block">
          <view class="amount">100,000</view>
          <view class="muted">目标金额（元）</view>
        </view>
      </view>
    </section-card>
    <view class="bottom-space" />
    <bottom-nav role="boss" active="target" />
  </PageContainer>
</template>

<style scoped lang="scss">
.month-switch {
  margin: 16rpx 0 8rpx;
  color: #7e8a9d;
  font-size: 26rpx;
  text-align: center;
}

.target-row {
  display: flex;
  justify-content: space-around;
  text-align: center;
}

.target-block {
  flex: 1;
}

.amount {
  color: #182033;
  font-size: 40rpx;
  font-weight: 700;
}

.bottom-space {
  height: calc(128rpx + constant(safe-area-inset-bottom));
  height: calc(128rpx + env(safe-area-inset-bottom));
}
</style>
