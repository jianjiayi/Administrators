<template>
  <section>
    <el-form :model="reviewForm" :rules="reviewRules" ref="reviewForm" label-width="120px" class="table-form">
      <el-form-item label="是否审核通过" prop="states">
        <el-radio-group v-model="reviewForm.states">
          <el-radio label="0">通过</el-radio>
          <el-radio label="1">未通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="reviewForm.states == 1" label="未通过原因" prop="reason">
        <el-input type="textarea" v-model="reviewForm.reason"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('reviewForm')" :loading="btnLoading">{{btnText}}</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>
<script>
  export default {
    props:['btnLoading'],
    data(){
      return{
        reviewForm: {
          states: '',
          reason: ''
        },
        reviewRules:{
          states: [
            { required: true, message: '请选择是否通过审核', trigger: 'change' }
          ],
          reason: [
            { required: true, message: '请填写未通过审核原因', trigger: 'blur' }
          ]
        },
      }
    },
    computed: {
      btnText() {
        if (this.btnLoading) return '正在提交...';
        return '提交';
      }
    },
    methods:{
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
//            this.btnLoading = true;
            this.$emit('submitReview',this.reviewForm)
          } else {
            this.$message({
              type: 'warning',
              message: '请填写审核表单'
            });
            return false;
          }
        });
      },
    },
  }
</script>
<style scoped lang="scss">
  .table-form{
    margin-top: 50px;
    padding: 40px 20px;
    border: 1px solid #3a8ee6;
  }
</style>
