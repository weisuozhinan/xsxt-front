<template>
  <div>
    <el-form :rules="rules"
             v-loading="loading"
             element-loading-text="拼命加载中"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)"
             status-icon
             ref="loginFrom"
             :model="loginForm"
             class="loginContainer">
      <h3 class="loginTitle">系统登录</h3>
      <el-form-item prop="identity">
        <el-radio-group v-model="loginForm.permission">
          <el-radio :label="0">管理员</el-radio>
          <el-radio :label="1">教师</el-radio>
          <el-radio :label="2">学生</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="username">
        <el-input type="text" auto-complete="false" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" auto-complete="false" v-model="loginForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input type="text" auto-complete="false" v-model="loginForm.code" placeholder="点击图片更换验证码"
                  style="width: 250px;margin-right: 5px"></el-input>
        <img :src="captchaUrl" @click="updateCaptcha" alt="">
      </el-form-item>
      <el-checkbox v-model="checked" class="loginRemember">记住我</el-checkbox>
      <el-form-item>
      <el-button type="primary" style="width: 100%" @click="submitLogin('loginForm')">登录</el-button>
      </el-form-item>
        <p class="register" @click="gotoRegister()">立即注册</p>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      captchaUrl: '/captcha?time' + new Date(),
      loginForm: {
        username: '',
        password: '',
        code: '',
        permission: 0,

      },
      loading: false,
      checked: true,
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入验证码', trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    gotoRegister(){
      let path = this.$route.query.redirect;
      this.$router.replace((path == '/' || path == undefined) ? '/register' : path)
    },

    updateCaptcha() {
      this.captchaUrl = '/captcha?time=' + new Date();
    },
    submitLogin() {
      this.$refs.loginFrom.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.postRequest('/login', this.loginForm).then(resp => {
            this.loading = false;
            if (resp) {
              //存储用户token
              const tokenStr = resp.obj.tokenHead + resp.obj.token;
              window.sessionStorage.setItem('tokenStr', tokenStr);
              window.sessionStorage.setItem('permission',this.loginForm.permission);
              //跳转首页
              let path = this.$route.query.redirect;
              this.$router.replace((path == '/' || path == undefined) ? '/home' : path);

            }
          })
        } else {
          this.$message.error('输入不能为空！');
          return false;
        }
      });
    }
  }
}
</script>

<style>
.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 15px 35px 15px 35px;
  background: aliceblue;
  border: 1px solid #4697cb;
  box-shadow: black;

}

.loginTitle {
  margin: 0 auto 40px auto;
  text-align: center;
}

.loginRemember {
  text-align: left;
  margin: 0 0 15px 0;
}

.el-form-item__content {
  display: flex;
  align-items: center;
}

.register {
  margin-top: 10px;
  font-size: 14px;
  line-height: 22px;
  color: #1ab2ff;
  cursor: pointer;
  text-align: left;
  text-indent: 8px;
  width: 160px;
}
</style>