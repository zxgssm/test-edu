<script setup>
import Header from '@/components/header/index.vue'
import PageContainer from '@/components/base/page-container.vue'
import MetricCard from '@/components/business/metric-card.vue'
import ChartCard from '@/components/business/chart-card.vue'
import BottomNav from '@/components/business/bottom-nav.vue'
import { trendChart } from '@/mock/dashboard'

const opts = {
  color: ['#21bd72', '#9aa4b5'],
  legend: { show: true },
  xAxis: { disableGrid: true },
  yAxis: { gridType: 'dash' },
}
</script>

<template>
  <PageContainer>
    <Header title="我的业绩" subtitle="员工端 - 录单与个人业绩跟踪" />
    <metric-card title="今日业绩" value="1,500" desc="较昨日 +8.3%" theme="green" />
    <view class="mt-24">
      <metric-card title="本月业绩" value="8,200" desc="目标 10,000" :progress="82" theme="green" />
    </view>
    <chart-card title="业绩趋势（本月）" type="line" :chart-data="trendChart" :opts="opts" />
    <view class="bottom-space" />
    <bottom-nav role="staff" active="home" />
  </PageContainer>
</template>

<style scoped lang="scss">
.bottom-space {
  height: calc(128rpx + constant(safe-area-inset-bottom));
  height: calc(128rpx + env(safe-area-inset-bottom));
}
</style>
