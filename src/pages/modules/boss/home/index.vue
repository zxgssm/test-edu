<script setup>
import Header from '@/components/header/index.vue'
import PageContainer from '@/components/base/page-container.vue'
import MetricCard from '@/components/business/metric-card.vue'
import ChartCard from '@/components/business/chart-card.vue'
import BottomNav from '@/components/business/bottom-nav.vue'
import { trendChart } from '@/mock/dashboard'

const lineOpts = {
  color: ['#2f7df6', '#21bd72'],
  legend: { show: true },
  xAxis: { disableGrid: true },
  yAxis: { gridType: 'dash' },
}
</script>

<template>
  <PageContainer>
    <Header title="教培机构业绩助手" subtitle="老板端 - 全面掌握机构经营数据" />
    <metric-card title="今日业绩" value="5,800" desc="较昨日 +12.5%" theme="blue" />
    <view class="mt-24">
      <metric-card title="本月业绩" value="86,200" desc="目标 100,000" :progress="86" theme="green" />
    </view>
    <chart-card title="业绩趋势（本月）" type="line" :chart-data="trendChart" :opts="lineOpts" />
    <view class="bottom-space" />
    <bottom-nav role="boss" active="home" />
  </PageContainer>
</template>

<style scoped lang="scss">
.bottom-space {
  height: calc(128rpx + constant(safe-area-inset-bottom));
  height: calc(128rpx + env(safe-area-inset-bottom));
}
</style>
