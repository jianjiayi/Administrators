<template>
  <section v-loading="listLoading">
    <el-row type="flex" class="row-bg topLine" justify="space-between">
      <el-col :span="19">
        <template>
          <el-form :inline="true" class="demo-form-inline">
            <!--结算状态-->
            <el-form-item >
              <el-select size="mini" v-model="searchFrom.value1" placeholder="结算状态" @change="selectStatus()">
                <el-option size="mini" v-for="item in searchFrom.options1" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
            <!--商户类型-->
            <el-form-item >
              <el-select size="mini" v-model="searchFrom.value2" placeholder="商户类型">
                <el-option size="mini" v-for="item in searchFrom.options2" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
            <!--查询月份-->
            <el-form-item >
              <el-date-picker size="mini" v-model="searchFrom.value3"  :clearable="false" type="month" placeholder="选择月"  format="yyyy 年 MM 月" value-format="timestamp" :picker-options="pickerBeginDateAfter" @change="selectTime()"> </el-date-picker>
            </el-form-item>
            <!--商户名-->
            <el-form-item v-show="searchFrom.value2!=1">
              <el-input size="mini" v-model="searchFrom.keywords" placeholder="商户编号/商户名称"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button size="mini" type="success" plain icon="fa fa-search" @click="searchAdmin()">查询</el-button>
              <el-button size="mini" type="info" plain  @click="resetData()">重置</el-button>
            </el-form-item>
          </el-form>
        </template>

      </el-col>
      <el-col :span="5">
        <el-row type="flex" class="row-bg" justify="end">
          <template>
            <el-form :inline="true" class="demo-form-inline">
              <!--全部结算-->
              <el-form-item>
                <el-button
                  v-show="searchFrom.value1 != 1 "
                  size="mini"
                  :type="getSafeState == 'true' ? 'danger' :'info'"
                  @click="getSafeState == 'true' ? settlementBtn() : LoginPasswordDialogVisible = true">
                  结算
                </el-button>
              </el-form-item>
              <!--全部导出-->
              <el-form-item>
                <el-button size="mini" type="success"  @click="exportExcel()">导出</el-button>
              </el-form-item>
            </el-form>
          </template>
        </el-row>
      </el-col>
    </el-row>

    <!--未设置安全支付-->
    <el-dialog
      title="安全验证"
      :visible.sync="LoginPasswordDialogVisible"
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
      <safe-password :status="activeStatus" :btnLoading="isBtnLoading" @passwordSubmit="safeLoginPassword"></safe-password>

      <!--支付密码-->
      <el-dialog
        width="300px"
        title="设置安全支付密码"
        center
        :visible.sync="setPasswordVisible"
        append-to-body>
        <el-alert
          title="设置6位支付密码"
          type="info">
        </el-alert>
        <set-password :btnLoading="isBtnLoading" @submitBtn="submit"></set-password>
      </el-dialog>
    </el-dialog>

    <!--已设置安全支付-->
    <el-dialog
      title="订单结算"
      :visible.sync="playPasswordDialogVisible"
      width="800px"
      center>
      <el-form :inline="true">
        <!--商户类型-->
        <!--结算状态-->
        <el-form-item >
          <el-select size="mini" v-model="SettlementForm.value1" placeholder="结算状态" @change="selectStatus()">
            <el-option size="mini" v-for="item in SettlementForm.options1" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"> </el-option>
          </el-select>
        </el-form-item>
        <!--商户类型-->
        <el-form-item >
          <el-select size="mini" v-model="SettlementForm.value2" placeholder="商户类型">
            <el-option size="mini" v-for="item in SettlementForm.options2" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <!--查询月份-->
        <el-form-item >
          <el-date-picker size="mini" v-model="SettlementForm.value3"  :clearable="false" type="month" placeholder="选择月"  format="yyyy 年 MM 月" value-format="timestamp" :picker-options="pickerBeginDateAfter" @change="selectTime()"> </el-date-picker>
        </el-form-item>
        <!--商户名-->
        <el-form-item v-show="SettlementForm.value2!=1">
          <el-input size="mini" v-model="SettlementForm.keywords" placeholder="商户编号/商户名称"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button size="mini" type="primary" plain  @click="oneKeyPay()">一键结算</el-button>
        </el-form-item>
      </el-form>
      <el-alert
        title="结算说明"
        type="warning"
        :closable="false"
        description="结算所选商家类型与所选月份所有商家，在这一个月内的所有订单">
      </el-alert>
      <!--支付密码-->
      <el-dialog
        title="支付密码"
        :visible.sync="playVisible"
        width="300px"
        center
        append-to-body
        :before-close="handleClose">
        <el-alert
          title="提示"
          type="warning"
          :closable="false"
          description="请输入支付密码，验证成功即可修改">
        </el-alert>
        <!--安全验证-->
        <safe-password :status="activeStatus" :btnLoading="isBtnLoading" @passwordSubmit="safePlayPassword"></safe-password>
      </el-dialog>
    </el-dialog>

    <!--导出excel-->
    <el-dialog
      title="导出Excel"
      :visible.sync="excelDialogVisible"
      width="800px"
      center>
      <el-form :inline="true">
        <!--商户类型-->
        <!--结算状态-->
        <el-form-item >
          <el-select size="mini" v-model="ExcelForm.value1" placeholder="结算状态" @change="selectStatus()">
            <el-option size="mini" v-for="item in ExcelForm.options1" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <!--商户类型-->
        <el-form-item >
          <el-select size="mini" v-model="ExcelForm.value2" placeholder="商户类型">
            <el-option size="mini" v-for="item in ExcelForm.options2" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <!--查询月份-->
        <el-form-item >
          <el-date-picker size="mini" v-model="ExcelForm.value3"  :clearable="false" type="month" placeholder="选择月"  format="yyyy 年 MM 月" value-format="timestamp" :picker-options="pickerBeginDateAfter" @change="selectTime()"> </el-date-picker>
        </el-form-item>
        <!--商户名-->
        <el-form-item v-show="ExcelForm.value2!=1">
          <el-input size="mini" v-model="ExcelForm.keywords" placeholder="商户编号/商户名称"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button size="mini" type="primary" plain  @click="exportExcelTop(searchFrom)">确定导出表格</el-button>
        </el-form-item>
      </el-form>
      <el-alert
        title="导表说明"
        type="warning"
        :closable="false"
        description="导出所选商家类型与所选月份所有商家，在这一个月内的数据">
      </el-alert>
    </el-dialog>

    <!--列表-->
    <el-table
      :data="listTableData"
      stripe
      style="width: 100%">
      <el-table-column
        label="商铺编号">
        <template slot-scope="scope">
          <el-popover
            ref="popover"
            placement="right"
            width="300"
            trigger="hover">
            <div class="popover-txt">
              <span>商铺编号 :</span>
              <span>{{scope.row.admnum}}</span>
            </div>
            <div class="popover-txt">
              <span>商铺 ID :</span>
              <span>{{scope.row.adminid}}</span>
            </div>
            <div class="popover-txt">
              <span>
                商铺名称：
              </span>
              <span>
               {{scope.row.nickname}}
              </span>
            </div>
            <div class="popover-txt">
              <span>联系电话：</span>
              <span>{{scope.row.phone}}</span>
            </div>
            <div class="popover-txt">
              <span>详细地址：</span>
              <span>{{scope.row.address}}</span>
            </div>
          </el-popover>
          <el-button type="text" size="small" class="abtn" v-popover:popover >{{scope.row.admnum}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="时间"
        align="center">
        <template slot-scope="scope">
          {{scope.row.nowmonth}}
        </template>
      </el-table-column>
      <el-table-column
        label="商户类型"
        align="center">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.admrole == 2 ? '' : 'warning'"
            close-transition
            size="mini">
            {{scope.row.admrole | typeStatus}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="订单数"
        align="center">
        <template slot-scope="scope">
          {{scope.row.orderCount}}
        </template>
      </el-table-column>
      <el-table-column
        label="账户余额"
        align="center">
        <template slot-scope="scope">
          ￥{{scope.row.balance}}
        </template>
      </el-table-column>
      <el-table-column
        label="平台补贴"
        color="red"
        align="center">
        <template slot-scope="scope">
          ￥{{scope.row.subsidy}}
        </template>
      </el-table-column>

      <el-table-column
        label="扣点金额"
        align="center">
        <template slot-scope="scope">
          ￥{{scope.row.discount}}
        </template>
      </el-table-column>
      <el-table-column
        label="结算金额"
        align="center">
        <template slot-scope="scope">
          ￥{{scope.row.finmoney}}
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center">
        <template slot-scope="scope">
          <span>
             <el-tag
               :type="scope.row.setstutus == 1 ? 'success' : 'danger'"
               close-transition
               size="mini">
              {{scope.row.setstutus | reviewStatus}}
            </el-tag>
          </span>
        </template>
      </el-table-column>
      <!--<el-table-column-->
        <!--fixed="right"-->
        <!--label="操作"-->
        <!--align="center"-->
        <!--width="80">-->
        <!--<template slot-scope="scope">-->
          <!--<el-dropdown>-->
            <!--<el-button type="text" size="small">-->
              <!--<i class="el-icon-edit-outline"></i>-->
            <!--</el-button>-->
            <!--<el-dropdown-menu slot="dropdown">-->
              <!--<el-dropdown-item>-->
                <!--<el-button-->
                  <!--size="mini"-->
                  <!--plain-->
                  <!--:type="getSafeState == 'true' ? 'danger' :'info'"-->
                  <!--@click="getSafeState == 'true' ? playPasswordDialogVisible = true : LoginPasswordDialogVisible = true">-->
                  <!--结算-->
                <!--</el-button>-->
              <!--</el-dropdown-item>-->
              <!--<el-dropdown-item>-->
                <!--<el-button-->
                  <!--size="mini"-->
                  <!--plain-->
                  <!--type="success"-->
                  <!--@click.native="exportExcel(scope.$index, scope.row)">-->
                  <!--导出-->
                <!--</el-button>-->
              <!--</el-dropdown-item>-->
            <!--</el-dropdown-menu>-->
          <!--</el-dropdown>-->
        <!--</template>-->
      <!--</el-table-column>-->
    </el-table>

    <!--分页-->
    <pagination :numbers="pageNums" :currentPage="currentPages" @currentChange="changePaging"></pagination>
  </section>
</template>
<script>
  import instance from '@/api';
  const qs = require('qs');
  import * as util from '@/assets/js/util.js';

  import pagination from '@/components/paging'
  import safePassword from '@/components/forms/safePassword'
  import setPassword from '@/components/forms/setPassword'

  import {mapGetters,mapMutations} from 'vuex';
  export default {
    data() {
      return {
        listLoading:false,
        isBtnLoading: false,
        activeStatus:false,

        playPasswordDialogVisible:false,
        playVisible:false,
        searchFrom:{
          options1: [{
            value: '0',
            label: '未结算'
          }, {
            value: '1',
            label: '已结算',
            disabled: false,
          }],
          value1: '0',//默认未结算

          options2: [{
            value: '1',
            label: '所有'
          },{
            value: '2',
            label: '普通'
          }, {
            value: '3',
            label: '企业'
          }],
          value2: '1',

          value3: Date.now(),//当前日期

          keywords:''
        },
        //设置结束日期
        pickerBeginDateAfter:{
          disabledDate: (time) => {
            return time.getTime() > Date.now();
          }
        },
        //结算
        LoginPasswordDialogVisible:false,
        setPasswordVisible:false,
        SettlementForm:{},
        //导表
        excelDialogVisible:false,
        ExcelForm:{},


        listTableData: [],
        pageNums:'',
        currentPages : 1,


      }
    },
    created(){
      this.addData(1,this.searchFrom);
    },
    filters:{
      typeStatus(type){
        let status = '';
        type === 2 ? status = '普通' : status = '企业';
        return status;
      },
      reviewStatus(val){
        let status = '';
        val === 1 ? status = '已结算' : status = '未结算';
        return status;
      },
    },
    computed:{
      ...mapGetters(['getSafeState']),
    },
    methods:{
      ...mapMutations(['setSafeState']),
      selectStatus(){
        console.log(this.searchFrom.value1)
      },
      selectTime(){
        console.log(this.searchFrom.value3)
      },
      //加载数据
      addData(n,searchFrom){
        this.listLoading = true;
        let params = {
          pageNum : n,//当前访问页数
          setstatus:searchFrom.value1,
          admstatus:searchFrom.value2,
          datetime:searchFrom.value3,
          admnum:searchFrom.keywords,
          sessionid : util.session('sessionid'),//用户唯一标示
        };
        instance.post('/finorder/selectfinorder.do',qs.stringify(params)).then(res => {
          console.info('res:'+JSON.stringify(res));
          //登录超时
          if(res.data.status != 0 && res.data.msg=='管理员未登录，无法获取当前商户信息'){
            return this.$router.push({ path: '/login', query: { from: this.$router.currentRoute.path } });
          }

          if(res.data.status==1 && res.data.msg=='没有相关订单信息'){
            this.listLoading = false;
            this.listTableData = [];
            this.pageNums = '';
            this.listTableData = '';
            return
          };

          this.listLoading = false;
          let json = res.data.data
          this.pageNums = json.pages;
          this.listTableData = json.list;
        }).catch(util.catchError);
      },
      //多条件搜索
      searchAdmin(){
        this.addData(1,this.searchFrom)
      },
      //重置所有条件
      resetData(){
        this.searchFrom.value1='0';//默认未结算
        this.searchFrom.value2='1';
        this.searchFrom.value3=Date.now();//当前日期
        this.searchFrom.keywords='';
        this.addData(1,this.searchFrom);
      },
      //导出excel
      exportExcel(){
        this.excelDialogVisible = true;
        this.ExcelForm = Object.assign({}, this.searchFrom);
      },
      exportExcelTop(searchFrom){
        let params = {
          pageNum : 1,//当前访问页数
          setstatus:searchFrom.value1,
          admstatus:searchFrom.value2,
          datetime:searchFrom.value3,
          admnum:searchFrom.keywords,
          sessionid : util.session('sessionid'),//用户唯一标示
        };
        instance.post('/finorder/ExportExcel.do',qs.stringify(params)).then(res => {
          console.info('res:'+JSON.stringify(res));
          //登录超时
          if(res.data.status != 0 && res.data.msg=='管理员未登录，无法获取当前商户信息'){
            return this.$router.push({ path: '/login', query: { from: this.$router.currentRoute.path } });
          }

          if(res.data.status==1 && res.data.msg=='数据为null，不可以导出'){
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
            return
          };
          this.funDownload(res.data.data,res.data.msg);

          this.excelDialogVisible = false;

        }).catch(util.catchError);
      },
      //下载Excel
      funDownload(href,title) {
        console.log('title:'+title)
        var a = document.createElement('a');
        a.download = title;
        a.href = href;
        a.click();
      },

      //登录安全验证
      safeLoginPassword(passWord){
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
            this.LoginPasswordDialogVisible = false;
            setTimeout(()=>{
              this.setPasswordVisible = true;
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
      //设置安全密码密码
      submit(form){
        this.isBtnLoading = true;
        let loginParams={
          sessionid: util.session('sessionid'),//用户唯一标示
          paypass:form.pass
        };
        instance.post(`/super/setpaypass.do`, qs.stringify(loginParams)).then(res => {
          console.info('res:'+JSON.stringify(res))
          //登录超时
          if(res.data.status != 0 && res.data.msg=='管理员未登录，无法获取当前商户信息'){
            return this.$router.push({ path: '/login', query: { from: this.$router.currentRoute.path } });
          }

          let status = res.data.status;
          if(status === 0){//登陆成功
            this.isBtnLoading = false;
            this.setPasswordVisible = false;
            this.$message.success('支付密码设置成功');
            this.setSafeState('true');
          }else{//登录失败
            this.isBtnLoading = false;
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }).catch(util.catchError);
      },
      //结算按钮
      settlementBtn(){
        this.playPasswordDialogVisible = true;
        this.SettlementForm =  Object.assign({}, this.searchFrom);
        this.SettlementForm.options1[1].disabled = true;
      },
      //点击一键结算按钮
      oneKeyPay(){
        this.playVisible = true;
        this.activeStatus = false;
      },
      //校验安全密码验证
      safePlayPassword(passWord){
        this.isBtnLoading = true;
        this.activeStatus = true;
        console.log(passWord)
        let loginParams={
          sessionid: util.session('sessionid'),//用户唯一标示
          paypass: passWord
        };
        instance.post(`/super/checkpaypass.do`, qs.stringify(loginParams)).then(res => {
          console.info('res:'+JSON.stringify(res))
          //登录超时
          if(res.data.status != 0 && res.data.msg=='管理员未登录，无法获取当前商户信息'){
            return this.$router.push({ path: '/login', query: { from: this.$router.currentRoute.path } });
          }

          let status = res.data.status;
          if(status === 0){//登陆成功
            this.$message.success('验证成功');
            this.isBtnLoading = false;
            setTimeout(()=>{
              this.playPasswordDialogVisible = false;
              this.playVisible = false;
              this.nowSettlement(this.SettlementForm);
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
      //调用结算接口
      nowSettlement(searchFrom){
        let params = {
          pageNum : 1,//当前访问页数
          setstatus:searchFrom.value1,
          admstatus:searchFrom.value2,
          datetime:searchFrom.value3,
          admnum:searchFrom.keywords,
          sessionid : util.session('sessionid'),//用户唯一标示
        };
        instance.post('/finorder/finorder.do',qs.stringify(params)).then(res => {
          console.info('res:'+JSON.stringify(res));
          //登录超时
          if(res.data.status != 0 && res.data.msg=='管理员未登录，无法获取当前商户信息'){
            return this.$router.push({ path: '/login', query: { from: this.$router.currentRoute.path } });
          }

          if(res.data.status==1 && res.data.msg=='数据为null，不可以导出'){
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
            return
          };
          this.$alert('结算成功', '结算状态', {
            confirmButtonText: '确定',
            callback: action => {
              this.$message({});
            }
          });

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
      //分页
      changePaging(val){
        this.currentPages = val;
        this.addData(val,this.searchFrom);
      },

    },
    components:{
      safePassword,pagination,setPassword
    }
  }
</script>
<style scoped lang="scss">
  .popover-txt{
    font-size: 10px;
    line-height: 20px;
  }
  .abtn{
    color: #606266;
    font-size: 14px;
    text-decoration: underline;
  }
  .abtn:hover{
    color: #dd6161;
  }
</style>
