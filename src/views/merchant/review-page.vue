<template>
  <el-container v-loading="listLoading">
    <el-header>
      商户资质
    </el-header>
    <el-main>
      <!--状态-->
      <status-header :headerOptions="headerStatus"></status-header>
      <!--详情-->
      <qualify-details :formData="listTableData"></qualify-details>
      <!--审核表单-->
      <el-button class="replyBtn" v-if="!formVisible" type="primary" @click="formVisible = true">重新审核</el-button>
      <review-form v-else :btnLoading="isBtnLoading" @submitReview="submitForm"></review-form>
    </el-main>
    <back-to-top></back-to-top>
  </el-container>
</template>
<script>
  import instance from '@/api';
  const qs = require('qs');
  import * as util from '@/assets/js/util.js';

  import statusHeader from '@/components/headers/statusHeader'
  import qualifyDetails from '@/components/details/qualifyDetails'
  import reviewForm from '@/components/forms/reviewForm'
  import backToTop from '@/components/backToTop'
  export default {
    data(){
      return{
        listLoading:false,
        isBtnLoading : false,

        headerStatus:{},//状态栏
        listTableData:[],//数据

        formVisible :false,
      }
    },
    created(){
      let id =  this.$route.query.id;
      this.addData(id);
    },
    methods:{
      addData(id){
        this.listLoading = true;
        let params = {
          verid : id,//当前资质id
          sessionid : util.session('sessionid'),//用户唯一标示
        }
        instance.post('/admver/selectvermessage.do',qs.stringify(params)).then(res => {
          console.info('res:'+JSON.stringify(res));
          //登录超时
          let status = res.data.status;
          if(res.data.status != 0 && res.data.msg=='管理员未登录，无法获取当前商户信息'){
            return this.$router.push({ path: '/login'});
          };
          let json = res.data.data;
          this.headerStatus = {
            'imgStatus' : json.imgStatus,
            'status' : json.status == 40 ? 0 : 1,
            'reason' : json.endyy,
          };
          this.formVisible = json.imgStatus == 1 ? true : false;
          this.listTableData = json;
          this.listLoading = false;
        }).catch(util.catchError);
      },
      submitForm(form){
        this.isBtnLoading = true;

        let params = {
          verid : this.listTableData.id,//当前资质id
          status: form.states == 0 ? 40 : 50,
          returnyy:form.reason,
          sessionid : util.session('sessionid'),//用户唯一标示
        }
        instance.post('/admver/Auditvermessage.do',qs.stringify(params)).then(res => {
          console.info('res:'+JSON.stringify(res));
          //登录超时
          if(res.data.status != 0 && res.data.msg=='管理员未登录，无法获取当前商户信息'){
            return this.$router.push({ path: '/login' });
          }
          this.isBtnLoading = false;
          this.$message({
            message: '审核成功',
            type: 'success'
          });

          this.addData(this.listTableData.id);

        }).catch(util.catchError);
      }
    },
    components:{
      statusHeader,
      qualifyDetails,
      reviewForm,
      backToTop
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
