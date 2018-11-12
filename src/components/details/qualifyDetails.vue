<template>
  <section>
    <el-form label-position="right" class="baselist">
      <!--<el-form-item label="商铺头像：">-->
      <!--<div class="img-box">-->
      <!--<span class="headerImg">-->
      <!--<img v-preview="formData.verimages"-->
      <!--:src="formData.verimages"-->
      <!--alt="商铺头像"-->
      <!--:key="18"-->
      <!--preview-title-enable="true"-->
      <!--preview-nav-enable="false">-->
      <!--</span>-->
      <!--<span class="solt">(点击图片查看大图)</span>-->
      <!--</div>-->
      <!--</el-form-item>-->
      <el-form-item label="商户ID：">
        <span>{{formData.adminId	}}</span>
      </el-form-item>
      <el-form-item label="商铺编号：">
        <span>{{formData.admnumber }}</span>
      </el-form-item>
      <el-form-item label="法人姓名：">
        <span>{{formData.vername}}</span>
      </el-form-item>
      <el-form-item label="法人身份证号：">
        <span>{{formData.idcard}}</span>
      </el-form-item>
      <el-form-item label="商户类型：">
          <span>
            <el-tag
              :type="formData.sorss == 2 ? 'success' : 'danger'"
              close-transition
              size="mini">
              {{formData.sorss | typeStatus}}
            </el-tag>
          </span>
      </el-form-item>
      <el-form-item v-show="formData.sorss == 3" label="营业执照编号：">
        <span>{{formData.license}}</span>
      </el-form-item>
      <el-form-item v-show="formData.sorss == 3" label="营业执照：">
        <div class="img-box">
          <span class="lencess">
            <img v-preview="formData.verimages"
                 :src="formData.verimages"
                 alt="营业执照"
                 key="10"
                 preview-title-enable="true"
                 preview-nav-enable="false">
          </span>
          <span class="solt">(点击图片查看大图)</span>
        </div>
      </el-form-item>

      <el-form-item label="联系电话：">
          <span>
            {{formData.phone}}
          </span>
      </el-form-item>
      <el-form-item label="主营产品：">
          <span>
            {{formData.product}}
          </span>
      </el-form-item>
      <el-form-item label="联系地址：">
          <span>
            {{formData.sheng}} - {{formData.shi}} - {{formData.quxian}}
          </span>
      </el-form-item>
      <el-form-item label="详细地址：">
          <span>
            {{formData.address}}
          </span>
      </el-form-item>
      <el-form-item label="银行账户：">
          <span>
            {{formData.bankcard}}
          </span>
      </el-form-item>
      <el-form-item label="开户行：">
          <span>
            {{formData.bankadr}}
          </span>
      </el-form-item>
      <el-form-item label="支付宝账号：">
          <span>
            {{formData.alipay}}
          </span>
      </el-form-item>
      <el-form-item label="微信账号：">
          <span>
            {{formData.wxpay}}
          </span>
      </el-form-item>
      <el-form-item label="身份证正面：">
        <div class="img-box">
            <span class="card">
              <img v-preview="formData.cardimg1"
                   :src="formData.cardimg1"
                   alt="身份证正面"
                   :key="11"
                   preview-title-enable="true"
                   preview-nav-enable="false">
            </span>
          <span class="solt">(点击图片查看大图)</span>
        </div>
      </el-form-item>
      <el-form-item label="身份证背面：">
        <div class="img-box">
           <span class="card">
              <img v-preview="formData.cardimg2"
                   :src="formData.cardimg2"
                   alt="身份证背面"
                   :key="12"
                   preview-title-enable="true"
                   preview-nav-enable="false">
            </span>
          <span class="solt">(点击图片查看大图)</span>
        </div>
      </el-form-item>
      <el-form-item label="手持身份证：">
        <div class="img-box">
            <span class="card">
              <img v-preview="formData.cardimg3"
                   :src="formData.cardimg3"
                   alt="手持身份证"
                   :key="13"
                   preview-title-enable="true"
                   preview-nav-enable="false">
            </span>
          <span class="solt">(点击图片查看大图)</span>
        </div>
      </el-form-item>
    </el-form>
  </section>
</template>
<script>
  import instance from '@/api';
  const qs = require('qs');
  import * as util from '@/assets/js/util.js';

  export default {
    props:['formData'],
    data(){
      return{

      }
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
  }
</script>
<style scoped lang="scss">
  .img-box{
    display: flex;
    display: -webkit-flex;
    align-items: flex-end;
    span.solt{
      font-size: 8px;
      color: #3a8ee6;
      line-height: 14px;
      margin-left: 10px;
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
  .lencess{
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
</style>
