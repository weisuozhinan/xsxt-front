<template>
  <div>
    <el-container>
      <el-header class="homeHeader">
        <div class="title">学生选题管理系统</div>
        <el-dropdown class="userInfo" @command="commandHandler" >
            <span class="el-dropdown-link">
              <div id="title-permission">
              <div v-if="permission==0">欢迎管理员 {{user.name }}</div>
              <div v-else-if="permission==1">欢迎教师 {{user.name }}</div>
              <div v-else>欢迎学生 {{user.name }}</div>
              </div>
            </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logout">注销登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu router unique-opened="false">
            <el-submenu :index="index+''"
                        v-for="(item,index) in routes"
                        :key="index"
                        v-if="!item.hidden">
              <template slot="title">
                <span>{{ item.name }}</span>
              </template>
              <el-menu-item :index="children.path"
                            v-for="(children,indexj) in item.children" :key="indexj">{{ children.name }}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path!='/home'">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ this.$router.currentRoute.name }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="homeWelcome" v-if="this.$router.currentRoute.path=='/home'">欢迎来到学生选题管理系统首页</div>
          <router-view class="homeRouterView"/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  data(){
    return{
      //user:JSON.parse(window.sessionStorage.getItem('user')),
      permission:JSON.parse(window.sessionStorage.getItem('permission'))
    }
  }
  ,computed: {
    routes() {
      return this.$store.state.routes;
    },
    user(){
      return this.$store.state.currentUser;
    }
  },
  methods: {
    commandHandler(command) {
      if (command == 'logout') {
        this.$confirm('此操作将注销登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //注销登录
          this.postRequest('/logout');
          //清空用户信息
          window.sessionStorage.removeItem('tokenStr');
          window.sessionStorage.removeItem('user');
          window.sessionStorage.removeItem('permission');
          window.sessionStorage.removeItem('students');
          window.sessionStorage.removeItem('isHaveSubject');
          //清空菜单
          this.$store.commit('initRoutes',[]);
          //跳转到登录界面
          this.$router.replace('/');
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      }
    }
  }
}
</script>

<style scoped>
.homeHeader {
  background: #4697cb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  box-sizing: border-box;

}

.homeHeader .title {
  font-size: 30px;
  font-family: 楷体;
  color: white;
}

.el-dropdown-link img {
  width: 48px;
  height: 48px;
  border: 24px;
  margin-left: 8px;

}

.homeWelcome {
  text-align: center;
  font-size: 30px;
  font-family: 楷;
  color: #4697cb;
  padding-top: 50px;
}

.homeRouterView {
  margin-top: 10px;
}

</style>