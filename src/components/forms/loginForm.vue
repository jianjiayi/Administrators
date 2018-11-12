<template>
  <section>
    <el-form :model="ruleLogin" status-icon :rules="loginRules" ref="ruleLogin" label-width="40px"  @keyup.enter.native="login('ruleLogin')">
      <el-form-item  prop="userName" label="账号">
        <el-input type="text" v-model="ruleLogin.userName" auto-complete="off" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item  prop="passWord" label="密码" style="margin:0">
        <el-input type="password" v-model="ruleLogin.passWord" auto-complete="off" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item style="margin:0;height: 30px;">
        <!--<router-link style="float:right;color: #606266;" to="/forget" target="_blank">忘记密码？</router-link>-->
      </el-form-item>
      <el-form-item >
        <el-button type="primary" @click="login('ruleLogin')" :loading="isBtnLoading">{{btnText}}</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>
<script>
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
          userName: '',
          passWord: ''
        },
        loginRules: {
          userName: [
            {validator: checkName, trigger: 'blur'}
          ],
          passWord: [
            {validator: validatePass, trigger: 'blur'}
          ]
        }
      };
    },
    computed: {
      btnText() {
        if (this.isBtnLoading) return '登录中...';
        return '登录';
      }
    },
    methods: {
      login(formName) {

        var vm = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {

            let loginParams = {phone: vm.ruleLogin.userName, password: vm.ruleLogin.passWord};

            this.$emit('loginSubmit',loginParams)
          } else {
            this.isBtnLoading = true;
            this.btnText()
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>
<style scoped lang="scss">
  .login-form{
    position: relative;
    width: 300px;
    margin:0 auto;
    .img-bg{
      width: 680px;
    }
    .el-form{
      position: absolute;
      top:-15px;
      width: 285px;
      left:0;
      border-radius: 20px;
      background-color: #ffffff;
      padding: 40px 30px 0px 20px;
      .el-form-item{
        /*margin-bottom: 0;*/
        .el-button{
          width: 100%;
          flex:1;
          -webkit-flex: 1;
          background-color: #01B78C;
          border-color:#01B78C;
        }
      }
    }
  }
</style>
