<template>
  <div class="" v-loading="listLoading">
    <el-row class="topLine">
      <el-col :span="24">
        <el-form :inline="true" class="demo-form-inline">
          <!--<el-form-item >-->
            <!--<el-input size="mini" v-model="keywords" placeholder="请输入姓名"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item>
            <!--<el-button size="mini" type="primary" icon="fa fa-search" @click="searchAdmin(keywords)">查询</el-button>-->
            <el-button size="mini"  icon="fa fa-plus"  @click="addAdminVisible = true"> 新增管理员</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!--编辑管理员-->
    <el-dialog title="编辑管理员" :visible.sync="editAdminVisible" center width="520px" class="addAdminDialog">
      <el-form :model="editAdminFrom" :rules="editAdminFromRules" ref="editAdminFrom"  label-position="left" label-width="80px" class="demo-ruleForm" width="300px">
        <el-form-item label="姓名" prop="name">
          <el-input size="mini" v-model="editAdminFrom.name"></el-input>
        </el-form-item>
        <el-form-item label="工号" prop="jobnum">
          <el-input size="mini" v-model.number="editAdminFrom.jobnum"></el-input>
        </el-form-item>
        <el-form-item size="mini" label="岗位" prop="deptid">
          <!--岗位二级联动-->
          <el-cascader
            :options="getPostList"
            v-model="editAdminSelectedOptions">
          </el-cascader>

          <el-button size="mini" type="primary" plain icon="fa fa-plus"  @click="addPostVisible = true">新增岗位</el-button>
          <el-button size="mini" plain icon="fa fa-pencil-square-o"  @click="editPostVisible = true">编辑岗位</el-button>
          <!--新增岗位-->
          <el-dialog
            width="400px"
            title="新增岗位"
            center
            :visible.sync="addPostVisible"
            append-to-body>
            <el-form :model="addPostForm" :rules="addPostrules" ref="addPostForm" label-width="90px" class="">
              <el-form-item label="所有部门:" prop="department">
                <el-radio-group v-model="addPostForm.department">
                  <el-radio v-for="(item,index) in getDepartment" :key="index" :label="item.id">{{item.value}}</el-radio>
                </el-radio-group>
                <el-button size="mini" type="primary" plain icon="fa fa-plus"  @click="addDepartmentVisible = true">新增部门</el-button>
                <!--新增部门-->
                <el-dialog
                  width="450px"
                  title="新增部门"
                  center
                  :visible.sync="addDepartmentVisible"
                  append-to-body>
                  <template>
                    <el-form inline :model="departmentForm" :rules="departmentFormRules" ref="departmentForm">
                      <el-form-item
                        label="部门名称"
                        prop="name">
                        <el-input size="mini" v-model="departmentForm.name" :autofocus="true" placeholder="请输入部门名称"></el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-button size="mini" type="primary" :loading="isBtnLoading" @click="createdDepartment('departmentForm')">{{btnText}}</el-button>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-dialog>
              </el-form-item>
              <el-form-item label="职位名称:" prop="position">
                <el-input v-model="addPostForm.position"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button  size="mini" type="primary" :loading="isBtnLoading" @click="createdPostForm('addPostForm')">创建岗位</el-button>
                <el-button size="mini" @click="resetForm('ruleForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
          <!--编辑岗位-->
          <el-dialog
            width="400px"
            title="编辑岗位"
            center
            :visible.sync="editPostVisible"
            append-to-body>
            <template>
              <el-collapse accordion>
                <el-collapse-item v-for="(item,index) in getPostList" :key="index">
                  <template slot="title">
                    {{item.label}}
                  </template>
                  <el-form label-position="right" class="edit-post-list">
                    <el-form-item label="部门：">
                      {{item.label}}
                      <i class="fa fa-pencil-square-o" aria-hidden="true" @click="editDepartment(item)"></i>
                      <i class="fa fa-trash" aria-hidden="true" @click="delDepartmentBtn(item)"></i>
                    </el-form-item>

                    <el-form-item label="职位：">
                      <div class="position-list">
                        <span v-for="(v,i) in item.children" :key="i">
                          {{v.label}}
                          <span>
                            <i class="fa fa-pencil-square-o"  aria-hidden="true" @click="editPosition(item.value,v)"></i>
                            <i class="fa fa-trash" aria-hidden="true" @click="delPositionBtn(item.value,v)"></i>
                          </span>
                        </span>
                      </div>
                    </el-form-item>
                  </el-form>
                </el-collapse-item>
              </el-collapse>
            </template>

            <el-dialog
              width="400px"
              title="修改"
              center
              :visible.sync="changeEditFormVisible"
              append-to-body>
              <template>
                <el-form inline :model="changeEditForm" :rules="changeEditFormRules" ref="changeEditForm">
                  <el-form-item
                    :label="changeEditForm.title"
                    prop="name">
                    <el-input size="mini" v-model="changeEditForm.name" :autofocus="true" placeholder="请输入名称"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button size="mini" type="primary" :loading="isBtnLoading" @click="changeEditBtn('changeEditForm')">{{btnText}}</el-button>
                  </el-form-item>
                </el-form>
              </template>
            </el-dialog>

          </el-dialog>

        </el-form-item>
        <el-form-item label="手机号" prop="superphone">
          <el-input size="mini" v-model.number="editAdminFrom.superphone"></el-input>
        </el-form-item>
        <el-form-item label="登录账号" prop="supername">
          <el-input size="mini" v-model="editAdminFrom.supername"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="superpass">
          <el-input size="mini" v-model="editAdminFrom.superpass" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetForm('editAdminFrom')">重置</el-button>
        <el-button size="mini" type="primary" :loading="isBtnLoading" @click="editAdmin('editAdminFrom')">保存提交</el-button>
      </div>
    </el-dialog>

    <!--新增管理员-->
    <el-dialog title="新增管理员" :visible.sync="addAdminVisible" center width="520px" class="addAdminDialog">
      <el-form :model="addAdminFrom" :rules="addAdminFromRules" ref="addAdminFrom"  label-position="left" label-width="80px" class="demo-ruleForm" width="300px">
        <el-form-item label="姓名" prop="name">
          <el-input size="mini" v-model="addAdminFrom.name"></el-input>
        </el-form-item>
        <el-form-item label="工号" prop="jobnum">
          <el-input size="mini" v-model.number="addAdminFrom.jobnum"></el-input>
        </el-form-item>
        <el-form-item size="mini" label="岗位" prop="deptid">
          <!--岗位二级联动-->
          <el-cascader
            :options="getPostList"
            v-model="addAdminFrom.selectedOptions">
          </el-cascader>

          <el-button size="mini" type="primary" plain icon="fa fa-plus"  @click="addPostVisible = true">新增岗位</el-button>
          <el-button size="mini" plain icon="fa fa-pencil-square-o"  @click="editPostVisible = true">编辑岗位</el-button>
          <!--新增岗位-->
          <el-dialog
            width="400px"
            title="新增岗位"
            center
            :visible.sync="addPostVisible"
            append-to-body>
            <el-form :model="addPostForm" :rules="addPostrules" ref="addPostForm" label-width="90px" class="">
              <el-form-item label="所有部门:" prop="department">
                <el-radio-group v-model="addPostForm.department">
                  <el-radio v-for="(item,index) in getDepartment" :key="index" :label="item.id">{{item.value}}</el-radio>
                </el-radio-group>
                <el-button size="mini" type="primary" plain icon="fa fa-plus"  @click="addDepartmentVisible = true">新增部门</el-button>
                <!--新增部门-->
                <el-dialog
                  width="450px"
                  title="新增部门"
                  center
                  :visible.sync="addDepartmentVisible"
                  append-to-body>
                  <template>
                    <el-form inline :model="departmentForm" :rules="departmentFormRules" ref="departmentForm">
                      <el-form-item
                        label="部门名称"
                        prop="name">
                        <el-input size="mini" v-model="departmentForm.name" :autofocus="true" placeholder="请输入部门名称"></el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-button size="mini" type="primary" :loading="isBtnLoading" @click="createdDepartment('departmentForm')">{{btnText}}</el-button>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-dialog>
              </el-form-item>
              <el-form-item label="职位名称:" prop="position">
                <el-input v-model="addPostForm.position"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button  size="mini" type="primary" :loading="isBtnLoading" @click="createdPostForm('addPostForm')">创建岗位</el-button>
                <el-button size="mini" @click="resetForm('ruleForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
          <!--编辑岗位-->
          <el-dialog
            width="400px"
            title="编辑岗位"
            center
            :visible.sync="editPostVisible"
            append-to-body>
            <template>
              <el-collapse accordion>
                <el-collapse-item v-for="(item,index) in getPostList" :key="index">
                  <template slot="title">
                    {{item.label}}
                  </template>
                  <el-form label-position="right" class="edit-post-list">
                    <el-form-item label="部门：">
                      {{item.label}}
                      <i class="fa fa-pencil-square-o" aria-hidden="true" @click="editDepartment(item)"></i>
                      <i class="fa fa-trash" aria-hidden="true" @click="delDepartmentBtn(item)"></i>
                    </el-form-item>

                    <el-form-item label="职位：">
                      <div class="position-list">
                        <span v-for="(v,i) in item.children" :key="i">
                          {{v.label}}
                          <span>
                            <i class="fa fa-pencil-square-o"  aria-hidden="true" @click="editPosition(item.value,v)"></i>
                            <i class="fa fa-trash" aria-hidden="true" @click="delPositionBtn(item.value,v)"></i>
                          </span>
                        </span>
                      </div>
                    </el-form-item>
                  </el-form>
                </el-collapse-item>
              </el-collapse>
            </template>

            <el-dialog
              width="400px"
              title="修改"
              center
              :visible.sync="changeEditFormVisible"
              append-to-body>
              <template>
                <el-form inline :model="changeEditForm" :rules="changeEditFormRules" ref="changeEditForm">
                  <el-form-item
                    :label="changeEditForm.title"
                    prop="name">
                    <el-input size="mini" v-model="changeEditForm.name" :autofocus="true" placeholder="请输入名称"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button size="mini" type="primary" :loading="isBtnLoading" @click="changeEditBtn('changeEditForm')">{{btnText}}</el-button>
                  </el-form-item>
                </el-form>
              </template>
            </el-dialog>

          </el-dialog>

        </el-form-item>
        <el-form-item label="手机号" prop="superphone">
          <el-input size="mini" v-model.number="addAdminFrom.superphone"></el-input>
        </el-form-item>
        <el-form-item label="登录账号" prop="supername">
          <el-input size="mini" v-model="addAdminFrom.supername"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="superpass">
          <el-input size="mini" v-model="addAdminFrom.superpass" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetForm('addAdminFrom')">重置</el-button>
        <el-button size="mini" type="primary" :loading="isBtnLoading" @click="createAdmin('addAdminFrom')">立即创建</el-button>
      </div>
    </el-dialog>

    <el-table
      :data="adminList"
      stripe
      style="width: 100%">
      <el-table-column
        fixed
        type="index"
        width="90">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="deptname"
        label="部门"
        align="center">
      </el-table-column>
      <el-table-column
        prop="jobname"
        label="职位"
        align="center">
      </el-table-column>
      <el-table-column
        prop="supername"
        label="账号"
        align="center"
        width="">
      </el-table-column>
      <el-table-column
        prop="superphone"
        label="联系电话"
        align="center"
        width="">
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
            @click="handleEdit(scope.$index, scope.row)">&nbsp;&nbsp;编辑</el-button>
          <el-button
            size="mini"
            icon="fa fa-trash"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">&nbsp;&nbsp;删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import instance from '@/api';
  const qs = require('qs');
  import * as util from '@/assets/js/util.js';

  import {mapGetters,mapMutations} from 'vuex'

  export default {
    data() {
      return {
        listLoading:false,
        isBtnLoading: false,
        //查询
        keywords: '',

        selectedOptions: [],

        //管理员列表
        adminList: [],

        //新增岗位
        addPostVisible:false,
        addPostForm: {
          department: '',
          position: ''
        },
        addPostrules: {
          department: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          position: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ]
        },
        //新增部门
        addDepartmentVisible:false,//新增部门输入框
        departmentForm:{
          name:''
        },
        departmentFormRules: {
          name:[
            { required: true, message: '请输入部门名称', trigger: 'blur' }
          ],
        },

        //编辑岗位
        editPostVisible : false,

        //编辑部门和职位
        changeEditFormVisible:false,
        changeEditForm:{

        },
        changeEditFormRules:{
          name:[
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
        },


        //编辑管理员
        editAdminVisible:false,
        editAdminFrom:{},
        editAdminSelectedOptions:[],
        editAdminFromRules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          jobnum: [
            { required: true, message: '请输入工号', trigger: 'blur' }
          ],
          superphone: [
            { required: true, message: '请输入手机号', trigger: 'blur' }
          ],
          supername: [
            { required: true, message: '请输入登录账号', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
          ]
        },


        //添加管理员
        addAdminVisible:false,//添加管理员dialog
        addAdminFrom:{//添加管理员数据
          sessionid : util.session('sessionid'),//用户唯一标示
          supername:'',//登录名
          superphone:'',//手机号
          superpass:'111111',//登录密码
          name:'',//姓名
          jobnum:'',//工号
          selectedOptions:[],
          deptid:'',//部门id
          positionid:''//职位id
        },
        addAdminFromRules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          jobnum: [
            { required: true, message: '请输入工号', trigger: 'blur' },
            { type: 'number', message: '工号必须是数字', trigger: 'blur' }
          ],
          superphone: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { type: 'number', message: '请输入正确的手机号', trigger: 'blur,change' }
          ],
          supername: [
            { required: true, message: '请输入登录账号', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
          ],
          superpass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
          ]
        },
      }
    },
    created:function(){
      this.loadData();
      this.getAllPost();
    },
    computed: {
      ...mapGetters(['getPostList','getDepartment','getPosition']),
      btnText() {
        if (this.isBtnLoading) return '提交...';
        return '提交';
      }
    },
    methods: {
      ...mapMutations(['setPost','addDepartment','changeDepartment','changeDepartment','delDepartment','addPosition','changePosition','delPosition']),
      //加载数据
      loadData(){
        this.listLoading = true;
        let params = {
          st:1,
          sessionid : util.session('sessionid'),//用户唯一标示
        }
        instance.post('/super/selectAllsuper.do',qs.stringify(params)).then(res => {
          console.log(res)
          this.listLoading = false;
          this.adminList = res.data.data;
        }).catch(util.catchError)
      },
      //获取服务器所有岗位
      getAllPost(){
        let params = {
          sessionid : util.session('sessionid'),//用户唯一标示
        };
        instance.post('/deptmanage/selectAllMessage.do',qs.stringify(params)).then(res => {
          console.log(res);
          if(res.data.status==0){
            let data = res.data.data;
            this.setPost(data);
          }
        }).catch(util.catchError)
      },
      //查询管理员
      searchAdmin(keywords) {
        if(!keywords){
          this.$message.error('输入内容不能为空');
        }
        console.log('submit!');
      },
      //创建部门
      createdDepartment(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.isBtnLoading = true;
            let params = {
              deptname:this.departmentForm.name,
              sessionid : util.session('sessionid'),//用户唯一标示
            };
            instance.post('/deptmanage/addDePartmen.do',qs.stringify(params)).then(res => {
              console.info('res:'+JSON.stringify(res));
              this.addDepartmentVisible = false;
              this.isBtnLoading = false;
              let jsondata = {
                id : res.data.data.id,
                deptname : res.data.data.deptname
              }
              this.addDepartment(jsondata);
            }).catch(util.catchError);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //创建岗位
      createdPostForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.isBtnLoading = true;
            let params = {
              jobname:this.addPostForm.position,
              deptid:this.addPostForm.department,
              sessionid : util.session('sessionid'),//用户唯一标示
            };
            instance.post('/jobmange/AddJob.do',qs.stringify(params)).then(res => {
              console.info('res:'+JSON.stringify(res));
              this.addPostVisible = false;
              this.isBtnLoading = false;
              let jsondata = {
                id : res.data.data.id,
                deptid : res.data.data.deptid,
                jobname : res.data.data.jobname
              }
              this.addPosition(jsondata);
            }).catch(util.catchError);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //编辑部门
      editDepartment(item){
        this.changeEditFormVisible = true;
        let object = {
          title : '部门名称',
          deptId : '',
          name : item.label,
          id : item.value
        }
        this.changeEditForm = object
      },
      //编辑岗位
      editPosition(id,item){
        console.log(id)
        this.changeEditFormVisible = true;
        let object = {
          title : '职位名称',
          deptId : id,
          name : item.label,
          id : item.value
        }
        this.changeEditForm = object
      },
      changeEditBtn(formName){
        let _this = this;
        _this.$refs[formName].validate((valid) => {
          if (valid) {
            if(_this.changeEditForm.deptId === ''){//修改部门
              let params = {
                id : _this.changeEditForm.id,
                deptname : _this.changeEditForm.name,
                sessionid : util.session('sessionid')//用户唯一标示
              };
              instance.post('/deptmanage/UpdateDePartmenMessage.do',qs.stringify(params)).then(res => {
                console.info('res:'+JSON.stringify(res));
                this.changeEditFormVisible = false;
                let jsondata = {
                  id : _this.changeEditForm.id,
                  value : _this.changeEditForm.name
                }
                this.changeDepartment(jsondata);
              }).catch(util.catchError);
            }else{//修改职位
              let params = {
                jobid : _this.changeEditForm.id,
                deptid : _this.changeEditForm.deptId,
                jobname : _this.changeEditForm.name,
                sessionid : util.session('sessionid')//用户唯一标示
              };
              instance.post('/jobmange/updateJobByid.do',qs.stringify(params)).then(res => {
                console.info('res:'+JSON.stringify(res));
                this.changeEditFormVisible = false;
                let jsondata = {
                  id : _this.changeEditForm.deptId,
                  childId : _this.changeEditForm.id,
                  value : _this.changeEditForm.name
                }
                this.changePosition(jsondata);
              }).catch(util.catchError);
            }
          } else {
            console.log('error submit!!')
            return false;
          }
        });
      },

      //删除部门
      delDepartmentBtn(item){
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          let params = {
            deptid : item.value,
            sessionid : util.session('sessionid')//用户唯一标示
          };
          instance.post('/deptmanage/DeleteDePartmen.do',qs.stringify(params)).then(res => {
            console.info('res:'+JSON.stringify(res));
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.delDepartment(item.value);
          }).catch(util.catchError);

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //删除职位
      delPositionBtn(depatId,item){
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          let params = {
            jobid : item.value,
            sessionid : util.session('sessionid')//用户唯一标示
          };
          instance.post('/jobmange/deleteJobByid.do',qs.stringify(params)).then(res => {
            console.info('res:'+JSON.stringify(res));
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            let jsonData = {
              id : depatId,
              childId : item.value
            };
            this.delPosition(jsonData);
          }).catch(util.catchError);

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      //创建管理员
      createAdmin(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addAdminVisible = false;
            let selectedOptions = this.addAdminFrom.selectedOptions;//岗位信息
            if(selectedOptions.length!=0){//选择了岗位
              this.addAdminFrom.deptid = this.addAdminFrom.selectedOptions[0];
              this.addAdminFrom.positionid = this.addAdminFrom.selectedOptions[1]
//              let dept = this.getPostList.find(n => n.value === this.addAdminFrom.selectedOptions[0]);//获取部门
//              let jobN = dept.children.find(n => n.value === this.addAdminFrom.selectedOptions[1]);//获取岗位
//              console.log(dept);
//              console.log(jobN);
            }
            instance.post('/super/addadmmes.do',qs.stringify(this.addAdminFrom)).then(res => {
              console.info('res:'+JSON.stringify(res));
              this.loadData();
            }).catch(util.catchError);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },

      //编辑管理员
      handleEdit(index, row) {
        console.log(index, row);
        this.editAdminVisible = true;
        this.editAdminFrom = Object.assign({}, row);
        this.editAdminSelectedOptions = [this.editAdminFrom.deptid,this.editAdminFrom.jobid];
      },
      editAdmin(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.editAdminVisible = false;
            this.editAdminFrom.deptid = this.editAdminSelectedOptions[0];
//            this.editAdminFrom.jobid = this.editAdminSelectedOptions[1];
            this.editAdminFrom['positionid'] = this.editAdminSelectedOptions[1];

            let dept = this.getPostList.find(n => n.value === this.editAdminSelectedOptions[0]);//获取部门
            this.editAdminFrom.deptname = dept.label;
            this.editAdminFrom.jobname = dept.children.find(n => n.value === this.editAdminSelectedOptions[1]).label;//获取岗位

            this.editAdminFrom['sessionid'] = util.session('sessionid');//用户唯一标示

            console.log(this.editAdminFrom)
            instance.post('/super/updateadmmes.do',qs.stringify(this.editAdminFrom)).then(res => {
              console.info('res:'+JSON.stringify(res))
              this.loadData();
            }).catch(util.catchError);

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //删除管理员
      handleDelete(index, row) {
        console.log(row.id);
        let _this = this;
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            sid:row.id,
            st:1,
            sessionid : util.session('sessionid'),//用户唯一标示
          };
          instance.post('/super/deletesuper.do',qs.stringify(params)).then(res => {
            console.info('res:'+JSON.stringify(res))
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.loadData();
          }).catch(util.catchError);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    }
  }
</script>
<style scoped lang="scss">
  .addAdminDialog{
    padding: 30px 30px;
    .el-form-item{
      margin-bottom: 15px;
    }
    .dialog-footer{
      text-align: center;
    }
    .el-dialog{
      width: 300px;
    }
  }
  .el-radio-group{
    display: block;
    .el-radio {
      display: inline-block;
      width: 50%;
      margin-left: 0;
      margin-bottom: 10px;
    }
  }

  .edit-post-list{
    .el-form-item{
      border-top: 1px solid #cccccc;
      margin-bottom: 0;
    }
    .position-list{
      display: flex;
      display: -webkit-flex;
      justify-content: space-between;
      -webkit-justify-content: space-between;
      >span{
        width: 45%;
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
        -webkit-justify-content: space-between;
        i:hover{
          color: #2cca9a;
        }
      }

    }
  }
</style>
