<template>
  <div class="pwdpush-box">
    <el-form  @keyup.enter.native="submit">
      <ul class="write-input clearfix">
        <input type="text"  ref="input" maxlength="6" class="realInput" v-model="realInput" :autofocus="true" @keyup="getNum()"  @keydown="delNum()">
        <li v-for="disInput in disInputs" :class="disInput.status==true ? 'active' : ''">
          <input type="password" maxlength="1" disabled  v-model="disInput.value">
        </li>
      </ul>
      <div class="footer-btn">
        <el-button size="small" type="primary" @click="submit" :loading="btnLoading">{{btnText}}</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    props:['status','btnLoading'],
    data(){
      return{
        disInputs:[
          {
            status:false,
            value:''
          },
          {
            status:false,
            value:''
          },
          {
            status:false,
            value:''
          },
          {
            status:false,
            value:''
          },
          {
            status:false,
            value:''
          },
          {
            status:false,
            value:''
          }
        ],
        realInput:'',
      }
    },
    watch:{
      status(val,oldval){
        console.log(val,oldval);
        this.btnLoading == false ? this.clearNum() : '';
      }
    },
    computed: {
      btnText() {
        if (this.btnLoading) return '正在提交...';
        return '提交';
      }
    },
    methods:{
      getNum(){
        this.realInput=this.realInput.replace(/^ +| +$/g,'')
        for(var i=0;i<this.realInput.length;i++){
          this.disInputs[i].value=this.realInput.charAt(i)
          this.disInputs[i].status = true;
          // 表示字符串中某个位置的数字，即字符在字符串中的下标。
        }
      },
      delNum(){
        var oEvent = window.event;
        if (oEvent.keyCode == 8) {
          if(this.realInput.length>0){
            this.disInputs[this.realInput.length-1].value='';
            this.disInputs[this.realInput.length-1].status = false;
          }
        }
      },
      clearNum(){
        this.disInputs.map(n => {
          n.status=false;
          n.value = '';
        });
        this.realInput = '';
      },
      submit(){
        console.log(this.realInput);
        if(this.realInput.length==6){
          this.$emit('passwordSubmit',this.realInput)
        }else{
          this.$message.error('请输入6位安全密码');
          this.$refs.input.focus()
        }
      },
      enterPwd(){
        this.$refs.input.focus()
      }
    }
  }
</script>
<style lang="scss" sconed>
  .write-input {
    list-style: none;
    margin: 0;
    padding: 0;
    margin: 10px auto;
    position: relative;
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    -webkit-justify-content: space-between;
    li{

      border:1px solid #888888;
      input{
        -webkit-appearance: none;
        -moz-appearance: none;
        -ms-appearance: none;
        resize: none;
        outline: none;
        border:0;
        width:30px;
        line-height: 30px;
        text-align: center;
        height: 30px;
        font-size:16px;
      }
    }
    li.active{
      border:1px solid #409EFF;
      box-shadow: 0 0 5px #409EFF;
    }
  }
  .footer-btn{
    text-align: center;
    margin-top: 20px;
    button{
      width: 80%;
    }
  }
  .realInput{
    /* Keyword values */
    -webkit-appearance: none;
    -moz-appearance: none;
    -ms-appearance: none;
    resize: none;
    outline: none;
    border: 0;
    z-index: 3;
    position: absolute;
    width: 100%;
    height: 30px;
    line-height: 30px;
    background: none;
    display: block;
    opacity: 0;
    font-size: 0px;
    caret-color: #fff;
    color: #000;
    font-size: 30px;
    border:1px solid red;
  }
  input[type="password"]:disabled{
    background-color: #fff;
  }
</style>
