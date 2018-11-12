<template>
  <el-container v-loading="listLoading">
    <el-header>
      订单详情
    </el-header>
    <el-main>
      <!--详情-->
      <orders-details :orderData="listTableData" :logistics="logisticsData"></orders-details>
    </el-main>
    <back-to-top></back-to-top>
  </el-container>
</template>
<script>
  import instance from '@/api';
  const qs = require('qs');
  import * as util from '@/assets/js/util.js';
  import ordersDetails from '@/components/details/ordersDetails'

  import backToTop from '@/components/backToTop'

  export default {
    data(){
      return{
        listLoading:false,
        isBtnLoading : false,
        listTableData:[],//数据
        logisticsData:{
          orderInfo:{},
          body:{}
        },
      }
    },
    created(){
      let id =  this.$route.query.id;
      this.addData(id);
      this.lookLogistics(id);
    },
    methods:{
      addData(id){
        this.listLoading = true;
        let params = {
          orderNo : id,//当前资质id
          sessionid : util.session('sessionid'),//用户唯一标示
        }
        instance.post('/orderm/selectOedreDetail.do',qs.stringify(params)).then(res => {
          console.info('res:'+JSON.stringify(res));
          //登录超时
          if(res.data.status != 0 && res.data.msg=='管理员未登录，无法获取当前商户信息'){
            return this.$router.push({ path: '/login'});
          };
          let json = res.data.data;
          this.listTableData.push(json);
          this.listLoading = false;
        }).catch(util.catchError);
      },
      lookLogistics(id){
        let params = {
          orderNo:id,
          sessionid : util.session('sessionid'),//用户唯一标示
        }
        let _this = this;
        instance.post('/orderm/AppselectexpressByOrderNo.do',qs.stringify(params)).then(res => {
          console.info('res:'+JSON.stringify(res));
          //登录超时
          if(res.data.status != 0 && res.data.msg=='管理员未登录，无法获取当前商户信息'){
            return this.$router.push({ path: '/login', query: { from: this.$router.currentRoute.path } });
          }

          _this.logisticsData['body'] = res.data.data.showapi_res_body;
          let orderInfo = {
            img : _this.listTableData[0].orderItemVoList[0].productImage,
            num : _this.listTableData[0].orderItemVoList.length
          }
          _this.logisticsData['orderInfo'] = orderInfo;
          console.log(this.logisticsData)
        }).catch(util.catchError);
      },
//      关闭对话框
      handleClose(done) {
        this.$confirm('确认关闭？放弃修改？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      dialogClose(){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.editVisible = false
        }).catch(() => {

        });
      }
    },
    components:{
      ordersDetails,
      backToTop,
    }
  }
</script>
<style scoped lang="scss">
  .el-container{
    .el-header{
      position: fixed;
      left:0;
      top:0;
      width: 100%;
      background: #23C09B;
      line-height: 60px;
      text-align: center;
      z-index: 99;
      color: #ffffff;
      box-shadow: 0 2px 3px #ccc;
    }
    .el-main {
      width: 1000px;
      margin: 60px auto;
      background: #ffffff;
      .replyBtn{
        margin-top: 40px;
        margin-left: 100px;
      }
    }
  }
</style>
