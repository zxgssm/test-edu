<script setup>
import { computed, onMounted, ref } from 'vue'
import Header from '@/components/header/index.vue'
import PageContainer from '@/components/base/page-container.vue'
import ChartCard from '@/components/business/chart-card.vue'
import SectionCard from '@/components/business/section-card.vue'
import BottomNav from '@/components/business/bottom-nav.vue'
import { queryBossTarget } from '@/api/dashboard'

const monthAmount = ref(0)
const monthTarget = ref(0)
const completionRate = ref(0)

const targetChart = computed(() => ({
  series: [
    {
      data: [{ name: '完成率', value: completionRate.value / 100 }],
    },
  ],
}))

const opts = computed(() => ({
  title: {
    name: `${completionRate.value}%`,
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
}))

const formatAmount = (value) => Number(value || 0).toLocaleString()

const loadTarget = async () => {
  const res = await queryBossTarget()
  if (res.code !== 0) return
  monthAmount.value = res.data.monthAmount
  monthTarget.value = res.data.monthTarget
  completionRate.value = res.data.completionRate || 0
}

onMounted(() => {
  loadTarget()
})
</script>

<template>
  <PageContainer>
    <Header title="业绩目标" show-back />
    <view class="month-switch">‹ 本月 ›</view>
    <chart-card title="" type="arcbar" :chart-data="targetChart" :opts="opts" />
    <section-card title="">
      <view class="target-row">
        <view class="target-block">
          <view class="amount">{{ formatAmount(monthAmount) }}</view>
          <view class="muted">已完成（元）</view>
        </view>
        <view class="target-block">
          <view class="amount">{{ formatAmount(monthTarget) }}</view>
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
