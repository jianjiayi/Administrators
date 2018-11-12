// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';

import router from './router';//导入路由表


import store from './store';//导入store

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import 'font-awesome/css/font-awesome.css';

import vuePicturePreview from 'vue-picture-preview';
Vue.use(vuePicturePreview);

import VideoPlayer from 'vue-video-player';
Vue.use(VideoPlayer);
require('video.js/dist/video-js.css');
require('vue-video-player/src/custom-theme.css');
// require('videojs-contrib-hls/dist/videojs-contrib-hls');

require("./assets/icon/iconfont.css");


Vue.config.productionTip = false;

//路由拦截器
// router.beforeEach(({meta, path}, from, next) => {
//   let { auth = true } = meta;//该路由是否需要登录
//   let isLogin = Boolean(store.state.user.tooken); //true用户已登录， false用户未登录
//   console.log('isLogin:'+isLogin+',,,auth:'+auth+',,,path:'+path)
//
//   if (!auth && !isLogin && path !== '/login') {
//     return next({ path: '/login' })
//   }else{
//     next()
//   }
// })

//权限指令
Vue.directive('has', {
  bind: function(el, binding) {
    if (!Vue.prototype.$_has(binding.value)) {
      el.parentNode.removeChild(el);
    }
  }
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
