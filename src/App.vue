<template>
  <div id="app">
    <router-view @login="loginDirect" @logout="logoutDirect"/>
    <lg-preview></lg-preview>
  </div>
</template>

<script>
  import '@/assets/css/normalize.css'
  import Vue from 'vue';
  import instance from './api';
  const qs = require('qs');

  import userPath from './router/fullpath';

  import shopPath from './router/shoppath';

  import * as util from './assets/js/util.js';

  import {mapMutations} from 'vuex'

  //请求拦截句柄
  let myInterceptor;

  export default {
    data() {
      return {
        menuData: null,
        userData: null
      }
    },
    methods: {
      ...mapMutations(['setUser']),
//    getPermission: function(userInfo) {
//      let resourcePermission = {};
//      if (Array.isArray(userInfo.resources)) {
//        userInfo.resources.forEach(function(e, i) {
//          let key = e.method.toLowerCase() + ',' + e.url;
//          resourcePermission[key] = true;
//        });
//      }
//      return resourcePermission;
//    },
//    setInterceptor: function(resourcePermission) {
//      let vm = this;
//      myInterceptor = instance.interceptors.request.use(function(config) {
//        //得到请求路径
//        let perName = config.url.replace(config.baseURL, '').replace('/GET','').replace('/POST','').split('?')[0];
//        //权限格式1 /path/${param}
//        let reg1 = perName.match(/^(\/[^\/]+\/)[^\/]+$/);
//        if (reg1) {
//          perName = reg1[1] + '**';
//        }
//        //权限格式2 /path/${param}/path
//        let reg2 = perName.match(/^\/[^\/]+\/([^\/]+)\/[^\/]+$/);
//        if (reg2) {
//          perName = perName.replace(reg2[1], '*');
//        }
//        //校验权限
//        if (!resourcePermission[config.method + ',' + perName]) {
//          //调试信息
//          console.warn(resourcePermission, config.method + ',' + perName);
//          vm.$message({
//            message: '无访问权限，请联系企业管理员',
//            type: 'warning'
//          });
//          //拦截请求
//          return Promise.reject({
//            message: 'no permission'
//          });
//        }
//        return config;
//      });
//    },
      getRoutes: function(userInfo) {
        if(!userInfo.menus){
          return console.warn(userInfo);
        }
        let vm = this;
        let allowedRouter = [];
        //将菜单数据转成多维数组格式
        let arrayMenus = util.buildMenu(userInfo.menus);
        //将多维数组转成对象格式
        let hashMenus = {};
        let setMenu2Hash = function(array, base) {
          array.map(key => {
            if (key.route) {
              let hashKey = ((base ? base + '/' : '') + key.route).replace(/^\//, '');
              hashMenus['/' + hashKey] = true;
              if (Array.isArray(key.children)) {
                setMenu2Hash(key.children, key.route);
              }
            }
          });
        };
        setMenu2Hash(arrayMenus);
        //全局挂载hashMenus，用于实现路由守卫
        this.$root.hashMenus = hashMenus;
        console.log()

        //筛选本地路由方法
        let findLocalRoute = function(array, base) {
          let replyResult = [];
          array.forEach(function(route) {
            let pathKey = (base ? base + '/' : '') + route.path;
            if (hashMenus[pathKey]) {
              if (Array.isArray(route.children)) {
                route.children = findLocalRoute(route.children, route.path);
              }
              replyResult.push(route);
            }
          });
          if (base) {
            return replyResult;
          } else {
            allowedRouter = allowedRouter.concat(replyResult);
          }
        }
        let originPath = util.deepcopy(userPath[0].children);
        findLocalRoute(originPath);
        console.log(allowedRouter)
        return allowedRouter;
      },
      extendRoutes: function(allowedRouter) {
        let vm = this;
        let actualRouter = util.deepcopy(allowedRouter);
        console.log(actualRouter)
        actualRouter.map(e => {
          //复制子菜单信息到meta用于实现导航相关效果，非必需
          if (e.children) {
            if (!e.meta) e.meta = {};
            e.meta.children = e.children;
          }
          //为动态路由添加独享守卫
          return e.beforeEnter = function(to, from, next){
            console.log(to.path)
            if(vm.$root.hashMenus[to.path]){
              next()
            }else{
              next('/401')
            }
          }
        });
        let originPath = util.deepcopy(userPath);


        let shopPath = actualRouter.find(e => e.path === '/merchant');
        console.log(shopPath)
        originPath[0].children = actualRouter;
        //注入路由
        vm.$router.addRoutes(originPath.concat([{
          path: '*',
          redirect: '/404'
        }]));

        console.log(vm.$router)
      },
      signin: function(callback) {
        let vm = this;
        //检查登录状态
        let localUserId = util.session('id');
        let locaSessionId = util.session('sessionid');


        if (!localUserId || !locaSessionId) {
          return vm.$router.push({ path: '/login', query: { from: vm.$router.currentRoute.path } });
        }



        //获取用户信息及权限数据
        //获取用户信息及权限数据
        let params = {
          superid: util.session('id'),//用户唯一标示
          sessionid: util.session('sessionid'),//用户唯一标示
        };
        console.log(params)
        instance.post(`/authority/getauthority.do`, qs.stringify(params)).then((res) => {
          console.info(res)
          if(res.data.status != 0){
            return vm.$router.push({ path: '/login', query: { from: vm.$router.currentRoute.path } });
          };
          //保存用户名和头像
          let author = {name:res.data.data.supername,img:res.data.data.photo};
          this.setUser(author);

          //格式化权限
          let userInfo = {};
          let message = res.data.data.mes;
          if(message === ''||message === null){
            console.log(1111)
            userInfo = {'menus':[]}
          }else{
            userInfo = eval('(' + message + ')')
          }
          console.log(userInfo)
          userInfo.menus.unshift({
            "id": "00",
              "name": "基本资料",
              "route": "base",
              "summary": "success"
          },
          {
            "id": "0001",
            "name": "基本资料",
            "parent_id": "00",
            "route": "baseInfo",
            "summary": "success"
          })
          console.log(userInfo)

          //获得实际路由
          let allowedRouter = vm.getRoutes(userInfo);
          //若无可用路由限制访问
          if (!allowedRouter || !allowedRouter.length) {
            util.session('token','');
            return document.body.innerHTML = ('<h1>账号访问受限，请联系系统管理员！</h1>');
          }
          //动态注入路由
          vm.extendRoutes(allowedRouter);
          //保存数据用作他处，非必需
          vm.menuData = allowedRouter;

          console.log(allowedRouter)
          vm.userData = userInfo;

          //执行回调
          typeof callback === 'function' && callback();
        })
      },
      loginDirect: function(newPath){
        console.log('newPath:'+newPath)
        this.signin(() => {
          newPath === '/login' ? newPath = '/' : newPath = newPath;
          this.$router.replace({path: newPath || '/'});
        });
      },
      logoutDirect: function(){
        //清除session
        util.session('token','');
        //清除请求权限控制
        instance.interceptors.request.eject(myInterceptor);
        //清除菜单权限
        this.$root.hashMenus = {};
        //清除请求头token
        instance.defaults.headers.common['Authorization'] = '';
        //回到登录页
        this.$router.replace({ path: '/login'});
      }
    },
    created: function(newPath) {
      this.signin();
    }
  }
</script>

<style lang="scss">
  .topLine{
    padding-bottom: 10px;
    border-bottom: 1px solid #aaaaaa;
    .el-form-item{
      margin-bottom: 0;
    }
  }
  .el-table::before{
    height: 0;
  }
  .el-pagination{
    padding: 10px;
    display: flex;
    display: -webkit-flex;
    justify-content: flex-end;
    -webkit-justify-content: flex-end;
    margin-top: 20px;
  }
</style>
