<template>
  <section class="shop">
    <el-header>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect">
        <el-menu-item index="1">主页</el-menu-item>
        <el-submenu index="2">
          <template slot="title">订单管理</template>
          <el-menu-item index="2-1">未支付</el-menu-item>
          <el-menu-item index="2-2">已支付</el-menu-item>
          <el-menu-item index="2-3">待发货</el-menu-item>
          <el-menu-item index="2-4">已发货</el-menu-item>
          <el-menu-item index="2-5">已完成</el-menu-item>
        </el-submenu>
        <el-submenu index="3"  disabled>
          <template slot="title">退款管理</template>
          <el-menu-item index="3-1">待处理</el-menu-item>
          <el-menu-item index="3-2">已完成</el-menu-item>
        </el-submenu>
        <el-submenu index="4"  disabled>
          <template slot="title">商品管理</template>
          <el-menu-item index="4-1">待处理</el-menu-item>
          <el-menu-item index="4-2">已完成</el-menu-item>
        </el-submenu>
        <el-menu-item index="5">数据统计</el-menu-item>
        <el-menu-item index="6"><a href="https://www.ele.me" target="_blank">资质信息</a></el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <template name="fade" mode="out-in">
        <router-view id="main"></router-view>
      </template>
    </el-main>
    <back-to-top></back-to-top>
  </section>
</template>
<script>
  import backToTop from '@/components/backToTop'
  export default {
    data(){
      return{
        activeIndex: '1',
      }
    },
    methods:{

    },
    components:{
      backToTop
    }
  }

</script>
<style scoped lang="scss">
  .el-header{
    position: fixed;
    left:0;
    top:0;
    width: 100%;
    background: #81d8d0;
    line-height: 60px;
    text-align: center;
    z-index: 99;
    color: #ffffff;
    box-shadow: 0 2px 3px #ccc;
    .el-menu{
      width: 1000px;
      margin:0 auto;
      background: transparent;
      display: flex;
      display: -webkit-flex;
      justify-content: space-between;
      -webkit-justify-content: space-between;
      >.el-menu-item{
        display: flex;
      }
    }
  }
  .el-main {
    width: 1000px;
    margin: 60px auto;
    background: #ffffff;
  }
</style>
