<template>
  <div class="" v-loading="listLoading">
    <el-table
      :data="adminData"
      style="width: 100%"
      header-align="center">
      <el-table-column
        fixed
        label="姓名"
        prop="name"
        width="">
      </el-table-column>
      <el-table-column
        label="部门"
        prop="deptname"
        align="center"
        width="">
      </el-table-column>
      <el-table-column
        label="职位"
        prop="jobname"
        align="center"
        width="">
      </el-table-column>
      <el-table-column
        label="已拥有权限"
        align="center"
        prop="roles">
        <template slot-scope="scope">
          <span v-if="getHasRoles(scope.row.superrole).length == 0">暂无权限分配</span>
          <el-tag v-else margin-right="5px" size="mini" v-for="(tag,index) in getHasRoles(scope.row.superrole)" :type="tag.summary" :key="index">{{tag.name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="fa fa-pencil-square-o"
            @click="handleEditRoles(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            icon="fa fa-trash"
            type="danger"
            @click="handleDeleteAdmin(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--编辑权限提示框-->
    <el-dialog
      title="编辑权限"
      :visible.sync="setRolesVisible"
      width="550px"
      center>
      <el-transfer
        v-model="hasRoles"
        :props="{
          key: 'value',
          label: 'name',
        }"
        :data="getAllRoles"
        original
        :titles="titles">
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="resetRoles(hasRoles)">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
  import instance from '@/api';
  const qs = require('qs');
  import * as util from '@/assets/js/util.js';

  import allRolesArray  from '@/assets/js/allRolesArray'



  export default {
    data(){
      return {
        listLoading:false,
        adminData: [],
        titles:['未选权限','已选权限'],//dialog标题

        superid:'',//修改权限时 暂时id
        index:'',//修改  保持数据条索引
        hasRoles: [],//dialog提交重置后的权限
        setRolesVisible:false,//设置权限dialog
      };
    },
    created(){
      this.listLoading = true;
      let para = {
        st :1,
        sessionid : util.session('sessionid'),
      };
      instance.post('/super/selectAllsuper.do',qs.stringify(para)).then(res => {
        console.info('res:'+JSON.stringify(res))

        this.listLoading = false;
        let status = res.data.status;
        if(status === 0){//成功
          this.adminData = res.data.data;
        }else{//未登录
          this.$message({
            message: res.data.msg,
            type: 'warning'
          });
        }
      }).catch(util.catchError);
    },
    computed:{
      getAllRoles(){
        let allowedRouter = [];
        //将菜单数据转成多维数组格式
        let arrayMenus = util.buildMenu(allRolesArray.menus);
        let menus = [];
        arrayMenus.map(n => {
          if(n.id!='01'&&n.id!='-10'){
            menus.push({
              value: n.id,
              name: n.name
            });
          }
        })
        console.log(menus)
        return menus
      }
    },
    methods:{
      //获得服务器上已有的权限
      getHasRoles(rolesStr){
        if(rolesStr===''||rolesStr===null){
          return []
        }
        let hasArray = eval('(' + rolesStr + ')');//格式化权限为数组
        return  hasArray.menus.filter(n => {return n.summary !='' })//返回 summary为空的新数组
      },
      //编辑按钮
      handleEditRoles(index, row) {
        let _this = this;
        _this.hasRoles = [];//清空数组

        let adminInfo = Object.assign({},row);//铐被管理员信息

        _this.superid = adminInfo.id;//保存admin 临时id
        _this.index = index;//保存数据 index

        let roleArray = this.getHasRoles(adminInfo.superrole);//格式化并返回权限数组

        roleArray.map(n =>{
          if(n.id!='01'&&n.id!='-10'){
            this.hasRoles.push(n.id);//添加id
          }
        })

        this.setRolesVisible = true;
      },
      //删除管理员
      handleDeleteAdmin(index, row) {
        console.log(index);
        this.$confirm('确认删除该管理员？','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then( ()=> {
          //确定删除
          console.log('删除')
        }).catch( () => {});
      },
      //重置权限
      resetRoles(value){

        let arrayChildren = [];
        let arrayParents =[];

        let object = {};

        value.map(id =>{
          allRolesArray.menus.map(n => {
            if(n.id === id){
              arrayParents.push(n)
            }
          })
        })
        console.log(arrayParents)
        arrayParents.map(item => {
          allRolesArray.menus.map(n => {
            if(n.parent_id === item.id){
              arrayChildren.push(n)
            }
          })
        })
        object['menus'] = arrayParents.concat(arrayChildren);//该用户最终获得权限数组

        console.log(JSON.stringify(object))
        let para = {
          sessionid : util.session('sessionid'),//用户唯一标示
          superid:this.superid,//管理员id
          message:JSON.stringify(object)//权限
        };
        let _this = this;
        instance.post('/authority/addorupdateauthority.do',qs.stringify(para)).then(res => {
          let status = res.data.status;
          if(status === 0){//成功
            _this.$set(_this.adminData[_this.index],'superrole',JSON.stringify(object));//更新 数据
            _this.setRolesVisible = false;//关闭模态框
          }else{//错误
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }).catch(util.catchError);
      },
    }
  }
</script>
<style scoped lang="scss">
  .el-table .cell{
    overflow-x: hidden;
    text-align: center;
  }
  .el-tag{
    margin-right: 5px;
    margin-bottom: 3px;
  }
</style>
