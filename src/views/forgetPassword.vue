<template>
  <el-container @keyup.enter.native="register">
    <my-header></my-header>

    <div class="content">
      <el-form :model="ruleLogin" status-icon :rules="loginRules" ref="ruleLogin" class="demo-ruleForm">
        <el-form-item  prop="userName">
          <el-input type="text" v-model="ruleLogin.userName" auto-complete="off" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item  prop="passWord">
          <el-input type="password" v-model="ruleLogin.passWord" auto-complete="off" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="register('ruleLogin')" :loading="isBtnLoading">{{btnText}}</el-button>
        </el-form-item>
        <el-form-item>
          <p class="register">
            <router-link to="/login">已有账号</router-link>
          </p>
        </el-form-item>
      </el-form>
    </div>

    <my-footer></my-footer>
  </el-container>
</template>
<script>
  import instance from '@/api';
  const qs = require('qs');

  import * as util from '@/assets/js/util.js';

  import myHeader from '@/components/headers/header.vue';
  import myFooter from '@/components/footers/footer.vue'

  import {mapActions} from 'vuex'
  import {USER_SIGNIN} from '@/store/modules/user'


  export default {
    data() {
      var checkName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('用户名不能为空'));
        }
        callback();
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleLogin.passWord !== '') {
            callback();
          }
        }
      };
      return {
        isBtnLoading: false,

        ruleLogin: {
          userName:'',
          passWord: ''
        },
        loginRules: {
          userName: [
            { validator: checkName, trigger: 'blur' }
          ],
          passWord: [
            { validator: validatePass, trigger: 'blur' }
          ]
        }
      };
    },
    computed: {
      btnText() {
        if (this.isBtnLoading) return '注册...';
        return '立即注册';
      }
    },
    methods: {
      ...mapActions(['USER_SIGNIN']),
      register(formName) {
        var vm = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let loginParams = {phone: vm.ruleLogin.userName, password: vm.ruleLogin.passWord};

            instance.post(`/super/SuperLogin.do`, qs.stringify(loginParams)).then(res => {
              console.info('res:'+JSON.stringify(res))
              let status = res.data.status;
              if(status === 0){//登陆成功
                util.session('id', res.data.data.id);
                util.session('sessionid', res.data.data.sessionid);
                console.log(vm.$router.currentRoute.query.from)
                vm.$emit('login', vm.$router.currentRoute.query.from);
              }else{//登录失败
                vm.$message({
                  message: res.data.msg,
                  type: 'warning'
                });
              }
            }).catch(util.catchError);

//            this.USER_SIGNIN(login);//将登录信息保存本地
//            this.$router.push('/')
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      register() {

      }
    },
    components:{
      myHeader,
      myFooter
    }
  }
</script>
<style scoped lang="scss">
  .content{
    padding-top: 100px;
    .el-form{
      border-radius: 20px;
      background-color: rgba(0,0,0,0.5);
      padding: 40px 30px 10px 30px;
      .el-form-item{
        .el-input{
          flex:1;
          -webkit-flex: 1;
          width: 260px;
          display: flex;
          display: -webkit-flex;
          align-items: center;
          -webkit-align-items: center;
          input{
            flex:1;
            -webkit-flex: 1;
          }
        }
        .el-button{
          width: 100%;
          flex:1;
          -webkit-flex: 1;
        }
      }
      .register{
        position: relative;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        -webkit-align-items: center;
        justify-content: center;
        -webkit-justify-content: center;
        margin: 0;
        a{
          color: #ffffff;
          margin: 0 20px;
          padding: 0 10px;
        }
      }
      .register:before{
        content: '';
        display: flex;
        display: -webkit-flex;
        width: 60px;
        height: 1px;
        background: #FFFFFF;
      }
      .register:after{
        content: '';
        display: flex;
        display: -webkit-flex;
        width: 60px;
        height: 1px;
        background: #FFFFFF;
      }
    }
  }
</style>
