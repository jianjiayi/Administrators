import Vue from 'vue'
import Vuex from 'vuex'


import user from './modules/user'//导入user
import post from './modules/post'//导入post


Vue.use(Vuex)//使用vuex

export default new Vuex.Store({
  modules: {
    user,post
  },
  strict: process.env.NODE_ENV !== 'production', //在非生产环境下，使用严格模式
})
