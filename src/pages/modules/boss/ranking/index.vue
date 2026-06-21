<script setup>
import { computed, onMounted, ref } from 'vue'
import Header from '@/components/header/index.vue'
import PageContainer from '@/components/base/page-container.vue'
import SectionCard from '@/components/business/section-card.vue'
import RankingList from '@/components/business/ranking-list.vue'
import BottomNav from '@/components/business/bottom-nav.vue'
import { queryBossRanking } from '@/api/dashboard'
import { rankingMap } from '@/mock/dashboard'
import { isUseCloud } from '@/config/cloud'

const tabs = [
  { key: 'month', label: '本月' },
  { key: 'week', label: '本周' },
  { key: 'today', label: '今日' },
]

const activeTab = ref('month')
const monthList = ref(rankingMap.month.list)

const activeRanking = computed(() => {
  if (activeTab.value === 'month' && isUseCloud()) {
    return { label: '本月', list: monthList.value }
  }
  return rankingMap[activeTab.value]
})

const loadRanking = async () => {
  if (!isUseCloud()) return
  const res = await queryBossRanking()
  if (res.code === 0) {
    monthList.value = res.data.list || []
  }
}

onMounted(() => {
  loadRanking()
})
</script>

<template>
  <PageContainer>
    <Header title="销售排行榜" show-back />
    <view class="tabs">
      <view
        v-for="item in tabs"
        :key="item.key"
        class="tab"
        :class="{ active: activeTab === item.key }"
        @click="activeTab = item.key"
      >
        {{ item.label }}
      </view>
    </view>
    <section-card title="员工销售排行" :extra="activeRanking.label">
      <ranking-list :list="activeRanking.list" />
    </section-card>
    <view class="bottom-space" />
    <bottom-nav role="boss" active="ranking" />
  </PageContainer>
</template>

<style scoped lang="scss">
.tabs {
  display: flex;
  align-items: center;
  height: 76rpx;
  margin-bottom: 20rpx;
  padding: 8rpx;
  border-radius: 16rpx;
  background: #eef3fb;
}

.tab {
  flex: 1;
  height: 60rpx;
  border-radius: 12rpx;
  color: #7e8a9d;
  font-size: 26rpx;
  line-height: 60rpx;
  text-align: center;
}

.active {
  background: #ffffff;
  color: #2f7df6;
  font-weight: 700;
}

.bottom-space {
  height: calc(128rpx + constant(safe-area-inset-bottom));
  height: calc(128rpx + env(safe-area-inset-bottom));
}
</style>
