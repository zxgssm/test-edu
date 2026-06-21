<script setup>
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import Header from '@/components/header/index.vue'
import PageContainer from '@/components/base/page-container.vue'
import SectionCard from '@/components/business/section-card.vue'
import BottomNav from '@/components/business/bottom-nav.vue'
import { fetchStaffList } from '@/api/staff'

const staffList = ref([])

const statusLabel = {
  pending_bind: '待绑定',
  active: '在职',
}

const goEdit = () => {
  uni.navigateTo({ url: '/pages/modules/boss/staff/edit' })
}

const loadStaff = async () => {
  const res = await fetchStaffList()
  if (res.code !== 0) return
  staffList.value = res.data.list || []
}

onShow(() => {
  loadStaff()
})
</script>

<template>
  <PageContainer>
    <Header title="员工管理" show-back />
    <view class="toolbar">
      <view class="search">搜索员工姓名</view>
      <view class="filter">全部状态⌄</view>
    </view>
    <view class="add-btn" @click="goEdit">+ 添加员工</view>
    <section-card title="管理账号" :extra="`共${staffList.length}人`">
      <view v-for="item in staffList" :key="item.id || item.phone" class="staff-row">
        <view class="avatar">{{ item.name.slice(0, 1) }}</view>
        <view class="info">
          <view class="name">{{ item.name }}</view>
          <view class="muted">目标：{{ Number(item.target || 0).toLocaleString() }}</view>
          <view class="muted">状态：{{ statusLabel[item.status] || item.status }}</view>
        </view>
        <view class="edit" @click="goEdit">编辑</view>
      </view>
    </section-card>
    <view class="bottom-space" />
    <bottom-nav role="boss" active="staff" />
  </PageContainer>
</template>

<style scoped lang="scss">
.toolbar {
  display: flex;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.search,
.filter {
  height: 68rpx;
  border-radius: 12rpx;
  background: #ffffff;
  color: #a5adbb;
  font-size: 24rpx;
  line-height: 68rpx;
}

.search {
  flex: 1;
  padding-left: 24rpx;
}

.filter {
  width: 180rpx;
  text-align: center;
}

.add-btn {
  height: 76rpx;
  margin-bottom: 20rpx;
  border-radius: 14rpx;
  background: #2f7df6;
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 700;
  line-height: 76rpx;
  text-align: center;
}

.staff-row {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eef1f6;
}

.staff-row:last-child {
  border-bottom: 0;
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72rpx;
  height: 72rpx;
  margin-right: 20rpx;
  border-radius: 50%;
  background: #eef5ff;
  color: #2f7df6;
  font-weight: 700;
}

.info {
  flex: 1;
}

.name {
  margin-bottom: 8rpx;
  font-weight: 700;
}

.edit {
  color: #2f7df6;
  font-size: 26rpx;
}

.bottom-space {
  height: calc(128rpx + constant(safe-area-inset-bottom));
  height: calc(128rpx + env(safe-area-inset-bottom));
}
</style>
