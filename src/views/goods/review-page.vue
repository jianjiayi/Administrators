<template>
  <el-container v-loading="listLoading">
    <el-header>
      商品详情
    </el-header>
    <el-main>
      <!--状态-->
      <status-header :headerOptions="headerStatus"></status-header>
      <!--详情-->
      <goods-details :formData="listTableData" :playeroptions="playoptions" :selectedOptions="addressOptions"></goods-details>

      <!--审核表单-->
      <el-button class="replyBtn" type="info" @click="editVisible = true">修改详情</el-button>
      <el-button class="replyBtn" v-if="!formVisible" type="primary" @click="formVisible = true">重新审核</el-button>

      <review-form v-else :btnLoading="isBtnLoading" @submitReview="submitForm"></review-form>

      <!--修改详情-->
      <el-dialog
        title="修改产品详情"
        :visible.sync="editVisible"
        width="900px"
        center
        :before-close="handleClose">
        <goods-details-form :formData="listTableData" :subImg="subImgData" :switchSattus="switchBtn" @changeSuccess="editVisible = false" @closeDialog="dialogClose"></goods-details-form>
      </el-dialog>

    </el-main>
    <back-to-top></back-to-top>
  </el-container>
</template>
<script>
  import instance from '@/api';
  const qs = require('qs');
  import * as util from '@/assets/js/util.js';

  import statusHeader from '@/components/headers/statusHeader'
  import goodsDetails from '@/components/details/goodsDetails'
  import reviewForm from '@/components/forms/reviewForm'
  import backToTop from '@/components/backToTop'

  import goodsDetailsForm from '@/components/forms/goodsDetailsForm'
  export default {
    data(){
      return{
        listLoading:false,
        isBtnLoading : false,

        headerStatus:{},//状态栏
        listTableData:[],//数据
        addressOptions:[],//默认地址
        playoptions:{//视频
          playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
          autoplay: false, //如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [{
            type: "video/mp4",
            src: ""
          }],
          poster: '', //你的封面地址
          width: document.documentElement.clientWidth,
          notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false,
            fullscreenToggle: true  //全屏按钮
          }
        },

        formVisible :false,

        //修改详情
        editVisible : false,

        subImgData:[],
        switchBtn:false,
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
          proid : id,//当前资质id
          sessionid : util.session('sessionid'),//用户唯一标示
        }
        instance.post('/admprod/AdmSelectProdMessage.do',qs.stringify(params)).then(res => {
          console.info('res:'+JSON.stringify(res));
          //登录超时
          let status = res.data.status;
          if(res.data.status != 0 && res.data.msg=='管理员未登录，无法获取当前商户信息'){
            return this.$router.push({ path: '/login'});
          };
          let json = res.data.data;
          this.headerStatus = {
            'imgStatus' : json.imgStatus == 1 ? 0 : 1,
            'status' : json.status != 6 || json.status == null? 0 : 1,
            'reason' : json.endyy,
          };
          this.formVisible = json.imgStatus == 0 ? true : false;
          this.listTableData = json;
          this.addressOptions = [json.districtId+'',json.city+'',json.county+''];
          if(json.videocove!=null&&json.videocove!=undefined&&json.videocove!=''){
            this.playoptions.poster = json.videocove;//视频封面图
            this.playoptions.sources[0].src = json.video;//视频文件
            this.switchBtn = true;
          }
          this.listLoading = false;

          this.subImgData=this.subImgList(json.subImages);
        }).catch(util.catchError);
      },
      submitForm(form){
        this.isBtnLoading = true;

        let params = {
          proid : this.listTableData.id,//当前资质id
          status: form.states == 0 ? 1 : 6,
          returnyy:form.reason,
          sessionid : util.session('sessionid'),//用户唯一标示
        }
        instance.post('/admprod/AdmProductExamine.do',qs.stringify(params)).then(res => {
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
      },
      //格式化附图
      subImgList(string){
        let imgArray =[],subImg=[];
        if(string!=''){
          imgArray = string.split(',');
        }
        imgArray.map(n => {
          subImg.push({
            name:'sub-img',
            url:n
          })
        })
        return subImg;
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
      statusHeader,
      goodsDetails,
      reviewForm,
      backToTop,

      goodsDetailsForm
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
