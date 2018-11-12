<template>
  <el-container>
    <el-header height="200px">
      <div class="logo">
        <img src="@/assets/images/002.png" alt="">
      </div>
      <div class="title">
        上实源电子商务管理员系统
      </div>
    </el-header>

    <el-main>
      <div class="login-form">
        <img class="img-bg" src="@/assets/images/003.png" alt="">
        <!--登录组件-->
        <login-form @loginSubmit="login"></login-form>
      </div>

    </el-main>


    <el-footer></el-footer>
  </el-container>
</template>
<script>
  import instance from '@/api';
  const qs = require('qs');

  import * as util from '@/assets/js/util.js';

  import {mapMutations} from 'vuex'

  import loginForm from '@/components/forms/loginForm'
//  import parChar from '@/components/particleChar/index.vue'


  export default {
    data() {
      return {}
    },
    methods: {
      ...mapMutations(['setSafeState']),
      login(loginParams) {
        console.log('login')
        instance.post(`/super/SuperLogin.do`, qs.stringify(loginParams)).then(res => {
          console.info('res:'+JSON.stringify(res))
          let status = res.data.status;
          if(status === 0){//登陆成功
            util.session('id', res.data.data.id);
            util.session('sessionid', res.data.data.sessionid);

            this.setSafeState(res.data.data.paypass);//保存支付安全状态
            util.session('setSafeState', res.data.data.paypass);

            this.$emit('login', this.$router.currentRoute.query.from);
          }else{//登录失败
            this.isBtnLoading = false;
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }).catch(util.catchError);
      }
    },
    components:{
      loginForm,
//      parChar
    }
  }
</script>
<style scoped lang="scss">
  .el-header{
    width: 100%;
    background: url("../assets/images/001.png") no-repeat;
    background-position: center center;
    background-size: cover;
    .logo{
      padding: 30px 0 10px 0;
      text-align: center;
      img{
        width: 100px;
      }
    }
    .title{
      font-size: 18px;
      color: #ffffff;
      line-height: 50px;
      text-align: center;
    }
  }
  .el-main{
    margin-top:60px;
    .login-form{
      position: relative;
      width: 300px;
      margin:0 auto;
      .img-bg{
        width: 680px;
      }
    }
  }
</style>
