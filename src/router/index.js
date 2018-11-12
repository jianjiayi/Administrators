import Vue from 'vue'
import Router from 'vue-router'

// import index from '@/views/index'//主页

import login from '@/views/login'//登录

import forget from '@/views/forgetPassword'//忘记密码

import reviewMerchant from '@/views/merchant/review-page'

import reviewGoods from '@/views/goods/review-page'

import orderDetails from '@/views/orders/orders-details'


import notHave from '@/views/error/401'
import notFound from '@/views/error/404'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/login',
      name:'登录',
      component:login
    },
    {
      path:'/forget',
      name:'忘记密码',
      component:forget
    },
    {
      path:'/reviewMerchant',
      name:'审核商户',
      component:reviewMerchant
    },
    {
      path:'/reviewGoods',
      name:'审核商品',
      component:reviewGoods
    },
    {
      path:'/orderDetails',
      name:'订单详情',
      component:orderDetails
    },
    {
      path: '/401',
      name: '无权访问',
      component: notHave
    },
    {
      path: '/404',
      name: '找不到页面',
      component: notFound
    }
  ]
})
