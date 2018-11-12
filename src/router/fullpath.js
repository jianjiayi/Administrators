import Abstract from '../views/common/abstract.vue';

import baseInfo from '../views/basicInfo/index.vue';//基本资料

//账户管理
import accountList from '@/views/account/account-list.vue';//账户列表
import roles from '@/views/account/account-roles.vue';//权限设置

//商户管理
import merchantList from '@/views/merchant/merchant-list.vue';//商户列表
import merchantReview from '@/views/merchant/merchant-review.vue';//商户审核


//商品管理
import goodsList from '@/views/goods/goods-list.vue';// 商品列表
import goodsReview from '@/views/goods/goods-reviews.vue';//商品审核

//订单管理
import ordersList from '@/views/orders/orders-list';//订单列表

//财务管理
import ordersSettlement from '@/views/financial/orders-settlement'//订单结算

//资源管理
import app from '@/views/resources/app'//app资源管理

//cms
//import ueditor from '@/views/CMS/ueditor'//富文本

import publishNotice from '@/views/CMS/publish-notice'//发布公告

import noticeList from '@/views/CMS/notice-list'//公告列表

export default [{
  path: '/',
  name: '首页',
  component: (resolve) => require(['../views/index.vue'], resolve),
  children: [
    {
      path:'/base',
      name:'基本资料',
      meta:{
        icon:'icon iconfont icon-all',
      },
      component:Abstract,
      children: [
      {
        path: 'baseInfo',
        name: '个人信息',
        meta: {
          icon:'',
        },
        component: baseInfo
      }]
    },
    {
    path: '/accounts',
    name: '账号管理',
    meta: {
      icon:'icon iconfont icon-add-account',
    },
    component: Abstract,
    children: [
      {
        path: 'accountList',
        name: '管理员列表',
        meta: {
          icon:'',
        },
        component: accountList
      },{
      path: 'roles',
      name: '管理员权限设置',
      meta: {
        icon:'',
      },
      component: roles
    }]
  }, {
    path: '/merchant',
    name: '商户管理',
    meta: {
      icon:'icon iconfont icon-bussinesscard',
    },
    component: Abstract,
    children: [
      {
        path: 'merchantList',
        name: '商户列表',
        meta: {
          icon:'',
        },
        component: merchantList
      },{
        path: 'merchantReview',
        name: '商户审核',
        meta: {
          icon:'',
        },
        component: merchantReview
      }]
  },{
    path: '/goods',
    name: '商品管理',
    meta: {
      icon:'icon iconfont icon-bags',
    },
    component: Abstract,
    children: [
      {
        path: 'goodsList',
        name: '商品列表',
        meta: {
          icon:'',
        },
        component: goodsList
      },{
      path: 'goodsReview',
      name: '商品审核',
      meta: {
        icon:'',
      },
      component: goodsReview
    }]
  },{
    path: '/orders',
    name: '订单管理',
    meta: {
      icon:'icon iconfont icon-viewlist',
    },
    component: Abstract,
    children: [
      {
        path: 'ordersList',
        name: '订单列表',
        meta: {
          icon:'',
        },
        component: ordersList
      }]
  },{
    path: '/financial',
    name: '财务管理',
    meta: {
      icon:'icon iconfont icon-dollar',
    },
    component: Abstract,
    children: [
      {
        path: 'ordersSettlement',
        name: '订单结算',
        meta: {
          icon:'',
        },
        component: ordersSettlement
      }]
  },{
    path: '/resources',
    name: '资源管理',
    meta: {
      icon:'icon iconfont icon-folder',
    },
    component: Abstract,
    children: [
      {
        path: 'app',
        name: 'APP管理',
        meta: {
          icon:'',
        },
        component: app
      }]
  },{
    path: '/CMS',
    name: '公告管理',
    meta: {
      icon:'icon iconfont icon-link',
    },
    component: Abstract,
    children: [
      {
        path: 'publishNotice',
        name: '发布公告',
        meta: {
          icon:'',
        },
        component: publishNotice
      },
      {
        path: 'noticeList',
        name: '公告列表',
        meta: {
          icon:'',
        },
        component: noticeList
      }]
  }]
}];
