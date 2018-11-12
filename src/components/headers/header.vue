<template>
  <el-header>
    <div class="logo">
      <img src="@/assets/images/002.png" alt="">
    </div>
  </el-header>
</template>

<script>
    //import someComponent from './someComponent'
    export default {
        name: "",
        data() {
            return {
                msg: "Hello Vue.js"
            }
        },
        filters: {
            //filters
        },
        created() {
            //load
        },
        watch: {
            //watch
        },
        computed: {
            //computed
        },
        methods: {
            //mehods
        },
        components: {
            //someComponent
        },
    }
</script>

<style scoped lang="scss">
  .el-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100px;
    z-index: 999999;
    background-color: #00b78c;
    display: flex;
    align-items: center;
    .logo{
      width: 100px;
      height: 60px;
    }
  }
</style>
