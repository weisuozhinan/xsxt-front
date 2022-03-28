<template>
  <div>
    <div>
      <div style="display: flex;justify-content: space-between">
        <div>
          <el-input style="width: 300px;margin-right: 10px" prefix-icon="el-icon-search"
                    v-model="subName" @keydown.enter.native="initSubs" clearable @clear="initSubs"
                    :disabled="showAdvanceSearchVisible"
                    placeholder="请输入课题名称进行搜索..."></el-input>
          <el-button type="primary" icon="el-icon-search" @click="initSubs" :disabled="showAdvanceSearchVisible">搜索
          </el-button>
          <el-button style="margin-left: 10px" type="primary"
                     @click="showAdvanceSearchVisible =!showAdvanceSearchVisible">高级搜索
          </el-button>
        </div>
        <div>
          <el-button type="primary" icon="el-icon-plus" @click="showAddSubView" v-if="permission!=2">添加课题</el-button>
        </div>
      </div>
    </div>

    <transition name="slide-fade">
      <div v-show="showAdvanceSearchVisible"
           style="border: 1px solid #4697cb;border-radius: 5px;box-sizing: border-box;padding: 5px;margin: 10px 0px">
        <el-row>
          <el-col :span="6">
            课题名称：
            <el-input size="mini" style="width: 180px" v-model="searchValue.name" placeholder="课题名称:"></el-input>
          </el-col>
          <el-col :span="6" v-if="permission!=1">
            教师：
            <el-select v-model="searchValue.teacherId" filterable size="mini" style="width: 200px" placeholder="教师名称">
              <el-option
                  v-for="item in teachers"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6" v-if="permission!=2">
            学生：
            <el-select v-model="searchValue.studentId" filterable size="mini" style="width: 200px" placeholder="学生名称">
              <el-option
                  v-for="item in students"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            状态：
            <el-select v-model="searchValue.status" size="mini" style="width: 200px" placeholder="状态">
              <el-option
                  v-for="item in status"
                  :key="item"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select>
          </el-col>

          <el-col :span="6">
            课题内容文件
            <el-select v-model="searchValue.contentFile" size="mini" style="width: 200px" placeholder="课题内容">
              <el-option
                  v-for="item in twoStatus"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-col>


          <el-col :span="10">
            创建日期：
            <el-date-picker
                v-model="searchValue.createDateScope"
                size="mini"
                type="daterange"
                value-format="yyyy-MM-dd"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
          </el-col>
          <el-col :span="5" :offset="4">
            <el-button size="mini" @click="resetAdvanceSerach">取消</el-button>
            <el-button @click="initSubs('advanced')" icon="el-icon-search" type="primary" size="mini">搜索</el-button>
          </el-col>
        </el-row>
      </div>
    </transition>

    <div style="margin-top: 10px">
      <el-table :data="subs"
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                @selection-change="handleSelectionChange"
                stripe border style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="课题名称" fixed align="left" width="100"></el-table-column>
        <el-table-column prop="teacher.name" label="教师名称" align="left" width="100"></el-table-column>
        <el-table-column prop="student.name" label="学生名称" align="left" width="180"></el-table-column>
        <el-table-column prop="status" label="状态" align="left" width="150">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status=='未开题'">未开题</el-tag>
            <el-tag type="danger" v-if="scope.row.status=='待老师审核'">待老师审核</el-tag>
            <el-tag type="danger" v-if="scope.row.status=='待管理员审核'">待管理员审核</el-tag>
            <el-tag type="success" v-if="scope.row.status=='已开题'">已开题</el-tag>
            <el-tag type="info" v-if="scope.row.status=='已结题'">已结题</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="课题内容" align="left" :show-overflow-tooltip="true"
                         width="150"></el-table-column>
        <el-table-column prop="file.contentTitle" label="课题内容文件" align="left" width="160">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.file.contentTitle==null||scope.row.file.contentTitle==''">待上传</el-tag>
            <el-tag type="success" v-else>已上传</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="file.proposalTitle" label="开题报告" align="left" width="160">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.file.proposalTitle==''||scope.row.file.proposalTitle==null">待上传
            </el-tag>
            <el-tag type="success" v-else>已上传</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="file.proposalScore" label="开题报告成绩" align="left" width="160"></el-table-column>
        <el-table-column prop="file.demandTitle" label="需求分析" align="left" width="160">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.file.demandTitle==null||scope.row.file.demandTitle==''">待上传</el-tag>
            <el-tag type="success" v-else>已上传</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="file.demandScore" label="需求分析成绩" align="left" width="160"></el-table-column>
        <el-table-column prop="file.DiaryFile" label="实践日记" align="left" width="160">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.file.diaryTitle==null||scope.row.file.diaryTitle==''">待上传</el-tag>
            <el-tag type="success" v-else>已上传</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="file.diaryScore" label="实践日记成绩" align="left" width="160"></el-table-column>
        <el-table-column prop="file.codeFile" label="代码检查" align="left" width="160">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.file.codeTitle==null||scope.row.file.codeTitle==''">待上传</el-tag>
            <el-tag type="success" v-else>已上传</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="file.codeScore" label="代码检查成绩" align="left" width="160"></el-table-column>
        <el-table-column prop="file.summaryTitle" label="总结报告" align="left" width="160">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.file.summaryTitle==null||scope.row.file.summaryTitle==''">待上传</el-tag>
            <el-tag type="success" v-else>已上传</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="file.summaryScore" label="总结报告成绩" align="left" width="160"></el-table-column>
        <el-table-column prop="file.score" label="总成绩" align="left" width="160"></el-table-column>
        <el-table-column prop="file.comment" label="评语" align="left" :show-overflow-tooltip="true" width="160"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" align="left" width="160"></el-table-column>
        <el-table-column prop="openDate" label="开题时间" align="left" width="160">
          <template slot-scope="scope">
            <p v-if="scope.row.status=='已开题'||scope.row.status=='已结题'">
              {{ scope.row.openDate }}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="left" width="200px">
          <template slot-scope="scope">
            <el-button @click="showEditSubView(scope.row)" style="padding:3px" size="mini" v-if="permission!=2&&scope.row.status!='已结题'">编辑
            </el-button>
            <el-button style="padding:3px" size="mini" type="primary" @click="auditByAdmin(scope.row)"
                       v-if="scope.row.status=='待管理员审核'&&permission==0">审核
            </el-button>
            <el-button style="padding:3px" size="mini" type="primary" @click="auditByTeacher(scope.row)"
                       v-if="scope.row.status=='待老师审核'&&permission==1">审核
            </el-button>
            <el-button @click="auditByStudent(scope.row)" style="padding:3px" size="mini" type="primary"
                       v-if="permission==2&&scope.row.status=='未开题'&&isHaveSubject=='true' ">申请开题
            </el-button>
            <el-button @click="deleteSub(scope.row)" style="padding:3px" size="mini" type="danger"
                       v-if="permission==1||permission==0">删除
            </el-button>
            <el-button @click="deleteSub(scope.row)" style="padding:3px" size="mini" type="danger"
                       v-if="permission==2&&isHaveSubject=='true'&&scope.row.status!='已结题' ">退选
            </el-button>
            <el-button @click="addSubjectByStudent(scope.row)" style="padding:3px" size="mini" type="primary"
                       v-if="permission==2&&scope.row.status=='未开题'&&isHaveSubject=='false' ">选题
            </el-button>

          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;justify-content: flex-end">
        <el-pagination
            background
            @current-change="currentChange"
            @size-change="sizeChange"
            layout="sizes, prev, pager, next, jumper, ->, total"
            :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="80%">
      <div>
        <el-form ref="subForm"
                 :model="sub"
                 :rules="rules">
          <el-row>
            <el-col :span="6">
              <el-form-item label="课题名称：" prop="name">
                <el-input size="mini" style="width: 150px" v-model="sub.name" placeholder="请输入课题名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="permission==0">
              <el-form-item label="教师名称" prop="teacher.name">
                <el-select v-model="sub.teacherId" filterable size="mini" style="width: 200px" placeholder="教师名称">
                  <el-option
                      v-for="item in teachers"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="permission==1">
              <el-form-item label="教师名称">
                <el-input size="mini" style="width: 150px" v-model="user.name" disabled placeholder="教师名称"></el-input>
              </el-form-item>
            </el-col>


          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="doAddSub">确 定</el-button>
  </span>
    </el-dialog>
    <div v-if="this.permission!=2">
      <el-button @click="deleteMany" size="small" style="margin-top: 8px" type="danger"
                 :disabled="this.multipleSelection.length==0">批量删除
      </el-button>
    </div>

  </div>
</template>

<script>
export default {
  name: "SubjectManage",
  data() {
    return {
      searchValue: {
        name: '',
        status: '',
        teacherId: null,
        studentId: null,
        createDateScope: null,
        contentFile: null
      },
      showAdvanceSearchVisible: false,
      title: '',
      subs: [],
      loading: false,
      total: 0,
      isHaveSubject: 'false',
      currentPage: 1,
      size: 10,
      subName: '',
      twoStatus: [{id: 0, name: "待上传"}, {id: 1, name: "已上传"}],
      dialogVisible: false,
      teachers: [],
      students: [],
      sub2: {
        id: null,
      },
      status: ['未开题', '待老师审核', '待管理员审核', '已开题', '已结题'],
      permission: JSON.parse(window.sessionStorage.getItem('permission')),
      sub: {
        id: null,
        name: '',
        content: '',
        contentFile: null,
        teacherId: null,
        studentId: null,
        status: '',
        proposalFile: null,
        proposalScore: null,
        demandFile: null,
        demandScore: null,
        isDiaryFile: null,
        diaryScore: null,
        codeFile: null,
        codeScore: null,
        summaryFile: null,
        score: null,
        summaryScore: null,
        comment: '',
        createDate: '',
        openDate: ''
      },
      multipleSelection: [],
      rules: {
        name: [
          {required: true, message: '请输入课题名称', trigger: 'blur'}
        ],
        teacherId: [
          {required: true, message: '请选择教师', trigger: 'blur'}
        ]
      }


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
    this.initSubs();
    this.initData();
  },
  methods: {
    //学生选题
    addSubjectByStudent(data){
      this.$confirm('此操作将选择课题 ' + data.name + '，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.sub = data;
        this.initData();
        this.sub.studentId =this.user.id;
        this.putRequest('/subject/', this.sub).then(resp => {
          if (resp) {
            this.isHaveSubject='true';
            window.sessionStorage.removeItem('isHaveSubject');
            this.initSubs();
          }
        })
      }).catch(() => {
        this.$message({
          type: "info",
          message: '已取消'
        })
      })
    },
    resetAdvanceSerach() {
      this.searchValue.name = '';
      this.searchValue.teacherId = null;
      this.searchValue.studentId = null;
      this.searchValue.status = null;
      this.searchValue.contentFile = null;
      this.stuName = '';
      this.showAdvanceSearchVisible = false;
      this.initSubs();
    },
    auditByTeacher(data) {
      this.sub = data;
      this.initData();
      this.sub.status = '待管理员审核';
      this.putRequest('/subject/', this.sub).then(resp => {
        if (resp) {
          this.dialogVisible = false;
          this.initSubs();
        }
      })
    },
    auditByStudent(data) {
      this.sub = data;
      this.initData();
      this.sub.status = '待老师审核';
      this.putRequest('/subject/', this.sub).then(resp => {
        if (resp) {
          this.dialogVisible = false;
          this.initSubs();
        }
      })
    },
    auditByAdmin(data) {
      this.sub = data;
      this.initData();
      this.sub.status = '已开题';
      this.putRequest('/subject/updateByAdmin/', this.sub).then(resp => {
        if (resp) {
          this.dialogVisible = false;
          this.initSubs();
        }
      })
    },
    showEditSubView(data) {
      this.title = '编辑课题信息';
      this.sub = data;
      this.initData();
      this.sub.teacherId = data.teacherId;
      this.dialogVisible = true;

    },
    deleteMany() {
      this.$confirm('此操作将永久删除 [' + this.multipleSelection.length + ']条数据，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = '?';
        this.multipleSelection.forEach(item => {
          ids += 'ids=' + item.id + '&';
        });
        this.deleteRequest('/subject/' + ids).then(resp => {
          if (resp) {
            this.initSubs();
          }
        })
      }).catch(() => {
        this.$message({
          type: "info",
          message: '已取消删除'
        })
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteSub(data) {
      if (this.permission == 2) {
        //学生退选课题
        this.$confirm('此操作将退选 ' + data.name + '，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest('/subject/deleteByStudent/' + data.id).then(resp => {
            if (resp) {
              window.sessionStorage.removeItem('isHaveSubject');
              this.isHaveSubject='false';
              this.initSubs();
            }
          })
        }).catch(() => {
          this.$message({
            type: "info",
            message: '已取消删除'
          })
        })
      } else {
        //管理员教师删除课题
        this.$confirm('此操作将永久删除 ' + data.name + '，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest('/subject/' + data.id).then(resp => {
            if (resp) {
              this.initSubs();
            }
          })
        }).catch(() => {
          this.$message({
            type: "info",
            message: '已取消删除'
          })
        })
      }
    },
    doAddSub() {
      //判断有无id，有id为编辑，无id为添加
      if (this.sub.id) {
        //编辑课题信息
        this.$refs['subForm'].validate(valid => {
          if (valid) {
            this.putRequest('/subject/', this.sub).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initSubs();
              }
            })
          }
        })
      } else {
        //添加课题
        this.$refs['subForm'].validate(valid => {
          if (valid) {
            if (this.permission == 1) {
              this.sub.teacherId = this.user.id;
            }
            this.postRequest('/subject/', this.sub).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initSubs();
              }
            })
          }
        })
      }
    },
    initData() {
      if (this.permission == 2 && this.user.id != null) {
        if (!window.sessionStorage.getItem('isHaveSubject')) {
          this.getRequest('/subject/students/' + this.user.id).then(resp => {
            if (resp) {
              if (resp.length != 0) {
                this.isHaveSubject = 'true';
              } else {
                this.isHaveSubject = 'false';
              }
            }
            window.sessionStorage.setItem('isHaveSubject', this.isHaveSubject);
          })
        } else {
          this.isHaveSubject =window.sessionStorage.getItem('isHaveSubject').toString();
        }
      }
      if (!window.sessionStorage.getItem('teachers')) {
        this.getRequest('/subject/teachers').then(resp => {
          if (resp) {
            this.teachers = resp.data;
            window.sessionStorage.setItem('teachers', JSON.stringify(resp));
          }
        })
      } else {
        this.teachers = JSON.parse(window.sessionStorage.getItem('teachers'));
      }


      if (!window.sessionStorage.getItem('students')) {
        this.getRequest('/subject/students').then(resp => {
          if (resp) {
            this.students = resp.data;
            window.sessionStorage.setItem('students', JSON.stringify(resp));
          }
        })
      } else {
        this.students = JSON.parse(window.sessionStorage.getItem('students'));
      }
      if (this.permission == 1) {
        this.sub.teacherId = this.user.id;
      }
    },
    showAddSubView() {
      this.title = '添加课题';
      this.sub = {
        id: null,
        name: '',
        content: '',
        teacherId: null,
        studentId: null,
        status: '',
        createDate: '',
        openDate: ''
      };
      this.dialogVisible = true;
    }
    ,
    sizeChange(size) {
      this.size = size;
      this.initSubs();
    }
    ,
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initSubs();
    }
    ,
    initSubs(type) {

      this.initData();
      this.loading = true;
      let url = '';

      if (this.permission == 0) {
        url = '/subject/admin/';
      } else if (this.permission == 1) {
        url = '/subject/teacher/';
      } else if (this.isHaveSubject=='true' &&(this.permission == 2) ) {
        url = '/subject/student/y/';
      } else {
        url = '/subject/student/n/'
      }
      url += '?currentPage=' + this.currentPage + '&size=' + this.size;
      //管理员
      if (type && type == 'advanced') {
        if (this.searchValue.status) {
          url += '&status=' + this.searchValue.status;
        }
        if (this.searchValue.contentFile) {
          url += '&contentFile=' + this.searchValue.contentFile;
        }
        if (this.searchValue.studentId && this.permission != 2) {
          url += '&studentId=' + this.searchValue.studentId;
        }
        if (this.searchValue.teacherId && this.permission != 1) {
          url += '&teacherId=' + this.searchValue.teacherId;
        }
        if (this.searchValue.createDateScope) {
          url += '&createDateScope=' + this.searchValue.createDateScope;
        }
        if (this.searchValue.name) {
          url += '&name=' + this.searchValue.name;

        }
      } else {
        url += '&name=' + this.subName;
      }
      if (this.permission == 0) {

      } else if (this.permission == 1) {
        url += '&teacherId=' + this.user.id;
      } else if (this.permission == 2) {
        url += '&studentId=' + this.user.id;
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
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .5s ease;
}

.slide-fade-leave-active {
  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */
{
  transform: translateX(10px);
  opacity: 0;
}
</style>