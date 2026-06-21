<script setup>
import { onMounted, ref } from 'vue'
import Header from '@/components/header/index.vue'
import PageContainer from '@/components/base/page-container.vue'
import MetricCard from '@/components/business/metric-card.vue'
import ChartCard from '@/components/business/chart-card.vue'
import BottomNav from '@/components/business/bottom-nav.vue'
import { queryBossDashboard } from '@/api/dashboard'
import { trendChart } from '@/mock/dashboard'

const todayAmount = ref('0')
const monthAmount = ref('0')
const monthTarget = ref('0')
const monthProgress = ref(0)

const lineOpts = {
  color: ['#2f7df6', '#21bd72'],
  legend: { show: true },
  xAxis: { disableGrid: true },
  yAxis: { gridType: 'dash' },
}

const formatAmount = (value) => Number(value || 0).toLocaleString()

const loadDashboard = async () => {
  const res = await queryBossDashboard()
  if (res.code !== 0) return
  const data = res.data
  todayAmount.value = formatAmount(data.todayAmount)
  monthAmount.value = formatAmount(data.monthAmount)
  monthTarget.value = formatAmount(data.monthTarget)
  monthProgress.value = data.monthProgress || 0
}

onMounted(() => {
  loadDashboard()
})
</script>

<template>
  <PageContainer>
    <Header title="教培机构业绩助手" subtitle="老板端 - 全面掌握机构经营数据" />
    <metric-card title="今日业绩" :value="todayAmount" desc="实时汇总" theme="blue" />
    <view class="mt-24">
      <metric-card
        title="本月业绩"
        :value="monthAmount"
        :desc="`目标 ${monthTarget}`"
        :progress="monthProgress"
        theme="green"
      />
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
