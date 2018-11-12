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


    <el-table
      :data="listTableData"
      stripe
      style="width: 100%">
      <el-table-column
        fixed
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="adminId"
        label="商户编号"
        align="center"
        width="100">
      </el-table-column>
      <el-table-column
        prop="vername"
        label="法人名称"
        align="center">
      </el-table-column>
      <el-table-column
        label="商户类型"
        align="center">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.sorss == 2 ? '' : 'warning'"
            close-transition
            size="mini">
            {{scope.row.sorss | typeStatus}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="phone"
        label="联系电话"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center">
      </el-table-column>
      <el-table-column
        prop="product"
        label="主营产品"
        align="center">
      </el-table-column>
      <el-table-column
        label="审核状态"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.imgStatus == 1">
             <el-tag
               close-transition
               size="mini">
               未审核
            </el-tag>
          </span>
          <span v-else>
             <el-tag
               :type="scope.row.status == 40 ? 'success' : 'danger'"
               close-transition
               size="mini">
              {{scope.row.status | reviewStatus}}
            </el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        width="80">
        <template slot-scope="scope">
          <router-link :to="{path:'/reviewMerchant',query: {id:scope.row.id}}" target="_blank">
            <el-button size="mini">查看</el-button>
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

  import pagination from '@/components/paging'
  export default {
    data() {
      return {
        listLoading:false,
        keywords:'',


        tabsOptions:[
          {
            value:1,
            label:'所有'
          },
          {
            value:20,
            label:'未审核'
          },
          {
            value:40,
            label:'已通过'
          },
          {
            value:50,
            label:'未通过'
          }
        ],
        tabActiveIndex:'所有',


        tabsStatus:1,
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
      this.addData(1,this.tabsStatus);
    },
    filters:{
      typeStatus(type){
        let status = '';
        type === 2 ? status = '个人' : status = '企业';
        return status;
      },
      reviewStatus(val){
        let status = '';
        val === 40 ? status = '已通过' : status = '未通过';
        return status;
      },
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
          statusNum:status,
          sessionid : util.session('sessionid'),//用户唯一标示
        }
        instance.post('/admver/admveraptitude.do',qs.stringify(params)).then(res => {
          console.info('res:'+JSON.stringify(res));
          //登录超时
          if(res.data.status != 0 && res.data.msg=='管理员未登录，无法获取当前商户信息'){
            return this.$router.push({ path: '/login', query: { from: this.$router.currentRoute.path } });
          }

          if(res.data.status==1 && res.data.msg=='没有该状态的资质审核信息'){
            this.listLoading = false;
            this.pageNums = '';
            this.listTableData = '';
            return
          };

          this.listLoading = false;
          let json = res.data.data
          this.pageNums = json.pages;
          this.listTableData = json.list;
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
          this.serachParams[n.name] = n.value;
        });

        Form.length === i ? this.addData(1,1) : this.searchFormList(1,this.serachParams);
      },
      searchFormList(n,params){
        this.listLoading = true;
        params['pageNum'] = n;//搜索页数

        instance.post('/admver/admfindverByPhone.do?',qs.stringify(params)).then(res => {
          console.info('res:'+JSON.stringify(res));
          //登录超时
          if(res.data.status != 0 && res.data.msg=='管理员未登录，无法获取当前商户信息'){
            return this.$router.push({ path: '/login', query: { from: this.$router.currentRoute.path } });
          }

          if(res.data.status==1 && res.data.msg=='没有找到对应的数据'){
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
      tabPane,pagination,searchForm
    }
  }
</script>
<style scoped lang="scss">
  .el-tabs__nav-wrap::after{
    height: 0;
  }
</style>
