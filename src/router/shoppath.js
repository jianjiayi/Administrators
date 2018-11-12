import shop from '@/views/shop/index';
import goodsList from '@/views/shop/goods/list';
import goodsDetails from '@/views/shop/goods/details';
import orderList from '@/views/shop/orders/list';
import orderDetails from '@/views/shop/orders/details';

export default [{
  path:'/shop',
  name:'商家',
  component:shop,
  children:[
    {
      path:'/goodsList',
      name:'商品列表',
      component:goodsList,
    },
    {
      path:'/goodsDetails',
      name:'商品详情',
      component:goodsDetails,
    },
    {
      path:'/orderList',
      name:'订单列表',
      component:orderList,
    },
    {
      path:'/orderDetails',
      name:'订单详情',
      component:orderDetails,
    },
  ]
}]
