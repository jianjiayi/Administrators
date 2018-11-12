<template>
  <section>
    <div class="order-header">
      <!--交易关闭-->
      <div v-if="orderData[0].status==60" class="order-close">
        <p class="status-txt">当前订单状态 : 交易关闭</p>
        <p class="status-reason">原因：超时关闭</p>
      </div>
      <!--退款-->
      <div v-else-if="orderData[0].status==70||orderData[0].status==80" class="steps order-return">
        <!--失败-->
        <div v-if="orderData[0].returns == 3" class="order-close">
          <p class="status-txt">当前订单状态 : 退款失败</p>
          <p class="status-reason">原因：商家拒绝退款</p>
        </div>
        <!--成功-->
        <el-steps v-else :active="2" align-center finish-status="success">
          <el-step title="退款申请" description=""></el-step>
          <el-step title="卖家同意" description=""></el-step>
          <el-step title="确认收货" description=""></el-step>
        </el-steps>
      </div>
      <!--正常-->
      <div v-else class="steps order-success">
        <el-steps :active="orderData[0].status | status" align-center finish-status="success">
          <el-step title="拍下商品" :description="orderData[0].createTime"></el-step>
          <el-step title="买家付款" :description="orderData[0].paymentTime"></el-step>
          <el-step title="卖家发货" :description="orderData[0].sendTime"></el-step>
          <el-step title="确认收货" :description="orderData[0].endTime"></el-step>
        </el-steps>
      </div>
    </div>
    <div class="main">
      <div class="orders">
        <el-alert
          title="订单信息"
          type="info"
          :closable="false">
        </el-alert>
        <el-form ref="form"  size="mini">
          <el-form-item label="订单编号">
            <span>{{orderData[0].orderNo}}</span>
          </el-form-item>
          <el-form-item label="收货人">
            <span>{{orderData[0].shippingVo.receiverName}}</span>
          </el-form-item>
          <el-form-item label="买家电话">
            <span>{{orderData[0].shippingVo.receiverMobile}}</span>
          </el-form-item>
          <el-form-item label="收货地址">
            <span>{{orderData[0].shippingVo.receiverProvince}} {{orderData[0].shippingVo.receiverCity}} {{orderData[0].shippingVoreceiverDistrict}} {{orderData[0].shippingVo.receiverAddress}}</span>
          </el-form-item>
        </el-form>
      </div>
      <div class="logistics">
        <logistics-details :logisticsInfo="logistics"></logistics-details>
      </div>
    </div>


    <!--订单-->
    <div class="order-list">
      <el-table
        :data="orderData"
        stripe
        border
        style="width: 100%;">
        <el-table-column
          label="宝贝"
          prop="id"
          header-align="center"
          width="500px">
          <template slot-scope="scope">
            <!--订单top-->
            <div class="">
              <span>订单号 : {{scope.row.orderNo}}</span>
              <span> 创建时间 : {{scope.row.createTime}}</span>
            </div>
            <!--详情-->
            <div>
              <!---->
              <el-row type="flex" class="row-bg">
                <el-col :span="6">
                  <span><i class="fa fa-user-circle-o" aria-hidden="true"></i></span>
                  <router-link  :to="{path:'/review',query: {id:scope.row.orderItemVoList[0].adminId}}" target="_blank">
                    {{scope.row.orderItemVoList[0].nickname}}
                  </router-link>
                </el-col>
                <el-col :span="8">
                  <el-button type="text" size="small" class="tel">
                    <i class="el-icon-phone"></i>:
                  </el-button>
                </el-col>
                <el-col :span="4">
                  <el-button type="text" size="small"  class="btn-text" @click.native="chat(scope.row.orderItemVoList[0].adminId)">
                    <i class="fa fa-commenting-o" aria-hidden="true"></i>
                  </el-button>
                </el-col>
                <el-col :span="4">
                <span class="mini-size">
                   单价
                </span>
                </el-col>
                <el-col :span="2">
                <span class="mini-size">
                   数量
                </span>
                </el-col>
              </el-row>
              <!---->
              <el-row type="flex" class="row-bg  product" v-for="(item,index) in scope.row.orderItemVoList" :key="index">
                <el-col :span="6">
                <span class="main-img">
                  <img v-show="item.productImage" :src="item.productImage" alt="暂无">
                </span>
                </el-col>
                <el-col :span="12">
                  <div>
                    <router-link  :to="{path:'/review',query: {id:item.productId}}" target="_blank">
                      {{item.productName}}
                    </router-link>
                  </div>
                </el-col>
                <el-col :span="4">
                <span class="mini-size">
                  ￥{{item.currentUnitPrice}}
                </span>
                </el-col>
                <el-col :span="2">
                <span class="mini-size">
                  × {{item.quantity}}
                </span>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="优惠活动"
          align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.postage == 0" class="mini-size">包邮</div>
            <div v-else>
              <div v-show="scope.row.conditionalmail != 0 && scope.row.conditionalmail != null" class="mini-size">
                <!--1-根据件数-->
                <span v-if="scope.row.conditionalmail === 1">
                满 {{scope.row.enoughnum}} 件包邮
              </span>
                <!--2-根据钱数 -->
                <span v-else-if="scope.row.conditionalmail === 2">
                满 {{scope.row.enoughmoney}} 元包邮
              </span>
                <!--3-件数和地域限制-->
                <span v-else-if="scope.row.conditionalmail === 3">
                满 {{scope.row.enoughnum}} 件包邮，除 {{scope.row.nocitymail}} 地区外
              </span>
                <!--4-钱数和地域限制 -->
                <span v-else>
                满 {{scope.row.enoughmoney}} 元包邮，除 {{scope.row.nocitymail}} 地区外
              </span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="实收款"
          align="center">
          <template slot-scope="scope">
            ￥{{scope.row.payment}}
            <div class="mini-size">(含运费￥{{scope.row.postage}})</div>
          </template>
        </el-table-column>
        <el-table-column
          label="结算方式"
          align="center">
          <template slot-scope="scope">
            <el-tag
              v-show="scope.row.status!=10"
              :type="scope.row.paymentType == 1 ? '' : 'warning'"
              close-transition
              size="mini">
              {{scope.row.paymentType | paymentTypeStatus}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="买家"
          align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" class="abtn">{{scope.row.receiverName}}</el-button>
          </template>
        </el-table-column>

        <el-table-column
          prop="status"
          label="交易状态"
          header-align="center"
          align="center">
          <template slot-scope="scope">
            <el-tag
              :type="operatingStatusType(scope.row.status)"
              close-transition
              size="mini">
              {{scope.row.status | operatingStatus}}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>
</template>
<script>
  import logisticsDetails from '@/components/details/logisticsDetails'
  export default {
    props:['orderData','logistics'],
    data(){
      return{
        activeItem:'',
      }
    },
    filters:{
      status(val){
        switch(val)
        {
          case 10:
            return 1;
            break;
          case 20:
            return 2;
            break;
          case 40:
            return 3;
            break;
          case 50:
            return 4;
            break;
        }
      },
      paymentTypeStatus(type){
        let status = {};
        type === 0 ? status = '货到付款' : status = '在线支付';
        return status;
      },
      typeStatus(type){
        let status = {};
        type === 0 ? status = '货到付款' : status = '在线支付';
        return status;
      },
      operatingStatus: function (value) {
        let state = '';
        switch(value){
          case 10 :
            return state = '待付款';
            break;
          case 20 :
            return state = '待发货';
            break;
          case 40 :
            return state = '待收货';
            break;
          case 50 :
            return state = '已完成';
            break;
          case 60 :
            return state = '交易关闭';
            break;
          case 70 :
            return state = '退款中';
            break;
          case 80 :
            return state = '退款完成';
            break;
        }
        return state;
      }
    },
    methods:{
      operatingStatusType(value){
        let state = '';
        switch(value){
          case 10 :
            return state = '';
            break;
          case 20 :
            return state = 'warning';
            break;
          case 40 :
            return state = 'info';
            break;
          case 50 :
            return state = 'success';
            break;
          case 60 :
            return state = 'danger';
            break;
          case 70 :
            return state = 'info';
            break;
          case 80 :
            return state = 'success';
            break;
        }
        return state;
      },
    },
    components:{
      logisticsDetails
    }
  }
</script>
<style scoped lang="scss">
  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
    margin-bottom: 0;
  }
  .order-header{
    margin:40px auto;
    .order-close{
      padding: 10px 20px;
      background: #fab6b6;
      border: 1px dashed #fab6b6;
      .status-txt{
        font-size: 16px;
      }
      .status-reason{
        font-size: 12px;
      }
    }
    .steps{
      padding: 10px 0;
    }
  }
  .main{
    display: flex;
    display:-webkit-flex;
    border:1px solid #cccccc;
    .orders{
      width: 30%;
      border-right:1px solid #cccccc;
      .el-form{
        margin: 10px 20px;
      }
    }
    .logistics{
      width: 70%;
      height: 200px;
      padding-top: 20px;
      overflow-y: auto;
    }
  }
  .order-list{
    margin-top: 40px;
  }
  a{
    font-size: 12px;
    line-height: 30px;
    color: #3a8ee6;
    text-decoration: underline;
  }
  a:hover{
    color: #2cca9a;
  }
  .abtn{
    color: #2a393c;
    text-decoration: underline;
  }
  .abtn:hover{
    color: #3a8ee6;
  }
  .mini-size{
    font-size: 10px;
  }
  .tel{
    color: #dd6161;
  }
  .btn-text{
    color: #dd6161;
  }
  .btn-text:hover{
    color: #3a8ee6;
  }
  .product{
    border-bottom: 1px dashed #b4bccc;
  }
  .product:last-child{
    border:none;
  }
  .main-img{
    max-width: 80px;
    max-height: 50px;
    background: #cccccc;
    display: block;
    overflow: hidden;
    margin: 3px 0;
    box-shadow: 0 0 3px #000;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .el-form-item__label{
    font-size: 10px;
  }
  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 0px;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
