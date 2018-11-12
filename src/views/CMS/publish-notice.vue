<template>
  <div class="publish">
    <el-form ref="ruleValidate" :rules="ruleValidate" :model="form" label-width="80px">
      <el-form-item class="item-container" label="标题" prop="texttitle">
        <el-input v-model="form.texttitle" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item class="item-container" label="副标题"  prop="texttitlename">
        <el-input type="textarea" v-model="form.texttitlename"  placeholder="请输入副标题"></el-input>
      </el-form-item>
      <el-form-item label="发布时间" prop="senTime">
        <el-date-picker
        v-model="form.senTime"
        type="datetime"
        placeholder="选择日期"
        :default-value="timeDefaultShow"
        value-format="timestamp"
        :picker-options="pickerOptions"
        :default-time="['12:00:00']">
      </el-date-picker>
      </el-form-item>
      <el-form-item label="指定商家">
        <el-radio-group v-model="form.textrole">
          <el-radio :label="1">全部</el-radio>
          <el-radio :label="2">企业</el-radio>
          <el-radio :label="3">个人</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="文章详情">
        <div class="editor-container">
          <UE :defaultMsg=defaultMsg :config=config ref="ue"></UE>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('ruleValidate')">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>
<script>
  import instance from '@/api';
  const qs = require('qs');
  import * as util from '@/assets/js/util.js';


  import UE from '@/components/UE/Ueditor.vue';

  export default {
    components: { UE },
    data() {
      return {
        pickerOptions: {
          disabledDate(time) {
            let timeSpace = time.getTime() < Date.now() - 8.64e7;
            return timeSpace;
          }
        },
        form: {
          texttitle:'',//文章标题
          texttitlename:'',//副标题
          text:'',//内容
          textrole:1,//权限值
          status:'1',//状态值
          senTime:'',//发布事件
        },
        ruleValidate: {
          texttitle: [
            {required: true, message: '请输入标题', trigger: 'blur'}
          ],
          texttitlename: [
            {required: true, message: '请输入副标题', trigger: 'blur'}
          ],
          senTime: [
            {required: true, message: '请选择发布时间', trigger: 'change'}
          ],
        },

        defaultMsg: '',
        config: {
//          //可以在此处定义工具栏的内容
          toolbars: [
            [
              'undo', //撤销
              'bold', //加粗
              'indent', //首行缩进
              'italic', //斜体
              'underline', //下划线
              'pasteplain', //纯文本粘贴模式
              'selectall', //全选
              'cleardoc', //清空文档
              'insertparagraphbeforetable', //"表格前插入行"
              'fontfamily', //字体
              'fontsize', //字号
              'paragraph', //段落格式
              'simpleupload', //单图上传
              'insertimage', //多图上传
              'link', //超链接
              'emotion', //表情
              'spechars', //特殊字符
              'map', //Baidu地图
              'justifyleft', //居左对齐
              'justifyright', //居右对齐
              'justifycenter', //居中对齐
              'justifyjustify', //两端对齐
              'forecolor', //字体颜色
              'attachment', //附件
              'imagecenter', //居中
              'lineheight', //行间距
              'edittip ', //编辑提示
              'autotypeset', //自动排版
              'touppercase', //字母大写
              'tolowercase', //字母小写
              'background', //背景
              'inserttable', //插入表格
            ]
          ],
          autoHeightEnabled: false,
          autoFloatEnabled: true,　　//是否工具栏可浮动
//          initialContent:'请输入内容',   //初始化编辑器的内容,也可以通过textarea/script给值，看官网例子
          autoClearinitialContent:true, //是否自动清除编辑器初始内容，注意：如果focus属性设置为true,这个也为真，那么编辑器一上来就会触发导致初始化的内容看不到了
          initialFrameWidth: null,
          initialFrameHeight: 450,
          BaseUrl: '',
          UEDITOR_HOME_URL: 'static/ueditor/'
        },
      }
    },
    computed:{
      timeDefaultShow:function(val){
        var date = new Date(),
          Y = date.getFullYear(),
          m = date.getMonth() + 1,
          d = date.getDate();
        if (m < 10) {
          m = '0' + m;
        }
        if (d < 10) {
          d = '0' + d;
        }
        var t = Y+'-'+m+'-'+d+' '+'23:59:59';
        return t;
      }
    },
    methods: {
      onSubmit(name) {
        console.log('submit!');
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.form['text'] = this.getUEContent();
            this.form['sessionid'] = util.session('sessionid');//用户唯一标示
            let params = this.form;
            console.log(params);
            instance.post('/articlemanage/sendtext.do?', qs.stringify(params)).then(res => {
              console.info('res:' + JSON.stringify(res));
              //登录超时
              if (res.data.status != 0 && res.data.msg == '管理员未登录，无法获取当前商户信息') {
                return this.$router.push({path: '/login', query: {from: this.$router.currentRoute.path}});
              }

              if (res.data.status == 1 && res.data.msg == '文章发布失败') {
                this.$message({
                  message: '文章发布失败',
                  type: 'warning'
                });
                return;
              }
              ;

              this.listLoading = false;

              this.$message({
                message: '文章发布成功',
                type: 'success'
              });

              this.$router.push({path: '/CMS/noticeList', query: {}});

            }).catch(util.catchError);
          }else{

          }
        });
      },
      getUEContent() {
        let content = this.$refs.ue.getUEContent();
        return content;
      }
    }
  };
</script>


<style scoped lang="scss">
  .publish{
    margin-top: 20px;
  }
  .item-container{
    max-width: 600px;
  }
  .info{
    border-radius: 10px;
    line-height: 20px;
    padding: 10px;
    margin: 10px;
    background-color: #ffffff;
  }
</style>
