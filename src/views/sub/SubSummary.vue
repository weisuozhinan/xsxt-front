<template>
  <div>
    <div v-if="user.permission==1">
      <div style="display: flex;justify-content: space-between">
        <div>
          <el-input style="width: 300px;margin-right: 10px" prefix-icon="el-icon-search"
                    v-model="subName" @keydown.enter.native="initSummary" clearable @clear="initSummary"
                    placeholder="请输入课题名称进行搜索..."></el-input>
          <el-button type="primary" icon="el-icon-search" @click="initSummary">搜索
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
        <el-table-column prop="name" label="课题名称" align="left"></el-table-column>
        <el-table-column prop="student.name" label="学生名称" align="left" v-if="permission==1"></el-table-column>
        <el-table-column prop="teacher.name" label="教师名称" align="left" v-if="permission==2"></el-table-column>
        <el-table-column prop="file.summaryTitle" label="状态" align="left">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.file.summaryTitle==null||scope.row.file.summaryTitle==''">待上传
            </el-tag>
            <el-tag type="success" v-else>已上传</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="file.summaryTitle" label="文件"></el-table-column>
        <el-table-column prop="file.summaryCreateTime" label="创建时间" align="left">
          <template slot-scope="scope">
            <p v-if="scope.row.file.summaryTitle!=null&&scope.row.file.summaryTitle!=''">
              {{ scope.row.file.summaryCreateTime }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="file.summaryScore" label="成绩" align="left"></el-table-column>
        <el-table-column label="操作" fixed="right" align="left" width="200px">
          <template slot-scope="scope">
            <el-upload
                :action="antionUrl"
                :headers="header"
                :data="scope.row.id"
                :show-file-list="false"
                :on-success="onSuccess">
              <el-button style="padding:3px" size="mini" type="primary" @click="updateUrl(scope.row)"
                         v-if="user.permission==2">上传
              </el-button>
            </el-upload>
            <el-button style="padding:3px" size="mini" type="primary" @click="exportData(scope.row)"
                       v-if="scope.row.file.summaryTitle!=0&&scope.row.file.summaryTitle!=null">下载
            </el-button>
            <el-button style="padding:3px" size="mini" type="danger"
                       @click="deleteSummaryFile(scope.row)"
                       v-if="scope.row.file.summaryTitle!=0&&scope.row.file.summaryTitle!=null">删除
            </el-button>
            <el-button style="padding:3px" size="mini" type="danger"
                       @click="showEditScoreView(scope.row)"
                       v-if="scope.row.studentId!=null&&scope.row.studentId!=0&&user.permission==1">编辑成绩
            </el-button>
          </template>
        </el-table-column>
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
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="30%">
      <div>
        <el-form ref="summaryForm"
                 :model="updateFile"
                 :rules="rules">
          <el-row>
            <el-col :span="9">
              <el-form-item label="总结报告成绩：" prop="summaryScore">
                <el-input size="small" style="width: 150px" v-model="updateFile.summaryScore"
                          placeholder="成绩"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doUpdateScore">确 定</el-button>
        </span>
    </el-dialog>

  </div>
</template>

<script>

export default {
  name: "Subsummary",
  data() {
    return {
      header: {
        Authorization: window.sessionStorage.getItem('tokenStr')
      },
      antionUrl: '',
      subs: [],
      loading: false,
      total: 0,
      dialogVisible: false,
      title: '',
      currentPage: 1,
      size: 10,
      subName: '',
      status: ['未开题', '待老师审核', '待管理员审核', '已开题', '已结题'],
      permission: JSON.parse(window.sessionStorage.getItem('permission')),
      // 文件上传
      sub: {
        id: null,
        name: '',
        teacherId: null,
        studentId: null,
        status: '',
        file: {
          codeCreateTime: null,
          codeLocation: null,
          codeScore: 0,
          codeTitle: null,
          comment: null,
          contentCreateTime: null,
          contentLocation: null,
          contentTitle: null,
          demandCreateTime: null,
          demandLocation: null,
          demandScore: 0,
          demandTitle: null,
          diaryCreateTime: null,
          diaryLocation: null,
          diaryScore: 0,
          diaryTitle: null,
          id: null,
          proposalCreateTime: null,
          proposalLocation: null,
          proposalScore: 0,
          proposalTitle: null,
          score: 0,
          summaryCreateTime: null,
          summaryLocation: null,
          summaryScore: 0,
          summaryTitle: null
        }
      },
      updateFile: {
        codeCreateTime: null,
        codeLocation: null,
        codeScore: 0,
        codeTitle: null,
        comment: null,
        contentCreateTime: null,
        contentLocation: null,
        contentTitle: null,
        demandCreateTime: null,
        demandLocation: null,
        demandScore: 0,
        demandTitle: null,
        diaryCreateTime: null,
        diaryLocation: null,
        diaryScore: 0,
        diaryTitle: null,
        id: null,
        proposalCreateTime: null,
        proposalLocation: null,
        proposalScore: 0,
        proposalTitle: null,
        score: 0,
        summaryCreateTime: null,
        summaryLocation: null,
        summaryScore: 0,
        summaryTitle: null
      },
      rules: {
        summaryScore: [
          {
            validator: (rule, value, cb) => {
              if (/^(([0-9]|1[0-9]|20))$/.test(value)) {
                cb()
              } else {
                cb(new Error('请输入0-20的整数'))
              }
            }
          },
        ]
      }
    };
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
    this.initSummary();
    this.initSummary();
  },

  methods: {
    exportData(data){
      this.downloadRequest('/file/export/summary/?fileId='+data.id);
    },
    doUpdateScore() {
      //编辑总结报告成绩信息
      this.$refs.summaryForm.validate((valid) => {
        if (valid) {
          this.putRequest('/file/', this.updateFile).then(resp => {
            if (resp) {
              Object.assign(this.sub.file, this.updateFile);
              this.dialogVisible = false;
              this.initSummary();
            }
          })
        }
      })
    },
    showEditScoreView(data) {
      this.title = '编辑总结报告成绩';
      this.sub = data;
      Object.assign(this.updateFile, data.file);
      this.dialogVisible = true;
    },
    deleteSummaryFile(data) {
      this.$confirm('此操作将永久删除总结报告文件，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/file/delete/summaryFile/' + data.id).then(resp => {
          if (resp) {
            this.initSummary();
          }
        })
      }).catch(() => {
        this.$message({
          type: "info",
          message: '已取消删除'
        })
      })
    },
    onSuccess() {
      this.initSummary();
      alert('更新成功！');
    },
    updateUrl(data) {
      this.sub = data;
      this.antionUrl = '/file/upload/summaryFile?subjectId=' + data.id + '&';
    },

    sizeChange(size) {
      this.size = size;
      this.initSummary();
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initSummary();
    },
    initSummary() {
      this.loading = true;
      let url = '';
      //alert('后面'+this.isHaveSubject);
      if (this.permission == 1) {
        url = '/subject/teacher/' + '?currentPage=' + this.currentPage + '&size=' + this.size + '&name=' + this.subName + '&teacherId=' + this.user.id + '&status=进行中';
      } else {
        url = '/subject/student/y/' + '?currentPage=' + this.currentPage + '&size=' + this.size + '&name=' + this.subName + '&studentId=' + this.user.id + '&status=进行中';
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