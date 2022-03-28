<template>
  <div>
    <el-card class="box-card" style="width: 300px">
      <div slot="header" class="clearfix">
        <span>{{ user.name }}</span>
      </div>
      <div class="text item">
        <div>手机号码:
          <el-tag type="success">{{ user.phone }}</el-tag>
        </div>
        <div>性别:
          <el-tag type="success">
            {{user.gender}}
          </el-tag>
        </div>
        <div v-if="permission!=0">
          <div>学院:
            <el-tag type="success">{{ user.dept }}</el-tag>
          </div>
          <div>专业:
            <el-tag type="success">{{ user.major }}</el-tag>
          </div>
        </div>
        <div style="display: flex;justify-content: space-around;margin-top: 10px">
          <el-button type="primary" @click="showUpdateUserView">修改信息</el-button>
        </div>
      </div>
    </el-card>
    <el-dialog
        title="编辑用户信息"
        :visible.sync="dialogVisible"
        width="30%">
      <div>
        <table>
          <tr>
            <td>用户名称</td>
            <td>
              <el-input v-model="user2.name"></el-input>
            </td>
          </tr>
          <tr>
            <td>手机号码</td>
            <td>
              <el-input v-model="user2.phone"></el-input>
            </td>
          </tr>
          <tr>
            <td>性别</td>
            <td>
              <el-radio-group v-model="user2.gender">
                <el-radio label="男"> </el-radio>
                <el-radio label="女"></el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr v-if="permission!=0">
            <td>学院</td>
            <td>
              <el-input v-model="user2.dept"></el-input>
            </td>
          </tr>
          <tr v-if="permission!=0">
            <td>专业</td>
            <td>
              <el-input v-model="user2.major"></el-input>
            </td>
          </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="updateUserInfo">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "InfMana",
  data() {
    return {
      user: null,
      user2: null,
      permission: 0,
      dialogVisible: false
    }
  },
  mounted() {
    this.initInfomaion();
  },
  methods: {
    updateUserInfo() {
      var url = '';
      if (this.permission == 0) {
        url = '/admin/';
      } else if (this.permission == 1) {
        url = '/teacher/';
      } else {
        url = '/student/';
      }
      this.putRequest(url, this.user2).then(resp => {
        if (resp) {
          this.dialogVisible = false;
          this.initInfomaion();
        }
      })
    },
    showUpdateUserView() {
      this.dialogVisible = true;
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
          this.user2 = Object.assign({}, this.user);
          window.sessionStorage.setItem('user', JSON.stringify(resp));
          this.$store.commit('INIT_USER', resp);
        }
      })
    }
  }
}
</script>

<style scoped>

</style>