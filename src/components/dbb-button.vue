<script setup>
defineProps({
  text: {
    type: String,
    default: '确定',
  },
  type: {
    type: String,
    default: 'primary',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['click'])
</script>

<template>
  <button class="dbb-button" :class="[type, { disabled }]" @click="!disabled && emits('click')">
    {{ text }}
  </button>
</template>

<style scoped lang="scss">
.dbb-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 88rpx;
  border-radius: 16rpx;
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 600;
}

.primary {
  background: linear-gradient(135deg, #2f7df6, #1f63db);
}

.success {
  background: linear-gradient(135deg, #22bf74, #13a960);
}

.disabled {
  opacity: 0.45;
}
</style>
