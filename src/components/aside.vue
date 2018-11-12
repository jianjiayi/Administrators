<template>
  <el-aside width="201px">

    <el-menu  :default-active="activeMenu" unique-opened menu-trigger router>
      <template v-for="(route,index) in Routers">
        <template v-if="route.children">
          <el-submenu :key="index" :index="route.name">
            <template slot="title">
              <i :class="route.meta.icon" aria-hidden="true"></i><span class="itemText"> {{route.meta.name || route.name}}</span>
             </template>
            <el-menu-item v-for="(cRoute, cIndex) in route.children" :key="cIndex" :index="cRoute.name" :route="cRoute">
              <i class="fa fa-hand-o-right" aria-hidden="true"></i>
              <span class="childText">{{cRoute.meta.name || cRoute.name}}</span>
            </el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :route="route" :index="route.name">{{route.meta.name || route.name}}</el-menu-item>
        </template>
      </template>
    </el-menu>
  </el-aside>
</template>
<script>
  export default {
    props:['Routers'],
    data(){
      return{
        activeIndex: '0'
      }
    },
    methods: {

    },
    computed: {
      activeMenu: function(){
        return this.$route.name
      },
      onRoutes(){
        return this.$route.path.replace('/','')
      }
    }
  }
</script>
<style scoped lang="scss">
  .el-aside {
    position: absolute;
    left:0;
    top:80px;
    bottom: 0;
    background-color: #F5F5F5;
    .el-menu{
      background-color: transparent;
      .itemText{
        color: #140000;
        font-size: 16px;
      }
      .fa{
        margin-right: 10px;
        font-size: 20px;
        color: #140000;
      }
      .el-submenu{
        .el-submenu__title{
          display: flex;
          display: -webkit-flex;
          align-items: center;
          -webkit-align-items: center;
          color: #140000;

          i{
            font-size: 16px;
            color: #606266;
          }
        }
        .el-menu-item{
          position: relative;
          background: #E9E9E9;
          color: #140000;
          font-size: 14px;
        }
        .el-menu-item{
          i{
            opacity: 0;
            font-size: 14px;
            color: #2cca9a;
            margin: 0;
          }
        }
        .el-menu-item a{
          color: #140000;
          font-size: 14px;
        }
        .el-menu-item.is-active,
        .el-menu-item.is-active a{
          color: #23C09B;
        }
        .el-menu-item.is-active{
          i{
            opacity: 1;
          }
        }
        .el-menu-item:last-child{
          border-bottom: none;
          padding-bottom: 10px;
        }
      }
      .el-submenu.is-opened{
        background: #E9E9E9;
      }
    }
  }

</style>
