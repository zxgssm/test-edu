<template>
  <view class="page-container safe-bottom">
    <slot />
  </view>
</template>

<style scoped lang="scss">
.page-container {
  min-height: 100vh;
  padding: 24rpx;
  background: #f4f6fa;
}
</style>
