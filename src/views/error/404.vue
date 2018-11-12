<template>
  <el-container>
    <div>
      <div class="error-img">
        <img src="@/assets/images/404.png">
      </div>
      <div class="error-text">
        sorry！页面走丢了
        <router-link to="/">返回首页</router-link>
      </div>
    </div>
  </el-container>
</template>
<script>

</script>
<style scoped lang="scss">
  .el-container{
    position: absolute;
    top:0;
    left:0;
    right: 0;
    bottom:0;
    background: #fff;
    display: flex;
    display: -webkit-flex;
    align-items: center;
    -webkit-align-items: center;
    justify-content: center;
    -webkit-justify-content: center;
    .error-text{
      text-align: center;
      line-height: 100px;
      font-family: PingFangSC-Medium;
      font-size: 36px;
      color: #9B9B9B;
      letter-spacing: 0;
      a{
        font-size: 20px;
        color: #00a0e9;
      }
    }
  }
</style>
