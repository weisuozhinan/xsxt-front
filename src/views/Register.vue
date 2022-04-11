<template>
  <div>
    <el-form :rules="rules"
             v-loading="loading"
             element-loading-text="拼命加载中"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)"
             status-icon
             ref="registerFrom"
             :model="registerForm"
             class="registerContainer">
      <h3 class="registerTitle">用户注册</h3>
      <el-form-item prop="identity">
        <el-radio-group v-model="registerForm.permission">
          <el-radio :label="0">管理员</el-radio>
          <el-radio :label="1">教师</el-radio>
          <el-radio :label="2">学生</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="username">
        <el-input type="text" auto-complete="false" v-model="registerForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" auto-complete="false" v-model="registerForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input type="text" auto-complete="false" v-model="registerForm.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item prop="phone">
        <el-input type="text" auto-complete="false" v-model="registerForm.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>

      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="registerForm.gender">
            <el-radio label="男"> </el-radio>
            <el-radio label="女"></el-radio>
        </el-radio-group>
      </el-form-item>
        <el-button type="primary" style="width: 100%" @click="submitRegister('registerForm')">注册</el-button>
      <p class="login"  @click="gotoLogin()">立即登录</p>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      registerForm: {
        username: '',
        password: '',
        name:'',
        phone:'',
        permission: 0,
        gender: '男'
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
        name: [
          {required: true, message: '请输入姓名', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请输入手机号码', trigger: 'blur'},
          {
            validator: (rule, value, cb) => {
              if (/^1[3-9]\d{9}$/.test(value)) {
                cb()
              } else {
                cb(new Error('手机号格式错误'))
              }
            }
          },
        ]
      }
    };
  },
  methods: {
    submitRegister(){
      this.$refs.registerFrom.validate((valid)=>{
        if (valid){
          this.loading=true;
          if(this.registerForm.permission==0) {
            this.postRequest('/register/admin', this.registerForm).then(resp => {
              this.loading = false;
              if (resp) {
                alert("注册成功");
                this.gotoLogin();
              }
            })
          }else if(this.registerForm.permission==2) {
            this.postRequest('/register/student', this.registerForm).then(resp => {
              this.loading = false;
              if (resp) {
                alert("注册成功");
                this.gotoLogin();

              }
            })
          }else {
            this.postRequest('/register/teacher', this.registerForm).then(resp => {
              this.loading = false;
              if (resp) {
                alert("注册成功");
                this.gotoLogin();
              }
            })
          }
        }
      })
    },
    gotoLogin(){
      let path = this.$route.query.redirect;
      this.$router.replace((path == '/' || path == undefined) ? '/' : path)
    }
  }
}
</script>

<style>
.registerContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 15px 35px 15px 35px;
  background: aliceblue;
  border: 1px solid #4697cb;
  box-shadow: black;

}

.registerTitle {
  margin: 0 auto 40px auto;
  text-align: center;
}

.registerRemember {
  text-align: left;
  margin: 0 0 15px 0;
}

.el-form-item_content {
  display: flex;
  align-items: center;
}

.login {
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