<template>
  <el-container>
    <!--头部-->
    <el-header height="80px">
      <a href="" class="logo">
        <!--<img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=374454640,225596549&fm=27&gp=0.jpg" alt="">-->
        上实源管理员系统
      </a>
      <div class="nav">

        <!--<a href="" class="cms-a">官网维护</a>-->
        <div class="userMenu">
          <i class="username">欢迎 {{getUser.name}}</i>
          <el-dropdown>
            <span class="author">
              <img v-show="getUser.img" :src="getUser.img"  alt="">
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="$router.push({ path: '/base/baseInfo' })">修改</el-dropdown-item>

              <!--<el-dropdown-item @click.native="switchVisible = true">切换账号</el-dropdown-item>-->
              <el-dropdown-item @click.native="singOut()">注销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-header>

    <!--主题内容-->
    <el-container>
      <!--侧边栏-->
      <left-aside :Routers="menus"></left-aside>

      <!--内容-->
      <el-main>
        <el-breadcrumb separator="/" class="bread" id="mybread">
          <el-breadcrumb-item v-for="(item,index) in breadcrumbs" :key="index">
            {{ item.meta.name || item.name }}
          </el-breadcrumb-item>
        </el-breadcrumb>
        <template v-if="$route.path === '/'">
          <home-page></home-page>
        </template>
        <template v-else name="fade" mode="out-in">
          <router-view id="main"></router-view>
        </template>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
  import instance from '@/api';
  const qs = require('qs');

  import * as util from '@/assets/js/util.js';

  import leftAside from '@/components/aside';

  import loginForm from '@/components/forms/loginForm';

  import homePage from '@/views/home/home.vue';

  import {mapGetters,mapMutations} from 'vuex'

  export default {
    data(){
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
      return{
        user: {},
        menus: [],

        switchVisible:false,//切换登录模态框状态

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
      }
    },
    created: function() {
      let user = this.$parent.userData;
      if (user) {
        this.user = user;
      } else {
        this.$router.push({ path: "/login" });
      }
      let menus = this.$parent.menuData;
      if (menus) {
        this.menus = menus;
      }
    },
    computed: {
      ...mapGetters(['getUser']),
      activeMenu: function(){
        console.log(this.$route.path)
        return this.$route.path
      },
      breadcrumbs: function(){
        return (this.$route && this.$route.matched) || []
      }
    },
    methods:{
      ...mapMutations(['setUser']),
      //退出登录函数
      singOut(){
        this.$confirm("确定退出?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info",
        })
          .then(() => {
            this.$emit("logout");
          })
          .catch(() => {});
      },
      routerPath(path){
        console.log(path)
        this.$router.push({path: path, replace: true})
      }
    },
    components:{
      leftAside,homePage
    }
  }
</script>
<style scoped lang="scss">

  .el-header{
    position: fixed;
    top:0;
    left:0;
    width: 100%;
    height: 80px;
    display: flex;
    display: -webkit-flex;
    align-items: center;
    -webkit-align-items: center;
    justify-content: space-between;
    -webkit-justify-content: space-between;
    background-color: #23C09B;
    color: #ffffff;
    box-shadow: 10px 50px 5px #cccccc;
    .logo{
      display: flex;
      display: -webkit-flex;
      align-items: center;
      -webkit-align-items: center;
      font-size: 18px;
      color: #fff;
      img{
        width: 120px;
        height: 60px;
        margin-right: 10px;
      }
    }
    .nav{
      display: flex;
      display: -webkit-flex;
      align-items: center;
      -webkit-align-items: center;
      .cms-a{

      }
      .userMenu{
        display: flex;
        display: -webkit-flex;
        align-items: center;
        -webkit-align-items: center;
        margin-left: 100px;
        .username{
          font-size: 12px;
        }
        .el-dropdown{
          margin-left: 10px;
          .author{
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;
            background-color: #c0c0c0;
            display: block;
            img{
              width: 100%;
              height: 100%;
              transition: all 0.3s;
            }
          }
        }
        .el-dropdown:hover{
          .author{
            box-shadow: 0 0 10px #81d8d0;
            img{
              transform:scale(1.2);//设置缩放比例
              -ms-transform:scale(1.2);
              -webkit-transform:scale(1.2);
              -o-transform:scale(1.2);
              -moz-transform:scale(1.2);
            }
          }
        }
      }
    }
  }



  .el-main {
    position: absolute;
    left:200px;
    top:80px;
    bottom:0;
    right: 0;
    background-color: #ffffff;
    color: #333;
    text-align: left;
    overflow-x: hidden;
    overflow-y: auto;
    #mybread{
      height: 40px;
      line-height: 40px;
    }
  }

  .el-container {
    min-width: 1000px;
    overflow-x: auto;
    overflow-y: auto;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    top:0;
    bottom:0;
  }
</style>
