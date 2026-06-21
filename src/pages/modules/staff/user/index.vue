<script setup>
import { computed } from 'vue'
import Header from '@/components/header/index.vue'
import PageContainer from '@/components/base/page-container.vue'
import BottomNav from '@/components/business/bottom-nav.vue'
import { clearAuth, getUser, ENTRANCE_URL } from '@/untils/auth'

const user = computed(() => getUser() || {})

const roleLabel = computed(() => {
  return user.value.role === 'boss' ? '机构老板' : '销售老师'
})

const avatarText = computed(() => {
  return (user.value.name || '?').slice(0, 1)
})

const goPassword = () => {
  uni.navigateTo({ url: '/pages/modules/staff/user/password' })
}

const logout = () => {
  clearAuth()
  uni.redirectTo({ url: ENTRANCE_URL })
}
</script>

<template>
  <PageContainer>
    <Header title="我的" show-back />
    <view class="profile card">
      <view class="avatar">{{ avatarText }}</view>
      <view>
        <view class="name">{{ user.name || '未登录' }}</view>
        <view class="muted">{{ roleLabel }}</view>
      </view>
    </view>
    <view class="menu card">
      <view class="menu-item" @click="goPassword">
        <text>修改密码</text>
        <text class="arrow">›</text>
      </view>
    </view>
    <view class="logout" @click="logout">退出登录</view>
    <view class="bottom-space" />
    <bottom-nav role="staff" active="user" />
  </PageContainer>
</template>

<style scoped lang="scss">
.profile {
  display: flex;
  align-items: center;
  padding: 32rpx;
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96rpx;
  height: 96rpx;
  margin-right: 24rpx;
  border-radius: 50%;
  background: #eef5ff;
  color: #2f7df6;
  font-size: 36rpx;
  font-weight: 700;
}

.name {
  margin-bottom: 8rpx;
  font-size: 32rpx;
  font-weight: 700;
}

.menu {
  margin-top: 24rpx;
  padding: 0 28rpx;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 0;
  border-bottom: 1rpx solid #eef1f6;
}

.menu-item:last-child {
  border-bottom: 0;
}

.arrow {
  color: #aab3c0;
  font-size: 38rpx;
}

.logout {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 84rpx;
  margin-top: 32rpx;
  border-radius: 16rpx;
  background: #ffffff;
  color: #21bd72;
  font-weight: 700;
}

.bottom-space {
  height: calc(128rpx + constant(safe-area-inset-bottom));
  height: calc(128rpx + env(safe-area-inset-bottom));
}
</style>
