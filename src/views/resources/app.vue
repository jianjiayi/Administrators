<template>
  <section v-loading="listLoading">
    <!--标签页-->
    <tab-pane :tabs="tabsOptions" :activeLabel="tabActiveIndex" @changeTabs="changeTableData"></tab-pane>

    <el-row type="flex" class="row-bg" justify="space-between">
      <div width="440px">
        <el-form :rules="rules" :model="fileForm" ref="fileForm" label-width="80px" size="mini" @keyup.enter.native="submitForm('fileForm')">
          <el-form-item label="版本号" prop="version">
            <el-input v-model="fileForm.version" placeholder="列如：1.0.1"></el-input>
          </el-form-item>
          <el-form-item label="更新说明" prop="note">
            <el-input type="textarea" v-model="fileForm.note" placeholder="列如：修复BUG,提升用户体验"></el-input>
          </el-form-item>
          <el-form-item label="文件" prop="remark">
            <upload-file :uploadOption="options4" @success="picSuccess" @delete="picRemove"></upload-file>
            <el-input type="hidden" v-model="fileForm.remark"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('fileForm')" :loading="isBtnLoading">{{btnText}}</el-button>
            <el-button @click="resetForm('fileForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-col :span="12">
        <div class="header-list">
          历史记录
        </div>

        <el-collapse accordion>
          <el-collapse-item v-for="(item,index) in listData" :key="index">
            <template slot="title">
              版本号：{{item.version}} 时间：{{item.createTime}}
            </template>
            <div>更新内容：{{item.note}}</div>
            <div>文件地址：
              <el-button type="text" size="small"  class="btn-text">
                {{item.url}}
              </el-button>
            </div>
          </el-collapse-item>

        </el-collapse>

        <!--分页-->
        <pagination :numbers="pageNums" :currentPage="currentPages" @currentChange="changePaging"></pagination>
      </el-col>
    </el-row>



  </section>
</template>
<script>
  import instance from '@/api';
  const qs = require('qs');
  import * as util from '@/assets/js/util.js';

  import tabPane from '@/components/tabpane'
  import pagination from '@/components/paging'
  import uploadFile from '@/components/upload/uploadFile'
  export default {
    data() {
      var validVersion = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入版本号'));
        } else if (value.split('.').length!=3) {
          callback(new Error('版本号格式不对'));
        } else {
          callback();
        }
      };
      return {
        listLoading:false,
        isBtnLoading: false,

        tabsOptions:[
          {
            value:1,
            label:'用户端'
          },
          {
            value:2,
            label:'商户端'
          },
        ],
        tabActiveIndex:'用户端',

        tabsStatus:1,
        listData: [],
        pageNums:'',//总页数
        nowPages:'',//当前页
        currentPages : 1,

        fileForm: {
          sessionid : util.session('sessionid'),//用户唯一标示
          version: '',
          note: '',
          remark: '',
        },
        rules: {
          version: [
            { validator: validVersion, trigger: 'blur' }
          ],
          note: [
            { required: true, message: '请输入更新说明', trigger: 'change' }
          ],
          remark: [
            { required: true, message: '请选择文件', trigger: 'blur' }
          ]
        },


        ajaxUrl:'/usrapp/',//默认上传接口为用户端
        options4:{
          url:'http://192.168.1.200:8082/NewDwShop/appfile/appupload.do',
          name:'userfile',
          limit:1,
          id:'userfile',
          size:'20M',
          resolution:'',
          source:''
        },
      }
    },
    created(){
      this.addData(1,this.tabsStatus);
    },
    computed: {
      btnText() {
        if (this.btnLoading) return '正在提交...';
        return '提交';
      }
    },
    methods:{
      //加载数据
      addData(n,status){
        this.listLoading = true;
        let params = {
          pageNum : n,//当前访问页数
          sessionid : util.session('sessionid'),//用户唯一标示
        }
        instance.post(this.ajaxUrl+'sellectAllMes.do',qs.stringify(params)).then(res => {
          console.info('res:'+JSON.stringify(res));
          //登录超时
          if(res.data.status != 0 && res.data.msg=='管理员未登录，无法获取当前商户信息'){
            return this.$router.push({ path: '/login', query: { from: this.$router.currentRoute.path } });
          }

          if(res.data.status==1 && res.data.msg=='没有相关订单'){
            this.listLoading = false;
            this.pageNums = '';
            this.listData = [];
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
        this.addData(val,this.tabsStatus)
      },
      //分类
      changeTableData(label){
        console.log(label);
        this.currentPages = 1;
        let tab = this.tabsOptions.find(n => n.label === label);
        this.tabsStatus = tab.value;
        switch(tab.value){
          case 1:
            this.ajaxUrl = '/usrapp/';
            this.options4.name = 'userfile';
            break;
          case 2:
            this.ajaxUrl = '/admapp/';
            this.options4.name = 'adminfile';
            break;
        };

        this.addData(1,this.tabsStatus);
      },

      //上传主图成功回调
      picSuccess(response){
        console.log(response);
        this.options4.source = response.value;
        this.fileForm.remark = response.value
      },
      picRemove(response){
        console.log(response);
        this.options4.source = '';
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.isBtnLoading = true;
            let params = this.fileForm;
            instance.post(this.ajaxUrl+'addMes.do',qs.stringify(params)).then(res => {
              console.info('res:'+JSON.stringify(res));
              //登录超时
              if(res.data.status != 0 && res.data.msg=='管理员未登录，无法获取当前商户信息'){
                return this.$router.push({ path: '/login', query: { from: this.$router.currentRoute.path } });
              }

              this.isBtnLoading = false;

              this.addData(1,this.tabsStatus)

            }).catch(util.catchError);
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    components:{
      tabPane,
      uploadFile,
      pagination
    }
  }
</script>
<style scoped lang="scss">
  .header-list{
    line-height: 30px;
    margin-bottom: 10px;
    font-size: 16px;
  }
</style>
