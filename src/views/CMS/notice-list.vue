<template>
  <section v-loading="listLoading">
    <el-table
      :data="listData"
      style="max-width: 100%;min-height: 400px">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        label="创建日期"
        align="center"
        width="200">
        <template slot-scope="scope">
          {{scope.row.createTime | formatDateTime}}
        </template>
      </el-table-column>
      </el-table-column>
      <el-table-column
        label="发布日期"
        align="center"
        width="200">
        <template slot-scope="scope">
          {{scope.row.updateTime | formatDateTime}}
        </template>
      </el-table-column>
      <el-table-column
        prop="textrole"
        label="指定商家"
        align="center"
        width="80">
      </el-table-column>
      <el-table-column
        prop="texttitle"
        align="center"
        label="标题">
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="100">
        <template slot-scope="scope">
          <router-link :to="{path:'/detail/orders',query: {id:scope.row.id}}" target="_blank">
            查看详情
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
        name: "",
        data() {
          return {
            listLoading:false,

            pageNums:'',//总页数
            nowPages:'',//当前页
            currentPages : 1,

            listData:[],

            tableData: [{
              id:'11111',
              date: '2016-05-02',
              name: '全部',
              address: '上海市普陀区金沙江路 1518 弄'
            }, {
              id:'11111',
              date: '2016-05-04',
              name: '全部',
              address: '上海市普陀区金沙江路 1517 弄'
            }, {
              id:'11111',
              date: '2016-05-01',
              name: '全部',
              address: '上海市普陀区金沙江路 1519 弄'
            }, {
              id:'11111',
              date: '2016-05-03',
              name: '全部',
              address: '上海市普陀区金沙江路 1516 弄'
            }]
          }
        },
        filters:{
          formatDateTime(timeStamp){
            let date = new Date();
            date.setTime(timeStamp);
            let y = date.getFullYear();
            let m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            let d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            let h = date.getHours();
            h = h < 10 ? ('0' + h) : h;
            let minute = date.getMinutes();
            let second = date.getSeconds();
            minute = minute < 10 ? ('0' + minute) : minute;
            second = second < 10 ? ('0' + second) : second;
            return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
          }
        },
        components: {
            pagination,
        },
        created(){
          this.addData(1);
        },
        methods:{
          //加载数据
          addData(n){
            this.listLoading = true;
            let params = {
              pageNum : n,//当前访问页数
              sessionid : util.session('sessionid'),//用户唯一标示
            }
            instance.post('/articlemanage/selecttext.do',qs.stringify(params)).then(res => {
              console.info('res:'+JSON.stringify(res));
              //登录超时
              if(res.data.status != 0 && res.data.msg=='管理员未登录，无法获取当前商户信息'){
                return this.$router.push({ path: '/login', query: { from: this.$router.currentRoute.path } });
              }

              if(res.data.status==1 && res.data.msg=='文章没有相关文章'){
                this.listLoading = false;
                this.pageNums = '';
                this.listData = '';
                return
              };

              this.listLoading = false;
              let json = res.data.data;
              this.pageNums = json.pages;
              this.listData = json.list;
            }).catch(util.catchError);
          },
          //分页
          changePaging(val){
            this.currentPages = val;
            this.nowPages = val;
            this.addData(val);
          },
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

</style>
