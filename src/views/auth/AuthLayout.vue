<template lang="pug">
  v-app
    //- .login.primary.lighten-1
    //- .login(style="background-image: url('img/bg.jpg')")
    .login
      .login-background.bg_1(:style="'background-image: url(' + require('@/assets/img/bg1.jpg') + ')'")
      .login-background.bg_2(:style="'background-image: url(' + require('@/assets/img/bg2.jpg') + ')'")
      router-view
</template>

<script>
export default {
  name: 'AuthLayout'
}
</script>

<style>
</style>
