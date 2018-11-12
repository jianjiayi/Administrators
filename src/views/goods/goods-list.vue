<template>
  <section v-loading="listLoading">
    <el-row class="topLine">
      <el-col :span="24">
        <!--多条件搜索-->
        <search-form :searchForm="searchform" @searchBtn="searchList"></search-form>
      </el-col>
    </el-row>

    <!--标签页-->
    <tab-pane :tabs="tabsOptions" :activeLabel="tabActiveIndex" @changeTabs="changeTableData"></tab-pane>

    <!--列表-->
    <goods-list :listTableData="listData" @updateRow="updateStatus"></goods-list>

    <!--分页-->
    <pagination :numbers="pageNums" :currentPage="currentPages" @currentChange="changePaging"></pagination>
  </section>
</template>
<script>
  import instance from '@/api';
  const qs = require('qs');
  import * as util from '@/assets/js/util.js';

  import searchForm from '@/components/forms/searchForm'

  import tabPane from '@/components/tabpane'

  import goodsList from '@/components/lists/goodslist'

  import pagination from '@/components/paging'
  export default {
    data() {
      return {
        listLoading:false,
        keywords:'',

        tabsOptions:[
          {
            value:8,
            label:'所有'
          },
          {
            value:1,
            label:'在售'
          },
          {
            value:2,
            label:'下架'
          },
          {
            value:3,
            label:'删除'
          },
          {
            value:4,
            label:'未审核'
          },
          {
            value:6,
            label:'不合格'
          },
          {
            value:0,
            label:'强制下架'
          },
        ],
        tabActiveIndex:'所有',


        tabsStatus:8,
        listData: [],
        pageNums:'',//总页数
        nowPages:'',//当前页
        currentPages : 1,

        searchform:[
          {
            value:'',
            name:'productid',
            label:'商品编号',
          },
          {
            value:'',
            name:'productname',
            label:'商品名称',
          },
          {
            value:'',
            name:'adminid',
            label:'所属商家ID',
          },
        ],
        searchActive:false,
        serachParams:{
          sessionid : util.session('sessionid'),//用户唯一标示
        },
      }
    },
    created(){
      this.addData(1,this.tabsStatus);
    },
    methods:{
      handleEdit(){
        let routeData = this.$router.resolve({name: '/reviewGoods', query: {data: "someData"}});
        window.open(routeData.href, '_blank');
      },
      //加载数据
      addData(n,status){
        this.listLoading = true;
        let params = {
          pageNum : n,//当前访问页数
          status:status,
          sessionid : util.session('sessionid'),//用户唯一标示
        }
        instance.post('/proManage/SelectProdListByStatus.do',qs.stringify(params)).then(res => {
          console.info('res:'+JSON.stringify(res));
          //登录超时
          if(res.data.status != 0 && res.data.msg=='管理员未登录，无法获取当前商户信息'){
            return this.$router.push({ path: '/login', query: { from: this.$router.currentRoute.path } });
          }

          if(res.data.status==1 && res.data.msg=='商品列表为空'){
            this.listLoading = false;
            this.pageNums = '';
            this.listData = [];
            return
          };

          this.listLoading = false;
          let json = res.data.data
          this.pageNums = json.pages;
          this.listData = json.list;
        }).catch(util.catchError);
      },
      //更新状态
      updateStatus(form){
        this.listLoading = true;
        let params = {
          st : form.status,//当前访问页数
          proid:form.id,
          sessionid : util.session('sessionid'),//用户唯一标示
        }
        let _this = this;
        instance.post('/proManage/DeleteProduct.do',qs.stringify(params)).then(res => {
          console.info('res:'+JSON.stringify(res));
          //登录超时
          if(res.data.status != 0 && res.data.msg=='管理员未登录，无法获取当前商户信息'){
            return this.$router.push({ path: '/login', query: { from: this.$router.currentRoute.path } });
          }

          _this.$set(_this.listData[form.index],'status',form.status);//更新 数据

          _this.addData(_this.nowPages,_this.tabsStatus);

          _this.listLoading = false;
        }).catch(util.catchError);
      },

      //分页
      changePaging(val){
        this.currentPages = val;
        this.nowPages = val;
        this.searchActive == false ? this.addData(val,this.tabsStatus) : this.searchFormList(val,this.serachParams);
      },
      //分类
      changeTableData(label){
        console.log(label);
        this.searchActive = false;//冻结搜索状态

        this.currentPages = 1;//分页默认第一页

        this.tabActiveIndex = label;//修改标签选中值

        let tab = this.tabsOptions.find(n => n.label === label);
        this.tabsStatus = tab.value;
        this.addData(1,this.tabsStatus);//加载数据

        //重置搜索状态
        this.searchform.map(n => {
          n.value = '';
        });
      },

      //搜索
      searchList(Form){
        this.searchActive = true;//激活搜索状态

        this.tabActiveIndex = this.tabsOptions[0].label;//激活标签所有

        let i = 0;
        Form.map(n => {
          n.value == '' ? i++ : '';
          if(n.value == ''&&n.name!='productname'){
            this.serachParams[n.name] = 0;
          }else{
            this.serachParams[n.name] = n.value;
          }
        });

        Form.length === i ? this.addData(1,1) : this.searchFormList(1,this.serachParams);
      },
      searchFormList(n,params){
        this.listLoading = true;
        params['pageNum'] = n;//搜索页数

        instance.post('/proManage/getProductByMes.do?',qs.stringify(params)).then(res => {
          console.info('res:'+JSON.stringify(res));
          //登录超时
          if(res.data.status != 0 && res.data.msg=='管理员未登录，无法获取当前商户信息'){
            return this.$router.push({ path: '/login', query: { from: this.$router.currentRoute.path } });
          }

          if(res.data.status==1 && res.data.msg=='没有相关商品信息'){
            this.listLoading = false;
            this.pageNums = '';
            this.listData = [];
            this.tabsStatus = 1;//分类：1
            return
          };


          let json = res.data.data;
          this.pageNums = json.pages;
          this.listData = json.list;

          this.tabsStatus = 1;//分类：1

          this.listLoading = false;
        }).catch(util.catchError);
      }
    },
    components:{
      searchForm,
      goodsList,
      tabPane,
      pagination
    }
  }
</script>
<style scoped lang="scss">

</style>


