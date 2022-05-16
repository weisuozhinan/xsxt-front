import Vue from 'vue'
import App from './App.vue'
import store from "./store";
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import {postRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {getRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";
import {initMenu} from "@/utils/menus";
import {downloadRequest} from "@/utils/download";

Vue.config.productionTip = false
Vue.use(ElementUI);
//插件形式使用请求
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.downloadRequest=downloadRequest;

router.beforeEach((to, from, next) => {

  var url='';
  //判断用户是否登录
  if (window.sessionStorage.getItem('tokenStr')) {
    initMenu(router, store);
    if(window.sessionStorage.getItem('permission')==0){
      url='/admin/info';
    }else if(window.sessionStorage.getItem('permission')==1){
      url='/teacher/info';
    }else{
      url='/student/info';
    }
    //判断用户信息是否存在
    if (!window.sessionStorage.getItem('user')) {
      return getRequest(url).then(resp => {
        if (resp) {
          //存入用户信息
          window.sessionStorage.setItem('user', JSON.stringify(resp));
          store.commit('INIT_USER',resp);
          next();
        }
      });
    }
    next();
  } else {
    if (to.path == '/'||to.path=='/register') {
      next();
    } else {
      next('/?redirect=' + to.path);
    }
  }

})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
