<template>
  <section>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="numbers == 0 ? 1 : numbers*10"
      :current-page="currentPage"
      @current-change="handleCurrentChange">
    </el-pagination>
  </section>
</template>
<script>
  export default {
    props:['numbers','currentPage'],
    data(){
      return{

      }
    },
    methods:{
      handleCurrentChange(val){
        this.$emit('currentChange',val);
        console.log(`当前页: ${val}`);
      }
    }
  }
</script>
<style scoped lang="scss">

</style>
