const state ={
  post :[],//岗位
}

const getters = {
  //获取所有岗位列表
  getPostList : state => {
    if(state.post.length===0) return []
    return state.post;
  },
  //获取部门列表
  getDepartment : state => {
    let array = [];
    state.post.map(n => {
      array.push({
        id:n.value,
        value:n.label,
      })
    });
    return array;
  }
}

const actions = {
  //设置岗位
  setPost({commit},item){
    commit('setPost',item);
  },
  //添加部门
  addDepartment({commit},item){
    commit('addDepartment',item)
  },
  //修改部门
  changeDepartment({commit},item){
    commit('changeDepartment',item)
  },
  //删除某一部门
  delDepartment({commit},id){
    commit('delDepartment',id)
  },
  //添加岗位
  addPosition({commit},item){
    commit('addPosition',item)
  },
  //修改职位信息
  changePosition({commit},item){
    commit('changePosition',item)
  },
  //删除某一职位
  delPosition({commit},item){
    commit('delPosition',item)
  }
}

const mutations = {
  //设置岗位
  setPost(state,item){
    state.post = [];
    if(item.length!=0){
      item.map(n => {
        let child = [];
        if(n.djlist.length!=0){
          n.djlist.map(v => {
            child.push({
              value:v.id,
              label:v.jobname,
            })
          })
        };
        state.post.push({
          value:n.id,
          label:n.deptname,
          children:child
        })
      })
    };
  },
  //添加部门
  addDepartment(state,item){
    state.post.push({
      value:item.id,
      label:item.deptname,
      children:[]
    })
  },
  //通过id查看部门信息
  getDepartmentInfo (state,id){
    let object = state.post.find(n => n.value ===id);
    console.log(object.label)
    return object.label
  },
  //修改部门
  changeDepartment(state,item){
    let depart = state.post.find(n => n.value === item.id);//找到该部门
    if(!depart) return '不存在该部门';

    depart.label = item.value;
  },
  //删除某一部门
  delDepartment(state,id){
    let departIndex = state.post.findIndex(n => n.value === id);//找到该部门索引
    if(!departIndex) return '不存在该部门';
    state.post.splice(departIndex,1);//删除
  },
  //添加岗位
  addPosition(state,item){
    let depart = state.post.find(n => n.value === item.deptid);//找到该部门索引
    if(!depart) return '不存在该部门';
    depart.children.push({
      value : item.id,
      label : item.jobname
    })
  },
  //通过id获取某职位信息
  getPositionInfo : (state,item) => {
    let depart = state.post.find(n => n.value === item[0]);//找到该部门
    if(!depart) return '不存在该部门';
    let position = depart.children.find(n => n.value == item[1]);//找到该岗位
    if(!position) return '不存在该职位';
    return position.label;
  },
  //修改职位
  changePosition(state,item){
    let depart = state.post.find(n => n.value === item.id);//找到该部门
    if(!depart) return '不存在该部门';
    let position = depart.children.find(n => n.value == item.childId);//找到该岗位
    if(!position) return '不存在该职位'
    position.label = item.value;
  },
  //删除某职位
  delPosition(state,item){
    let depart = state.post.find(n => n.value === item.id);//找到该部门
    if(!depart) return '不存在该部门';
    let positionIndex = depart.children.findIndex(n => n.value == item.childId);//找到该岗位
    depart.children.splice(positionIndex,1);//删除该职位
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
