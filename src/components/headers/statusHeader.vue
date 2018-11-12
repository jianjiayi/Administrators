<template>
  <section>
    <el-alert
      v-if="headerOptions.imgStatus == 1"
      title="等待审核"
      type="info"
      center
      :closable="false"
      show-icon>
    </el-alert>
    <el-alert
      v-else
      :title="headerOptions.status == 0 ? '已通过审核' : '未通过审核'"
      :type="headerOptions.status == 0 ? 'success' : 'error'"
      center
      :closable="false"
      show-icon>
      <span v-show="headerOptions.status != 0">&nbsp;&nbsp;&nbsp;原因:{{headerOptions.reason}}</span>
    </el-alert>
  </section>
</template>
<script>
  export default {
    props:['headerOptions']
  }
</script>
<style scoped lang="scss">
  .el-alert{
    margin-bottom: 30px;
  }
</style>
