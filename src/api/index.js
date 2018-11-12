import axios from 'axios';
import * as util from '../assets/js/util.js';

const instance = axios.create({
  baseURL: 'http://59.110.136.67:8081/NewDwShop',//生产环境
  // baseURL: '/api',//开发环境
  timeout: 100000
});
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// instance.defaults.headers.post['Content-Type'] = 'application/json';
//错误处理
instance.interceptors.response.use(function(response) {
  return response;
}, util.catchError);

export default instance;
