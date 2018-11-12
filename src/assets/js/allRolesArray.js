const menudata = {
  "menus":[
    {
      "id": "-10",
      "name": "基本资料",
      "parent_id": "",
      "route": "base",
      "summary": "success"
    },
    {
      "id": "-1001",
      "name": "个人信息",
      "parent_id": "-10",
      "route": "baseInfo",
      "summary": "success"
    },
    {
      "id": "01",
      "name": "账号管理",
      "parent_id": "",
      "route": "accounts",
      "summary": "success"
    },
    {
      "id": "0101",
      "name": "管理员列表",
      "parent_id": "01",
      "route": "accountList",
      "summary": ""
    },
    {
      "id": "0102",
      "name": "权限设置",
      "parent_id": "01",
      "route": "roles",
      "summary": ""
    },
    {
      "id": "02",
      "name": "商户管理",
      "parent_id": "",
      "route": "merchant",
      "summary": "info"
    },
    {
      "id": "0201",
      "name": "商户列表",
      "parent_id": "02",
      "route": "merchantList",
      "summary": ""
    },
    {
      "id": "0202",
      "name": "商户审核",
      "parent_id": "02",
      "route": "merchantReview",
      "summary": ""
    },
    {
      "id": "03",
      "name": "商品管理",
      "parent_id": "",
      "route": "goods",
      "summary": "warning"
    },
    {
      "id": "0301",
      "name": "商品列表",
      "parent_id": "03",
      "route": "goodsList",
      "summary": ""
    },
    {
      "id": "0302",
      "name": "商品审核",
      "parent_id": "03",
      "route": "goodsReview",
      "summary": ""
    },
    {
      "id": "04",
      "name": "订单管理",
      "parent_id": "",
      "route": "orders",
      "summary": "danger"
    },
    {
      "id": "0401",
      "name": "订单列表",
      "parent_id": "04",
      "route": "ordersList",
      "summary": ""
    },
    {
      "id": "05",
      "name": "财务管理",
      "parent_id": "",
      "route": "financial",
      "summary": "success"
    },
    {
      "id": "0501",
      "name": "订单结算",
      "parent_id": "05",
      "route": "ordersSettlement",
      "summary": ""
    },
    {
      "id": "06",
      "name": "资源管理",
      "parent_id": "",
      "route": "resources",
      "summary": "info"
    },
    {
      "id": "0601",
      "name": "APP管理",
      "parent_id": "06",
      "route": "app",
      "summary": ""
    },
    {
      "id": "07",
      "name": "公告管理",
      "parent_id": "",
      "route": "CMS",
      "summary": "info"
    }, {
      "id": "0701",
      "name": "发布公告",
      "parent_id": "07",
      "route": "publishNotice",
      "summary": ""
    }, {
      "id": "0702",
      "name": "公告列表",
      "parent_id": "07",
      "route": "noticeList",
      "summary": ""
    }
  ],
  "resources": [
    {
      "id": "cba62955646c4a489e2ca1442c786270",
      "name": "商品-查询",
      "summary": "",
      "url": "/medications",
      "method": "GET"
    },
    {
      "id": "4028811a5e1820d9015e1824acf20000",
      "name": "获取权限",
      "summary": "",
      "url": "/signin",
      "method": "GET"
    }
  ]
}

export default menudata;
