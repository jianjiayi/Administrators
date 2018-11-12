const state = {
  user : JSON.parse(sessionStorage.getItem('$user')) || {},//保存用户登录后基本信息
  safeState:  sessionStorage.getItem('$safeState') ||false,//默认没有设置安全支付
}

const getters = {
  getUser : state => {//获取用户信息
    return state.user;
  },
  getSafeState:state => {
    return state.safeState;
  }
}

const actions = {
  setUser({commit},item){//设置用户信息
    commit('setUser',item)
  },
  setUserName({commit},value){//设置用户名
    commit('setUserName',value);
  },
  setUserImg({commit},img){//设置头像
    commit('setUserImg',img);
  },
  clearUser({commit}){
    commit('clearUser')
  },
  setSafeState({commit},value){
    commit('setSafeState',value)
  }
}

const mutations = {
  setUser(state,item){//设置用户信息
    state.user = item;
    sessionStorage.setItem('$user',JSON.stringify(state.user))
  },
  setUserName(state,value){//设置用户名
    state.user.name = value;
    sessionStorage.setItem('$user',JSON.stringify(state.user))
  },
  setUserImg(state,img){//设置头像
    state.user.img = img;
    sessionStorage.setItem('$user',JSON.stringify(state.user))
  },
  clearUser(state){
    state.user = {};
    sessionStorage.setItem('$user',JSON.stringify(state.user));
    state.safeState = false;
  },

  setSafeState(state,value){
    state.safeState = value;
    sessionStorage.setItem('$safeState', state.safeState);
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
