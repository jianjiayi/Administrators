<template>
  <section>
    <el-form ref="form" label-width="140px">
      <el-form-item label="商品主图">
        <upload-img :uploadOption="options1" @success="picSuccess" @delete="picRemove"></upload-img>
      </el-form-item>
      <el-form-item label="附图（轮播图）">
        <upload-img :uploadOption="options2" @success="picSuccess" @delete="picRemove"></upload-img>
      </el-form-item>
      <el-form-item label="是否添加视频">
        <el-switch v-model="switchSattus" disabled></el-switch>
      </el-form-item>
      <div v-show="switchSattus">
        <el-form-item label="视频封面图">
          <upload-img :uploadOption="options3" @success="picSuccess" @delete="picRemove"></upload-img>
        </el-form-item>
        <el-form-item v-if="this.formData.video" label="视频文件">
          <template>
            <div class="video">
              <player-video :playOptions="playoptions"></player-video>
            </div>
          </template>
        </el-form-item>
        <el-form-item v-else label="视频文件">
          <upload-file :uploadOption="options4" @success="picSuccess" @delete="picRemove"></upload-file>
        </el-form-item>
      </div>

      <el-form-item>
        <el-button type="primary" @click="submitUpload" :loading="btnLoading">{{btnText}}</el-button>
        <el-button @click="close()">取消</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>
<script>
  import instance from '@/api';
  const qs = require('qs');
  import * as util from '@/assets/js/util.js';

  import uploadImg from '@/components/upload/uploadImg'

  import uploadFile from '@/components/upload/uploadFile'

  import playerVideo from '@/components/myPlayer'

  export default {
    props:['formData','subImg','switchSattus'],
    data(){
      return {
        btnLoading:false,
        uploadImgFileUrl:'http://192.168.8.188:8082/NewDwShop/profile/fileupload.do',
        options1:{
          url:'http://192.168.8.188:8082/NewDwShop/profile/fileupload.do',
          name:'main',
          limit:1,
          id:'mainImgVal',
          size:'2M',
          resolution:'400*300',
          fileList:[
            {
              name: 'main-img',
              url: this.formData.mainImage
            }
          ]
        },
        options2:{
          url:'http://192.168.8.188:8082/NewDwShop/profile/fileupload.do',
          name:'sub',
          limit:5,
          id:'subImgVal',
          size:'2M',
          resolution:'300*100',
          fileList:this.subImg
        },
        options3:{
          url:'http://192.168.8.188:8082/NewDwShop/profile/fileupload.do',
          name:'videoImg',
          limit:1,
          id:'videoImgVal',
          size:'2M',
          resolution:'300*100',
          fileList:[
            {
              name: 'video-img',
              url: this.formData.videocove
            }
          ]
        },
        options4:{
          url:'http://192.168.8.188:8082/NewDwShop/profile/fileupload.do',
          name:'videoFile',
          limit:1,
          id:'videoFileVal',
          size:'20M',
          resolution:'300*100',
          source:this.formData.video
        },
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
            src: this.formData.video
          }],
          poster: this.formData.videocove, //你的封面地址
          width: document.documentElement.clientWidth,
          notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false,
            fullscreenToggle: true  //全屏按钮
          }
        },
      }
    },
    computed: {
      btnText() {
        if (this.btnLoading) return '正在提交...';
        return '提交';
      }
    },
    methods: {
      //上传主图成功回调
      picSuccess(response){
        console.log(response);
        if(response.name=='main'){
          this.options1.fileList=[
            {
              name: 'main-img',
              url: response.value
            }
          ]
        }else if(response.name=='sub'){
          this.options2.fileList.push(
            {
              name: 'sub-img',
              url: response.value
            })
        }else if(response.name=='videoImg'){
          this.options3.fileList.push(
            {
              name: 'video-img',
              url: response.value
            })
          this.playoptions.poster = response.value;
        }else{
          this.options4.source = response.value;
        }
      },
      picRemove(response){
        console.log(response);
        if(response.name=='main'){
          this.options1.fileList=[]
        }else if(response.name=='sub'){
          let i = this.options2.fileList.findIndex(n => n.url === response.value);
          this.options2.fileList.splice(i,1);
        }else if(response.name=='videoImg'){
          this.options3.fileList=[];
          this.formData.videocove = ''
        }else{
          this.options4.source = '';
        }
      },
      //保存
      submitUpload() {
        let params = {},subImg = '';
        if(this.options1.fileList.length==0||this.options2.fileList.length==0||this.options3.fileList.length==0){
          this.$alert('请填写完整，在提交', '提示', {
            confirmButtonText: '确定',
            type: 'warning',
            callback: action => {}
          });

          return;
        }
        this.btnLoading = true;
        params['mainImage'] = this.options1.fileList[0].url;
        this.options2.fileList.map(n => {
          subImg += n.url+',';
        })
        subImg = subImg.substr(0, subImg.length - 1);

        params['subImages'] = subImg;
        if(this.switchSattus){
          params['videocove'] = this.options3.fileList[0].url;
          params['video'] = this.options4.source;
        }
        console.log(params)

//        ajax

        params['proid'] = this.formData.id;
        params['sessionid'] = util.session('sessionid');//用户唯一标示

        instance.post('/proManage/UpdateProduceMessage.do',qs.stringify(params)).then(res => {
          console.info('res:'+JSON.stringify(res));
          //登录超时
          if(res.data.status != 0 && res.data.msg=='管理员未登录，无法获取当前商户信息'){
            return this.$router.push({ path: '/login', query: { from: this.$router.currentRoute.path } });
          }

          this.btnLoading = false;
          this.$message({
            type: 'success',
            message: '修改成功!'
          });
          this.$emit('changeSuccess')

        }).catch(util.catchError);
      },
      close(){
        this.$emit('closeDialog')
      }
    },
    components:{
      uploadImg,uploadFile,playerVideo
    }
  }
</script>
<style scoped lang="scss">
  .el-icon-zoom-in:before {
    content: "\E62B";
  }
  .video{
    width: 320px;
    box-shadow: 0px 0px 4px #aaa;
  }
</style>
