<script setup>
import { computed } from "vue";

defineProps({
  title: {
    type: String,
    default: "教培机构业绩助手",
  },
  subtitle: {
    type: String,
    default: "",
  },
  showBack: {
    type: Boolean,
    default: false,
  },
});

const systemInfo = uni.getSystemInfoSync();
let menuButtonInfo = null;

// 微信小程序自定义导航需要避开右上角胶囊按钮区域。
// #ifdef MP-WEIXIN
menuButtonInfo = uni.getMenuButtonBoundingClientRect();
// #endif

const statusBarHeight = systemInfo.statusBarHeight || 0;
const navBarHeight = menuButtonInfo
  ? menuButtonInfo.height + (menuButtonInfo.top - statusBarHeight) * 2
  : 44;

const headerStyle = computed(() => ({
  paddingTop: `${statusBarHeight}px`,
}));

const navStyle = computed(() => ({
  minHeight: `${navBarHeight}px`,
}));

const goBack = () => {
  uni.navigateBack();
};
</script>

<template>
  <view>
    <view class="header" :style="headerStyle">
      <view class="nav-content" :style="navStyle">
        <view v-if="showBack" class="back" @click="goBack">‹</view>
        <view>
          <view class="title">{{ title }}</view>
          <view v-if="subtitle" class="subtitle">{{ subtitle }}</view>
        </view>
      </view>
    </view>
    <view class="header-placeholder" :style="headerStyle">
      <view class="nav-content" :style="navStyle"></view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.header {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 99;
  width: 100%;
  padding-right: 24rpx;
  padding-left: 24rpx;
  background: #f4f6fa;
}

.header-placeholder {
  width: 100%;
}

.nav-content {
  display: flex;
  align-items: center;
  padding: 12rpx 4rpx 24rpx;
}

.back {
  width: 56rpx;
  height: 56rpx;
  margin-right: 8rpx;
  border-radius: 50%;
  color: #182033;
  font-size: 52rpx;
  line-height: 48rpx;
  text-align: center;
}

.title {
  color: #182033;
  font-size: 36rpx;
  font-weight: 700;
  line-height: 48rpx;
}

.subtitle {
  margin-top: 8rpx;
  color: #7e8a9d;
  font-size: 24rpx;
}
</style>
