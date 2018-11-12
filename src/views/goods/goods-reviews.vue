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
    <el-table
      :data="listData"
      style="width: 100%;min-height: 400px">
      <el-table-column
        label="商品ID"
        prop="id"
        align="center"
        width="100">
      </el-table-column>

      <el-table-column
        label="商品主图"
        align="center">
        <template slot-scope="scope">
          <span class="main-img">
            <img v-show="scope.row.mainImage" :src="scope.row.mainImage" alt="暂无">
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="主标题"
        prop="name"
        align="center">
      </el-table-column>
      <el-table-column
        label="分类"
        prop="catename"
        align="center">
      </el-table-column>
      <el-table-column
        label="类型"
        align="center"
        width="80">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.reserve == 0 ? '' : 'warning'"
            close-transition
            size="mini">
            {{scope.row.reserve | typeStatus}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="所属商家"
        align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" class="abtn">{{scope.row.nickname}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="商家ID"
        prop="adminId"
        align="center">
      </el-table-column>
      <el-table-column
        label="创建时间"
        prop="createTime"
        align="center">
      </el-table-column>
      <el-table-column
        label="更新时间"
        prop="updateTime"
        align="center">
      </el-table-column>

      <el-table-column
        prop="status"
        label="状态"
        header-align="center"
        align="center">
        <template slot-scope="scope">
          <el-tag
            :type="operatingStatusType(scope.row.status)"
            close-transition
            size="mini">
            {{scope.row.status | operatingStatus}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="80"
        align="center">
        <template slot-scope="scope">
          <router-link :to="{path:'/reviewGoods',query: {id:scope.row.id}}" target="_blank">
            查看
          </router-link>
        </template>
      </el-table-column>
    </el-table>

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
            value:4,
            label:'未审核'
          },
          {
            value:123,
            label:'已通过'
          },
          {
            value:6,
            label:'不合格'
          }
        ],
        tabActiveIndex:'所有',


        tabsStatus:8,
        listData: [],
        pageNums:'',
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
    filters: {
      typeStatus(type){
        let typeStatus = {};
        type === 0 ? status = '普通' : status = '预售';
        return status;
      },
      operatingStatus: function (value) {
        let state = '';
        switch(value){
          case 1 :
            return state = '在售';
            break;
          case 2 :
            return state = '下架';
            break;
          case 3 :
            return state = '删除';
            break;
          case 4 :
            return state = '未审核';
            break;
          case 6 :
            return state = '不合格';
            break;
          case 0 :
            return state = '强制下架';
            break;
        }
        return state;
      }
    },
    created(){
      this.addData(1,this.tabsStatus);
    },
    methods:{
      handleEdit(){
        let routeData = this.$router.resolve({name: '/review', query: {data: "someData"}});
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
        instance.post('/admprod/AdmSelectProdListByStatus.do',qs.stringify(params)).then(res => {
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
      operatingStatusType(value){
        let state = '';
        switch(value){
          case 1 :
            return state = 'success';
            break;
          case 2 :
            return state = 'info';
            break;
          case 3 :
            return state = 'warning';
            break;
          case 4 :
            return state = '';
            break;
          case 6 :
            return state = 'danger';
            break;
          case 0 :
            return state = 'danger';
            break;
        }
        return state;
      },
      getImgArrray(string){
        return string.split(',')
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

        Form.length === i ? this.addData(1,8) : this.searchFormList(1,this.serachParams);
      },
      searchFormList(n,params){
        this.listLoading = true;
        params['pageNum'] = n;//搜索页数

        instance.post('/admprod/getProductverByMes.do ?',qs.stringify(params)).then(res => {
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
  a{
    font-size: 12px;
    line-height: 30px;
    color: #3a8ee6;
    text-decoration: underline;
  }
  a:hover{
    color: #2cca9a;
  }
  .main-img{
    width: 90px;
    height: 50px;
    background: #cccccc;
    display: block;
    overflow: hidden;
    margin: 3px auto;
    box-shadow: 0 0 3px #000;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .avatar-img{
    width: 50px;
    height: 50px;
    background: #cccccc;
    display: block;
    overflow: hidden;
    border-radius: 50%;
    margin: 3px auto;
    box-shadow: 0 0 3px #000;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 100px;
    margin: 0;
  }
  .banner{
    width: 200px;
    margin:0 auto;
    .el-carousel__item{
      img{
        width: 100%;
        height: 100%;
      }
    }

    button{
      width: 10px;
      height: 10px;
      background: red;
    }
  }
  .el-carousel__indicators {
    position: absolute;
    list-style: none;
    bottom: 0;
    left: 50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    margin: 0;
    padding: 0;
    z-index: 2;
    background: red;
    .el-carousel__indicator {
      display: inline-block;
      background-color: transparent;
      padding: 12px 4px;
      cursor: pointer;
      .el-carousel__button {
        display: block;
        opacity: .48;
        width: 5px;
        height: 5px;
        background-color: #fff;
        border: none;
        outline: 0;
        padding: 0;
        margin: 0;
        cursor: pointer;
        -webkit-transition: .3s;
        transition: .3s;
      }
    }
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>


