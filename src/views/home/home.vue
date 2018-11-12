<template>
  <section>
    <!--<echart></echart>-->
    <div class="number-count">
      <div class="cart-box" shadow="hover">
        <div class="icon-img bg1">
          <i class="icon iconfont icon-bussinessman"></i>
        </div>
        <div class="number-text">
          <count-to class="number" :countData="countNumber.options3"></count-to>
          <p class="text">商户注册量</p>
        </div>
      </div>
      <div class="cart-box" shadow="hover">
        <div class="icon-img bg2">
          <i class="icon iconfont icon-accountfilling"></i>
        </div>
        <div class="number-text">
          <count-to class="number" :countData="countNumber.options3"></count-to>
          <p class="text">用户注册量</p>
        </div>
      </div>
      <div class="cart-box" shadow="hover">
        <div class="icon-img bg3">
          <i class="icon iconfont icon-pic"></i>
        </div>
        <div class="number-text">
          <count-to class="number" :countData="countNumber.options3"></count-to>
          <p class="text">已上线商品数</p>
        </div>
      </div>
      <div class="cart-box" shadow="hover">
        <div class="icon-img bg4">
          <i class="icon iconfont icon-form"></i>
        </div>
        <div class="number-text">
          <count-to class="number" :countData="countNumber.options3"></count-to>
          <p class="text">已完成订单数</p>
        </div>
      </div>
    </div>

    <!--<par-char></par-char>-->


  </section>
</template>
<script>
  import countTo from '@/components/countTo.vue'
  import echart from '@/components/echarts/hello.vue'
//  import parChar from '@/components/particleChar/index.vue'
  export default {
    data(){
      return{
        countNumber:{
          options1:{//订单数
            startVal: 0,
            endVal: 1193
          },
          options2:{//访客数
            startVal: 0,
            endVal: 3306
          },
          options3:{//营业额
            startVal: 0,
            endVal: 1124
          },
          options4:{//收藏数
            startVal: 0,
            endVal: 5534
          },
        }
      }
    },
    components:{
      countTo,
      echart,
//      parChar
    }
  }
</script>
<style scoped lang="scss">
  .bg1{
    background: #2cca9a;
  }
  .bg2{
    background: #00a0e9;
  }
  .bg3{
    background: #13ce66;
  }
  .bg4{
    background: #66b1ff;
  }
  .number-count{
    width: 100%;
    display: flex;
    justify-content: space-around;
    .cart-box{
      width: 200px;
      height: 60px;
      display: flex;
      margin-bottom: 40px;
      border: 1px solid #CCCCCC;
      .icon-img{
        width: 80px;
        height: 60px;
        display: flex;
        justify-content:center;
        align-items: center;
        /*background: #00a0e9;*/
        i{
          font-size: 30px;
          color: #ffffff;
        }
      }
      .number-text{
        flex: 1;
        height: 30px;
        text-align: center;
        p{
          margin: 0;
          padding: 0;
        }
        .number{
          font-size: 25px;
          font-weight: bold;
          line-height: 40px;
        }
        .text{
          font-size: 12px;
        }
      }
    }
  }

</style>
