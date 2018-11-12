<template>
  <section v-loading="listLoading">
    <el-row class="topLine">
      <el-col :span="24">
        <!--多条件搜索-->
        <search-form :searchForm="searchform" @searchBtn="searchList"></search-form>
      </el-col>
    </el-row>
    <!--列表-->
    <el-table
      :data="listTableData"
      style="width: 100%;min-height: 400px">
      <el-table-column
        label="商户ID"
        width="80"
        prop="id">
      </el-table-column>
      <el-table-column
        label="商户头像"
        align="center"
        width="100">
        <template slot-scope="scope">
          <span class="avatar-img">
            <img v-show="scope.row.avatar" :src="scope.row.avatar" alt="暂无">
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="商户名"
        prop="admname"
        align="center">
      </el-table-column>
      <el-table-column
        label="商户昵称"
        prop="nickname"
        align="center">
      </el-table-column>
      <el-table-column
        label="商户类型"
        align="center"
        width="80">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.role == 2 ? '' : 'warning'"
            close-transition
            size="mini">
            {{scope.row.role | typeStatus}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="联系电话"
        prop="phone"
        width="150"
        align="center">
      </el-table-column>
      <el-table-column
        label="创建时间"
        prop="createTime"
        align="center">
      </el-table-column>
      <el-table-column
        label="商户公告"
        prop="introduction"
        align="center">
      </el-table-column>

      <el-table-column
        prop="status"
        label="状态"
        width="80"
        align="center">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status == 1 ? 'success' : 'danger'"
            close-transition
            size="mini">
            {{scope.row.status | operatingStatus}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="店铺详情"
        width="80s"
        align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="lookShopDetails(scope.row.id)">查看</el-button>
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

  import pagination from '@/components/paging'
  export default {
    data() {
      return {
        listLoading:false,

        keywords:'',

        listTableData: [],
        pageNums:'',
        currentPages : 1,

        searchform:[
          {
            value:'',
            name:'mes',
            label:'商家编号/名称/手机号',
          }
        ],
        searchActive:false,
        serachParams:{
          sessionid : util.session('sessionid'),//用户唯一标示
        },
      }
    },
    created(){
      this.addData(1);
    },
    filters: {
      typeStatus(type){
        let status = '';
        type === 2 ? status = '个人' : status = '企业';
        return status;
      },
      operatingStatus: function (value) {
        let state = '';
        value == 0 ? state = '暂停' : state = '营业';
        return state;
      }
    },
    methods:{
      //加载数据
      addData(n){
        this.listLoading = true;
        let params = {
          pageNum : n,//当前访问页数
          sessionid : util.session('sessionid'),//用户唯一标示
        }
        instance.post('/admmes/SelectAllAdminList.do',qs.stringify(params)).then(res => {
          console.info('res:'+JSON.stringify(res));
          //登录超时
          if(res.data.status != 0 && res.data.msg=='管理员未登录，无法获取当前商户信息'){
            return this.$router.push({ path: '/login', query: { from: this.$router.currentRoute.path } });
          }
          if(res.data.status === 0){
            this.listLoading = false;
            let json = res.data.data
            this.pageNums = json.pages;
            this.listTableData = json.list;
          }
        }).catch(util.catchError);
      },
      //分页
      changePaging(val){
        this.searchActive == false ? this.addData(val) : this.searchFormList(val,this.serachParams);
      },
      lookShopDetails(id){
        console.log(id)
      },
      //搜索
      searchList(Form){
        this.searchActive = true;//激活搜索状态

        let i = 0;
        Form.map(n => {
          n.value == '' ? i++ : '';
          this.serachParams[n.name] = n.value;
        });

        Form.length === i ? this.addData(1,1) : this.searchFormList(1,this.serachParams);
      },
      searchFormList(n,params){
        this.listLoading = true;
        params['pageNum'] = n;//搜索页数

        instance.post('/admmes/seleceAdmMessage.do?',qs.stringify(params)).then(res => {
          console.info('res:'+JSON.stringify(res));
          //登录超时
          if(res.data.status != 0 && res.data.msg=='管理员未登录，无法获取当前商户信息'){
            return this.$router.push({ path: '/login', query: { from: this.$router.currentRoute.path } });
          }

          if(res.data.status==1 && res.data.msg=='没有该商户信息'){
            this.listLoading = false;
            this.pageNums = '';
            this.listTableData = [];
            this.tabsStatus = 1;//分类：1
            return
          };


          let json = res.data.data;
          this.pageNums = json.pages;
          this.listTableData = json.list;

          this.tabsStatus = 1;//分类：1

          this.listLoading = false;
        }).catch(util.catchError);
      }
    },
    components:{
      searchForm,
      pagination
    }
  }
</script>

<style scoped lang="scss">
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
