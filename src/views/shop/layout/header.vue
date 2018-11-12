<template>
  <section>
    <el-header>
      {{title}}
    </el-header>
  </section>
</template>
<script>
export default {
  props:['title'],
  data(){
    return{

    }
  }
}
</script>
<style scoped lang="scss">
  .el-header{
    position: fixed;
    left:0;
    top:0;
    width: 100%;
    background: #81d8d0;
    line-height: 60px;
    text-align: center;
    z-index: 99;
    color: #ffffff;
    box-shadow: 0 2px 3px #ccc;
  }
</style>
