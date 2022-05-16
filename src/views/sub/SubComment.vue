<template>
  <div>
    <div v-if="user.permission==1">
      <div style="display: flex;justify-content: space-between">
        <div>
          <el-input style="width: 300px;margin-right: 10px" prefix-icon="el-icon-search"
                    v-model="subName" @keydown.enter.native="initComment" clearable @clear="initComment"
                    placeholder="请输入课题名称进行搜索..."></el-input>
          <el-button type="primary" icon="el-icon-search" @click="initComment">搜索
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
        <el-table-column width="55" label="序号" fixed type="index" align="center"></el-table-column>
        <el-table-column prop="name" label="课题名称" fixed align="left"></el-table-column>
        <el-table-column prop="student.name" label="学生名称" align="left" v-if="permission==1"></el-table-column>
        <el-table-column prop="teacher.name" label="教师名称" align="left" v-if="permission==2"></el-table-column>
        <el-table-column prop="status" label="状态" align="left" width="150">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status=='未开题'">未开题</el-tag>
            <el-tag type="danger" v-if="scope.row.status=='待老师审核'">待老师审核</el-tag>
            <el-tag type="danger" v-if="scope.row.status=='待管理员审核'">待管理员审核</el-tag>
            <el-tag type="success" v-if="scope.row.status=='已开题'">已开题</el-tag>
            <el-tag type="info" v-if="scope.row.status=='已结题'">已结题</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="file.score" label="总成绩" align="left" width="160"></el-table-column>
        <el-table-column prop="file.proposalScore" label="开题报告成绩" align="left" width="160"></el-table-column>
        <el-table-column prop="file.demandScore" label="需求分析成绩" align="left" width="160"></el-table-column>
        <el-table-column prop="file.diaryScore" label="实践日记成绩" align="left" width="160"></el-table-column>
        <el-table-column prop="file.codeScore" label="代码检查成绩" align="left" width="160"></el-table-column>
        <el-table-column prop="file.summaryScore" label="总结报告成绩" align="left" width="160"></el-table-column>
        <el-table-column prop="file.comment" label="评语" align="left" width="160"></el-table-column>
        <el-table-column label="操作" fixed="right" align="left" width="200px">
          <template slot-scope="scope">
            <el-button style="padding:3px" size="mini" type="primary" @click="conclusiontByTeacher(scope.row)"
                       v-if="scope.row.status=='已开题'&&permission==1">结题
            </el-button>
            <el-button style="padding:3px" size="mini" type="danger"
                       @click="showEditCommentView(scope.row)"
                       v-if="user.permission==1&&scope.row.studentId!=null&&scope.row.studentId!=''">编辑评语
            </el-button>
            <el-button style="padding:3px" size="mini" type="danger"
                       @click="showEditCommentView(scope.row)"
                       v-if="user.permission==2">查看评语
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
        :model="updateFile"
        :visible.sync="dialogVisible"
        width="50%">
      <div label="评语内容：" prop="comment" v-if="this.permission==1">
        <el-input type="textarea" :rows="5" v-model="updateFile.comment"></el-input>
      </div>
      <div label="评语内容：" prop="comment" v-if="this.permission==2">
        <el-input type="textarea" :rows="5" disabled v-model="updateFile.comment"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false" v-if="this.permission==1">取 消</el-button>
        <el-button type="primary" @click="doUpdateComment" v-if="this.permission==1">确 定</el-button>
        <el-button type="primary" @click="dialogVisible=false" v-if="this.permission==2">关闭</el-button>
        </span>
    </el-dialog>

  </div>
</template>

<script>

export default {
  name: "SubComment",
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
    this.initComment();
    this.initComment();
  },

  methods: {
    conclusiontByTeacher(data){
      this.sub = data;
      this.sub.status = '已结题';
      console.log(this.sub);
      this.putRequest('/subject/', this.sub).then(resp => {
        if (resp) {
          this.dialogVisible = false;
          this.initSubs();
        }
      })
    },
    doUpdateComment() {
      //编辑实践日记成绩信息
          this.putRequest('/file/', this.updateFile).then(resp => {
            if (resp) {
              Object.assign(this.sub.file, this.updateFile);
              this.dialogVisible = false;
              this.initComment();
            }
          })
    },
    showEditCommentView(data) {
      if (this.permission == 1) {
        this.title = '编辑评语';
        this.sub = data;
        Object.assign(this.updateFile, data.file);
      } else if (this.permission == 2) {
        this.title = '评语';
        this.sub = data;
        Object.assign(this.updateFile, data.file);
      }
      this.dialogVisible = true;
    },
    sizeChange(size) {
      this.size = size;
      this.initComment();
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initComment();
    },
    initComment() {
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