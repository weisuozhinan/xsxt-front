<template>
  <div>
    <el-form :model="ruleForm"
             status-icon
             :rules="rules"
             ref="ruleForm"
             label-width="100px"
             class="demo-ruleForm">
      <el-form-item label="请输入旧密码" prop="oldPass">
        <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="请输入新密码" prop="newPass">
        <el-input type="password" v-model="ruleForm.newPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="请确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "PasMana",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.newPass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    return {

      user: null,
      permission: 0,

      ruleForm: {
        oldPass: '',
        newPass: '',
        checkPass: '',
        id: 2

      },
      rules: {
        oldPass: [
          {validator: validatePass, trigger: 'blur'}
        ],
        newPass: [
          {validator: validatePass, trigger: 'blur'}
        ],
        checkPass: [
          {validator: validatePass2, trigger: 'blur'}
        ]
      }
    };
  },
  mounted() {
    this.initInfomaion();
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //获取user的id
          this.ruleForm.id = Object.assign({}, this.user).id;
          var url = '';
          if (this.permission == 0) {
            url = '/admin/pass';
          } else if (this.permission == 1) {
            url = '/teacher/pass';
          } else {
            url = '/student/pass';
          }
          this.putRequest(url, this.ruleForm).then(resp => {
            if (resp) {
              this.postRequest('/logout');
              window.sessionStorage.removeItem('user');
              window.sessionStorage.removeItem('tokenStr');
              window.sessionStorage.removeItem('permissiom');
              this.$store.commit('initRoutes', []);
              this.$router.replace('/');

            }
          })
        } else {
          alert('修改失败');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    initInfomaion() {
      this.permission = window.sessionStorage.getItem('permission');
      var url = '';
      if (this.permission == 0) {
        url = '/admin/info';
      } else if (this.permission == 1) {
        url = '/teacher/info';
      } else {
        url = '/student/info';
      }
      this.getRequest(url).then(resp => {
        if (resp) {
          this.user = resp;
        }
      })
    }
  }
}
</script>

<style scoped>

</style>