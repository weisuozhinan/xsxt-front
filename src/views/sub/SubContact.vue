<template>
  <div>
    <div>
      <div style="display: flex;justify-content: space-between">
        <div>
          <el-input style="width: 300px;margin-right: 10px" prefix-icon="el-icon-search"
                    v-model="subName" @keydown.enter.native="initCont" clearable @clear="initCont"
                    placeholder="请输入课题名称进行搜索..."></el-input>
          <el-button type="primary" icon="el-icon-search" @click="initCont">搜索
          </el-button>
        </div>
      </div>
    </div>
    <div style="margin-top: 10px">
      <el-table :data="subs"
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                stripe border style="width: 100%">
        <el-table-column width="55" label="序号" type="index" align="center"></el-table-column>
        <el-table-column prop="name" label="课题名称"align="left" ></el-table-column>
        <el-table-column prop="status" label="状态" align="left" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status=='未开题'">未开题</el-tag>
            <el-tag type="danger" v-if="scope.row.status=='待老师审核'">待老师审核</el-tag>
            <el-tag type="danger" v-if="scope.row.status=='待管理员审核'">待管理员审核</el-tag>
            <el-tag type="success" v-if="scope.row.status=='已开题'">已开题</el-tag>
            <el-tag type="info" v-if="scope.row.status=='已结题'">已结题</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="student.name" label="学生名称" align="left" v-if="permission==1"></el-table-column>
        <el-table-column prop="teacher.name" label="教师名称" align="left" v-if="permission==2"></el-table-column>
        <el-table-column prop="student.phone" label="学生手机" align="left" v-if="permission==1"></el-table-column>
        <el-table-column prop="teacher.phone" label="教师手机" align="left" v-if="permission==2"></el-table-column>
        <el-table-column prop="student.dept" label="学生学院" align="left" v-if="permission==1"></el-table-column>
        <el-table-column prop="teacher.dept" label="教师学院" align="left" v-if="permission==2"></el-table-column>
        <el-table-column prop="student.major" label="学生专业" align="left" v-if="permission==1"></el-table-column>
        <el-table-column prop="teacher.major" label="教师专业" align="left" v-if="permission==2"></el-table-column>
      </el-table>
      <div style="display: flex;justify-content: flex-end">
        <el-pagination
            background
            @current-change="currentPage"
            @size-change="sizeChange"
            layout="sizes, prev, pager, next, jumper, ->, total"
            :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SubContact",
  data() {
    return {
      subs: [],
      loading: false,
      total: 0,
      currentPage: 1,
      size: 10,
      subName: '',
      status: ['未开题', '待老师审核', '待管理员审核', '已开题', '已结题'],
      permission: JSON.parse(window.sessionStorage.getItem('permission')),
      sub: {
        id: null,
        name: '',
        content: '',
        contentFile: null,
        teacherId: null,
        studentId: null,
        status: ''
      },
    }
  },
  computed: {
    routes() {
      return this.$store.state.routes;
    },
    user() {
      return this.$store.state.currentUser;
    }
  },
  mounted() {
    this.initCont();
  },

  methods: {

    sizeChange(size) {
      this.size = size;
      this.initCont();
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initCont();
    },
    initCont() {

      this.loading = true;
      let url = '';
      //alert('后面'+this.isHaveSubject);
      if(this.permission==1){
        url = '/subject/teacher/'+'?currentPage=' + this.currentPage + '&size=' + this.size+'&name=' + this.subName+'&teacherId=' + this.user.id;
      }else{
        url = '/subject/student/y/'+'?currentPage=' + this.currentPage + '&size=' + this.size+'&name=' + this.subName+'&studentId=' + this.user.id;
      }

      this.getRequest(url).then(resp => {
        this.loading = false;
        if (resp) {
          this.subs = resp.data;
          this.total = resp.total;
        }
      })
    }
  }

}
</script>

<style scoped>

</style>