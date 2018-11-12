<template>
  <section>
    <el-form label-position="left" inline class="formlist">
      <el-form-item label="商品ID：">
        <span>{{formData.id}}</span>
      </el-form-item>
      <el-form-item label="商家ID：">
        <span>{{formData.adminId}}</span>
      </el-form-item>
      <el-form-item label="主标题：">
        <span>{{formData.name}}</span>
      </el-form-item>
      <el-form-item
        label="所属商家">
        <router-link :to="{path:'/shop/home',query: {id:formData.adminId}}" target="_blank">
          {{formData.nickname}}
        </router-link>
      </el-form-item>
      <el-form-item label="副标题：">
        <span>{{formData.subtitle}}</span>
      </el-form-item>
      <el-form-item label="商品分类：">
        <span>{{formData.catename}}</span>
      </el-form-item>
      <el-form-item label="商品主图：">
        <div class="img-box">
          <span class="views-img">
            <img v-preview="formData.mainImage"
                 :src="formData.mainImage"
                 alt="主图"
                 key="1"
                 preview-title-enable="true"
                 preview-nav-enable="false">
          </span>
          <span class="solt">(点击图片查看大图)</span>
        </div>
      </el-form-item>
      <el-form-item label="商品类型：">
        <el-tag
          :type="formData.reserve == 0 || formData.reserve == null ? '' : 'warning'"
          close-transition
          size="mini">
          {{formData.reserve | typeStatus}}
        </el-tag>
        <span v-show="formData.reserve != 0 && formData.reserve != null" style="color: red">
          <br>
          预售商品数量：{{formData.reserveNum}} 件<br>
          预售日期：{{formData.reserveDays}}
        </span>
      </el-form-item>

      <el-form-item label="商品附图：">
        <div class="banner">
          <el-carousel
            trigger="click"
            height="100px"
            type="card"
            indicator-position="none">
            <el-carousel-item v-for="(src,index) in getImgArray(formData.subImages)" :key="index">
              <img v-preview="src"
                   :src="src"
                   alt="商品附图"
                   :key="111"
                   preview-title-enable="true">
            </el-carousel-item>
          </el-carousel>
          <span class="solt">(点击图片查看大图)</span>
        </div>
      </el-form-item>
      <el-form-item label="运费：">
        <span>{{formData.postage}} 元</span>
        <!--开启条件包邮 0-不是条件包邮-->
        <div v-show="formData.conditionalMail != 0 && formData.conditionalMail != null" style="color: red">
          <!--1-根据件数-->
          <span v-if="formData.conditionalMail === 1">
            满 {{formData.enoughNum}} 件包邮
          </span>
          <!--2-根据钱数 -->
          <span v-else-if="formData.conditionalMail === 2">
            满 {{formData.enoughMoney}} 元包邮
          </span>
          <!--3-件数和地域限制-->
          <span v-else-if="formData.conditionalMail === 3">
            满 {{formData.enoughNum}} 件包邮，除 {{formData.nocityMail}} 地区外
          </span>
          <!--4-钱数和地域限制 -->
          <span v-else>
            满 {{formData.enoughMoney}} 元包邮，除 {{formData.nocityMail}} 地区外
          </span>
        </div>
      </el-form-item>

      <!--上传视频star-->
      <el-form-item v-show="formData.videocove!=null&&formData.videocove!=''" label="视频封面图：">
        <div class="img-box">
          <span class="views-img" style="width: 300px;height: 180px">
            <img v-preview="formData.videocove"
                 :src="formData.videocove"
                 alt="视频封面图"
                 key="3"
                 preview-title-enable="true"
                 preview-nav-enable="false">
          </span>
        </div>
        <span class="solt">(点击图片查看大图)</span>
      </el-form-item>
      <el-form-item v-show="formData.videocove!=null&&formData.videocove!=''" label="短视频文件：">
        <template>
          <div class="video">
            <template>
              <div class="container">
                <div class="player">
                  <video-player  class="video-player vjs-custom-skin"
                                 ref="videoPlayer"
                                 :playsinline="true"
                                 :options="playeroptions"
                                 @play="onPlayerPlay($event)"
                                 @pause="onPlayerPause($event)"
                  >
                  </video-player>
                </div>
              </div>
            </template>
          </div>
        </template>
      </el-form-item>
      <!--end-->

      <el-form-item label="库存数量：">
        <span>{{formData.stock | notNull}} 件</span>
      </el-form-item>
      <el-form-item label="收藏数：">
        <span>{{formData.collection |  notNull}} 件</span>
      </el-form-item>
      <el-form-item label="商品单价：">
        <span>{{formData.price}} 元</span>
      </el-form-item>
      <el-form-item label="规格：">
        <span>{{formData.spec}}</span>
      </el-form-item>
      <el-form-item label="销量：">
        <span>{{formData.sales | notNull}} 件</span>
      </el-form-item>
      <el-form-item label="权重：">
        <span>{{formData.weight | notNull}}</span>
      </el-form-item>
      <el-form-item label="主营产品：">
          <span>
            {{formData.product}}
          </span>
      </el-form-item>
      <el-form-item label="产地：">
          <template>
            <el-cascader
              disabled
              size="200px"
              :options="cityOptions"
              v-model="selectedOptions"
              @change="handleChange">
            </el-cascader>
          </template>
      </el-form-item>
    </el-form>
    <el-form label-position="left">
      <el-form-item label="商品详情：">
        <div class="details" v-html="formData.detail"></div>
      </el-form-item>
    </el-form>
  </section>
</template>
<script>
  import { videoPlayer } from 'vue-video-player';

  import instance from '@/api';
  const qs = require('qs');
  import * as util from '@/assets/js/util.js';

  import city from '@/assets/js/city.js';

  export default {
    props:['formData','playeroptions','selectedOptions'],
    data(){
      return{
        cityOptions:city,
      }
    },
    filters:{
      notNull(val){
        let str = '';
        val === null ? str = 0 : str = val;
        return str;
      },
      typeStatus(type){
        let typeStatus = {};
        type === 0 || type === null? status = '普通' : status = '预售';
        return status;
      },
      reviewStatus(val){
        let status = '';
        val === 40 ? status = '已通过' : status = '未通过';
        return status;
      },
    },
    computed: {
      player() {
        return this.$refs.videoPlayer.player
      }
    },
    methods:{
      getImgArray(string){
        return (string||"").split(',');
      },
      onPlayerPlay(player) {
        console.log("play");
      },
      onPlayerPause(player){
        console.log("pause");
      },
      handleChange(value) {
        console.log(value);
      }
    },
    components:{
      videoPlayer
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

  span.solt{
    font-size: 8px;
    color: #3a8ee6;
    line-height: 14px;
    margin-left: 10px;
  }
  .formlist{
    display: flex;
    display: -webkit-flex;
    flex-flow: wrap;
    -webkit-flex-flow: wrap;
    justify-content: space-between;
    -webkit-justify-content: space-between;
    .el-form-item{
      width: 45%;
    }
  }

  .banner{
    width: 300px;
    display: inline-block;
    .el-carousel__item{
      img{
        width:100%;
        height: 100%;
      }
    }
    span.solt{
      font-size: 8px;
      color: #3a8ee6;
      line-height: 14px;
      margin-left: 10px;
    }
  }
  .video{
    width: 320px;
    box-shadow: 0px 0px 4px #aaa;
  }
  .details{
    max-height: 400px;
    overflow: auto;
    img{
      max-width: 100%;
    }
  }
  .headerImg{
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    display: -webkit-flex;
    box-shadow: 0px 0px 4px #aaa;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .views-img{
    width: 200px;
    height: 100px;
    overflow: hidden;
    display: flex;
    display: -webkit-flex;
    box-shadow: 0px 0px 4px #aaa;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .card{
    width: 250px;
    height: 160px;
    overflow: hidden;
    display: flex;
    display: -webkit-flex;
    box-shadow: 0px 0px 4px #aaa;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .container {
    background-color: #efefef;
    min-height: 100%;
  }
  .vjs-poster{
    background-size: cover;
  }
</style>
