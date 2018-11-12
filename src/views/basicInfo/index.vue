<template>
  <section v-loading="listLoading">
    <el-form label-position="right" class="baselist">
      <el-form-item label="头像：">
        <span class="img">
          <img v-show="baseData.photo"  :src="baseData.photo" alt="">
        </span>
        <i class="fa fa-pencil-square-o" aria-hidden="true" @click="changeImg(baseData.photo)"></i>
      </el-form-item>
      <el-form-item label="账户名：">
        <span v-if="changeNickName">
          {{baseData.nickname}}
        </span>
      </el-form-item>
      <el-form-item label="登录密码：">
        <span>
          <strong>······</strong>
          <i class="fa fa-pencil-square-o" aria-hidden="true" @click="passwordDialogVisible = true"></i>
        </span>
      </el-form-item>

      <el-form-item label="真实姓名：">
        <span>{{baseData.name}}</span>
      </el-form-item>
      <el-form-item label="ID编号：">
        <span>{{baseData.id}}</span>
      </el-form-item>
      <el-form-item label="联系电话：">
        <span>
          {{baseData.phone}}
        </span>
      </el-form-item>
      <el-form-item label="所属部门：">
        <span>{{baseData.dept}}</span>
      </el-form-item>
      <el-form-item label="工作职位：">
        <span>{{baseData.job}}</span>
      </el-form-item>
      <el-form-item label="入职日期：">
        <span>{{baseData.createtime}}</span>
      </el-form-item>
      <el-form-item label="拥有权限：">
        <span v-if="baseData.role==''">{{baseData.role}}</span>
        <el-tag v-else style="margin-right:5px" size="mini" v-for="(tag,index) in getHasRoles(baseData.role)" :type="tag.summary" :key="index">{{tag.name}}</el-tag>
      </el-form-item>
    </el-form>

    <!--修改登录密码-->
    <el-dialog
      title="安全验证"
      :visible.sync="passwordDialogVisible"
      width="300px"
      center
      :before-close="handleClose">

      <el-alert
        title="提示"
        type="warning"
        :closable="false"
        description="请输入登录密码，验证成功即可修改">
      </el-alert>
      <!--安全验证-->
      <safe-password :status="activeStatus" :btnLoading="isBtnLoading" @passwordSubmit="safePassword"></safe-password>

      <!--支付密码-->
      <el-dialog
        width="300px"
        title="修改密码"
        center
        :visible.sync="innerVisible"
        append-to-body
        >
        <change-password :btnLoading="isBtnLoading" @submitBtn="submit"></change-password>
      </el-dialog>
    </el-dialog>


    <!--修改头像-->
    <el-dialog title="更换头像" :visible.sync="dialogTableVisible" width="700px">
      <div class="cropper-content">
        <div class="cropper">
          <vueCropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.size"
            :outputType="option.outputType"
            :info="true"
            :full="option.full"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :fixedBox="option.fixedBox"
            @realTime="realTime"
            @imgLoad="imgLoad"
          ></vueCropper>
        </div>
        <div class="show-preview" :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden', 'margin': '5px'}">
          <div :style="previews.div" class="preview">
            <img :src="previews.url" :style="previews.img">
          </div>
        </div>
      </div>

      <div class="footer-btn">
        <div class="scope-btn">
          <label class="btn" for="uploads">更换图片</label>
          <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">

          <el-button size="mini" type="primary" plain icon="fa fa-search-plus" @click="changeScale(1)"></el-button>
          <el-button size="mini" type="primary" plain icon="fa fa-search-minus" @click="changeScale(-1)"></el-button>
          <el-button size="mini" type="primary" plain @click="rotateLeft">↺</el-button>
          <el-button size="mini" type="primary" plain @click="rotateRight">↻</el-button>
        </div>
        <div class="upload-btn">
          <el-button size="mini" type="danger" :loading="isBtnLoading" @click="upload('base64')">{{btnText}}<i class="el-icon-upload el-icon--right"></i></el-button>
        </div>
      </div>
    </el-dialog>
  </section>
</template>
<script>
  import VueCropper from 'vue-cropper'

  import instance from '@/api';
  const qs = require('qs');
  import * as util from '@/assets/js/util.js';

  import safePassword from '@/components/forms/safePassword'
  import changePassword from '@/components/forms/setPassword'

  import {mapGetters,mapMutations} from 'vuex';

  export default {
    data() {
      return {
        listLoading:false,
        isBtnLoading: false,

        changeNickName:true,

        baseData:{},

        dialogTableVisible:false,
        modelSrc: '',
        crap: false,
        previews: {},
        option: {
          img: '',
          size: 1,
          full: false,
          outputType: 'png',
          canMove: true,
          original: false,
          canMoveBox: true,
          autoCrop: true,
          autoCropWidth: 200,
          autoCropHeight: 200,
          fixedBox: true
        },

        downImg: '#',

        passwordDialogVisible:false,
        innerVisible:false,

        activeStatus:false,
      };
    },
    created:function(){
      this.loadData();
    },
    computed: {
      ...mapGetters(['getUser']),
      btnText() {
        if (this.isBtnLoading) return '提交...';
        return '提交';
      }
    },
    methods: {
      ...mapMutations(['setUserImg']),
      //加载数据
      loadData(){
        this.listLoading = true;
        let para = {
          status:1,
          sessionid : util.session('sessionid'),//用户唯一标示
        }
        instance.post('/super/getLoginInfo.do?',qs.stringify(para)).then(res => {
          console.log(res)
          this.listLoading = false;
          this.baseData = res.data.data;
        }).catch(util.catchError)
      },
      //获得服务器上已有的权限
      getHasRoles(rolesStr){
        if(rolesStr === '')  return [];
        let hasArray = eval('(' + rolesStr + ')');//格式化权限为数组


        //将菜单数据转成多维数组格式
        let arrayMenus = util.buildMenu(hasArray.menus);


        return  arrayMenus
      },
      //修改头像
      changeImg(img){
        this.dialogTableVisible = true;
        console.log(img)
        this.option.img = img
      },
      changeScale (num) {
        num = num || 1
        this.$refs.cropper.changeScale(num)
      },
      rotateLeft () {
        this.$refs.cropper.rotateLeft()
      },
      rotateRight () {
        this.$refs.cropper.rotateRight()
      },
      finish (type) {
        // 输出
        // var test = window.open('about:blank')
        // test.document.body.innerHTML = '图片生成中..'
        if (type === 'blob') {
          this.$refs.cropper.getCropBlob((data) => {
            var img = window.URL.createObjectURL(data)
            this.model = true
            this.modelSrc = img
          })
        } else {
          this.$refs.cropper.getCropData((data) => {
            this.model = true
            this.modelSrc = data
          })
        }
      },
      // 实时预览函数
      realTime (data) {
        this.previews = data
      },
      upload (type) {
        this.isBtnLoading = true;
        // event.preventDefault()
        var aLink = document.createElement('a')
        aLink.download = 'author-img'
        // 输出
        if (type === 'blob') {
          this.$refs.cropper.getCropBlob((data) => {
            console.log(data)
            this.downImg = window.URL.createObjectURL(data)
//            aLink.download = this.downImg;
            console.log(this.downImg)
            aLink.href = window.URL.createObjectURL(data)

            aLink.click()
          })
        } else {
          this.$refs.cropper.getCropData((data) => {
            console.log(data.split(',')[1])
            let params = {
              base64Code:data.split(',')[1],
              sessionid : util.session('sessionid'),//用户唯一标示
            }
            instance.post('/super/uploadSuperHead.do?',qs.stringify(params)).then(res => {
              console.log(res);
              //登录超时
              if(res.data.status != 0 && res.data.msg=='管理员未登录，无法获取当前商户信息'){
                return this.$router.push({ path: '/login', query: { from: this.$router.currentRoute.path } });
              }

              this.isBtnLoading = false;
              this.dialogTableVisible = false;
              this.baseData.photo = res.data.data;

              this.setUserImg(res.data.data);
            }).catch(util.catchError)
          })
        }
      },
      uploadImg (e, num) {
        //上传图片
        // this.option.img
        var file = e.target.files[0]
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
          alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
          return false
        }
        var reader = new FileReader()
        reader.onload = (e) => {
          let data
          if (typeof e.target.result === 'object') {
            // 把Array Buffer转化为blob 如果是base64不需要
            data = window.URL.createObjectURL(new Blob([e.target.result]))
          } else {
            data = e.target.result
          }
          if (num === 1) {
            this.option.img = data
          }
        }
        // 转化为base64
        // reader.readAsDataURL(file)
        // 转化为blob
        reader.readAsArrayBuffer(file)
      },
      imgLoad (msg) {
        console.log(msg)
      },

      //安全验证
      safePassword(passWord){
        this.isBtnLoading = true;
        this.activeStatus = true;
        console.log(passWord)
        let loginParams={
          sessionid: util.session('sessionid'),//用户唯一标示
          oldpass: passWord
        };
        instance.post(`/super/checkpass.do`, qs.stringify(loginParams)).then(res => {
          console.info('res:'+JSON.stringify(res))
          //登录超时
          if(res.data.status != 0 && res.data.msg=='管理员未登录，无法获取当前商户信息'){
            return this.$router.push({ path: '/login', query: { from: this.$router.currentRoute.path } });
          }

          let status = res.data.status;
          if(status === 0){//登陆成功
            this.$message.success('验证成功');
            this.isBtnLoading = false;
            this.passwordDialogVisible = false;
            setTimeout(()=>{
              this.innerVisible = true;
              this.activeStatus = false;
            },1000)

          }else{//登录失败
            this.isBtnLoading = false;
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }).catch(util.catchError);
      },
      //关闭安全验证对话框
      handleClose(done) {
        this.$confirm('确认关闭？放弃修改？')
          .then(_ => {
            done();
            this.activeStatus = true;
          })
          .catch(_ => {});
      },
      //修改密码
      submit(form){
        this.isBtnLoading = true;
        let loginParams={
          sessionid: util.session('sessionid'),//用户唯一标示
          newpass:form.pass
        };
        instance.post(`/super/updatepass.do`, qs.stringify(loginParams)).then(res => {
          console.info('res:'+JSON.stringify(res))
          //登录超时
          if(res.data.status != 0 && res.data.msg=='管理员未登录，无法获取当前商户信息'){
            return this.$router.push({ path: '/login', query: { from: this.$router.currentRoute.path } });
          }

          let status = res.data.status;
          if(status === 0){//登陆成功
            this.isBtnLoading = false;
            this.innerVisible = false;
            this.$message.success('密码验证成功');
          }else{//登录失败
            this.isBtnLoading = false;
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }).catch(util.catchError);
      }
    },
    components: {
      safePassword,
      changePassword,
      VueCropper
    },
  }
</script>

<style scoped lang="scss">
  strong{
    font-size: 20px;
  }
  .baselist{
    margin:30px 30px;
    .el-form-item{
      display: flex;
      display: -webkit-flex;
      align-items: center;
      -webkit-align-items: center;
      .img{
        display: inline-block;
        width:80px;
        height:80px;
        border-radius:50%;
        background: #cccccc;
        box-shadow: 0px 4px 4px #2a303c;
        overflow: hidden;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .el-tag{
        margin-right: 10px;
      }
      .fa-pencil-square-o:hover{
        color: #2cca9a;
      }
    }
  }
  .cropper-content{
    display: flex;
    display: -webkit-flex;
    justify-content: flex-end;
    -webkit-justify-content: flex-end;
    .cropper{
      width: 350px;
      height: 300px;
    }
    .show-preview{
      flex: 1;
      -webkit-flex: 1;
      display: flex;
      display: -webkit-flex;
      justify-content: center;
      -webkit-justify-content: center;
      .preview{
        overflow: hidden;
        border-radius: 50%;
        border:1px solid #cccccc;
        background: #cccccc;
        margin-left: 40px;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .footer-btn{
    margin-top: 30px;
    display: flex;
    display: -webkit-flex;
    justify-content: flex-end;
    -webkit-justify-content: flex-end;
    .scope-btn{
      width: 350px;
      display: flex;
      display: -webkit-flex;
      justify-content: space-between;
      -webkit-justify-content: space-between;
    }
    .upload-btn{
      flex: 1;
      -webkit-flex: 1;
      display: flex;
      display: -webkit-flex;
      justify-content: center;
      -webkit-justify-content: center;
    }
    .btn {
      outline: none;
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      -webkit-appearance: none;
      text-align: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      outline: 0;
      margin: 0;
      -webkit-transition: .1s;
      transition: .1s;
      font-weight: 500;
      padding: 8px 15px;
      font-size: 12px;
      border-radius: 3px;
      color: #fff;
      background-color: #67c23a;
      border-color: #67c23a;
    }
  }

</style>
