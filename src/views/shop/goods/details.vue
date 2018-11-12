<template>
  <header-title :title="titleName"></header-title>
</template>
<script>
  import headerTitle from '@/views/shop/layout/header'

  export default {
    data(){
      return{
        titleName:'商品详情'
      }
    },
    components:{
      headerTitle
    }
  }
</script>
<style scoped lang="scss">

</style>
