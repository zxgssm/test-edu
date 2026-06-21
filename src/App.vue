<script setup>
import { onLaunch } from '@dcloudio/uni-app'
import { CLOUD_ENV_ID } from '@/config/cloud'

onLaunch(() => {
  console.log('App Launch')
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && CLOUD_ENV_ID) {
    wx.cloud.init({
      env: CLOUD_ENV_ID,
      traceUser: true,
    })
  }
  // #endif
})
</script>

<style lang="scss">
@import '@/style/index.scss';
</style>
