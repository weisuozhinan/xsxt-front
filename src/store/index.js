import Vue from "vue"
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        routes:[],
        sessions:{},
        users:[],
        currentUser:JSON.parse(window.sessionStorage.getItem('user')),
        currentSession:null

    },

    mutations:{
        INIT_USER(state,user){
            state.currentUser=user;
        }
        ,initRoutes(state,data){
            state.routes=data;
        }
    },


    actions:{

    }

})