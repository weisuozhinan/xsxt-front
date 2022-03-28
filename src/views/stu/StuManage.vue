<template>
  <div>
    <div>
      <div style="display: flex;justify-content: space-between">
        <div>
          <el-input style="width: 300px;margin-right: 10px" prefix-icon="el-icon-search"
                    v-model="stuName" @keydown.enter.native="initStus" clearable @clear="initStus"
                    :disabled="showAdvanceSearchVisible"
                    placeholder="请输入学生名称进行搜索..."></el-input>
          <el-button type="primary" icon="el-icon-search" @click="initStus" :disabled="showAdvanceSearchVisible">搜索
          </el-button>
          <el-button style="margin-left: 10px" type="primary"
                     @click="showAdvanceSearchVisible =!showAdvanceSearchVisible">高级搜索
          </el-button>
        </div>
        <div>
          <el-button type="primary" icon="el-icon-plus" @click="showAddStuView">添加学生</el-button>
        </div>
      </div>
    </div>
    <transition name="slide-fade">
      <div v-show="showAdvanceSearchVisible"
           style="border: 1px solid #4697cb;border-radius: 5px;box-sizing: border-box;padding: 5px;margin: 10px 0px">
        <el-row>
          <el-col :span="5">
            性别：
            <el-radio-group v-model="searchValue.gender" style="margin-top: 4px">
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
            </el-radio-group>
          </el-col>
          <el-col :span="5">
            学院：
            <el-input size="mini" style="width: 180px" v-model="searchValue.dept" placeholder="学院:"></el-input>
          </el-col>
          <el-col :span="5">
            专业：
            <el-input size="mini" style="width: 180px" v-model="searchValue.major" placeholder="专业:"></el-input>
          </el-col>
          <el-col :span="5" :offset="4">
            <el-button size="mini" @click="resetAdvanceSerach">取消</el-button>
            <el-button @click="initStus('advanced')" icon="el-icon-search" type="primary" size="mini">搜索</el-button>
          </el-col>
        </el-row>
      </div>
    </transition>
    <div style="margin-top: 10px">
      <el-table :data="students"
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                @selection-change="handleSelectionChange"
                stripe border style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="姓名" fixed align="left" width="100"></el-table-column>
        <el-table-column prop="gender" label="性别" align="left" width="50"></el-table-column>
        <el-table-column prop="phone" label="手机号码" align="left" width="180"></el-table-column>
        <el-table-column prop="dept" label="学院" align="left" width="150"></el-table-column>
        <el-table-column prop="major" label="专业" align="left" width="160"></el-table-column>
        <el-table-column label="操作" fixed="right" align="left" width="200px">
          <template slot-scope="scope">
            <el-button @click="showEditStuView(scope.row)" style="padding:3px" size="mini">编辑</el-button>
            <el-button @click="deleteStu(scope.row)" style="padding:3px" size="mini" type="danger">删除</el-button>
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
        <el-form ref="stuForm"
                 :model="stu"
                 :rules="rules">
          <el-row>
            <el-col :span="6">
              <el-form-item label="姓名" prop="name">
                <el-input size="mini" style="width: 150px" v-model="stu.name" placeholder="请输入姓名:"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="性别" prop="gender">
                <el-radio-group v-model="stu.gender" style="margin-top: 12px">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="用户名" prop="username">
                <el-input size="mini" style="width: 150px" v-model="stu.username" placeholder="请输入用户名:"></el-input>

              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="密码" prop="password">
                <el-input size="mini" style="width: 150px" v-model="stu.password" placeholder="请输入密码:"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="手机号码" prop="phone">
                <el-input size="mini" style="width: 150px" v-model="stu.phone" placeholder="请输入手机号码:"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="学院" prop="dept">
                <el-input size="mini" style="width: 150px" v-model="stu.dept" placeholder="请输入学院:"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="专业" prop="major">
                <el-input size="mini" style="width: 150px" v-model="stu.major" placeholder="请输入专业:"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="doAddStu">确 定</el-button>
  </span>
    </el-dialog>
    <div>
      <el-button @click="deleteMany" size="small" style="margin-top: 8px" type="danger"
                 :disabled="this.multipleSelection.length==0">批量删除
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "StuManage",
  data() {
    return {
      searchValue: {
        gender: '',
        major: '',
        dept: ''
      },
      showAdvanceSearchVisible: false,
      title: '',
      students: [],
      loading: false,
      total: 0,
      currentPage: 1,
      size: 10,
      stuName: '',
      dialogVisible: false,
      stu: {
        id: null,
        dept: '',
        gender: '男',
        major: '',
        name: '',
        password: '123',
        permission: 1,
        phone: '',
        username: ''
      },
      multipleSelection: [],
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
        ],
        dept: [
          {required: true, message: '请输入学院', trigger: 'blur'}
        ],
        major: [
          {required: true, message: '请输入专业', trigger: 'blur'}
        ],
      }
    }
  },
  mounted() {
    this.initStus();
  },

  methods: {
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
        this.deleteRequest('/student/' +ids).then(resp => {
          if (resp) {
            if (this.showAdvanceSearchVisible) {
              this.initStus('advanced');
            } else {
              this.initStus();
            }
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
    resetAdvanceSerach() {
      this.searchValue.gender = '';
      this.searchValue.dept = '';
      this.searchValue.major = '';
      this.stuName = '';
      this.showAdvanceSearchVisible = false;
      this.initStus();
    },
    showEditStuView(data) {
      this.title = '编辑学生信息';
      this.stu = data;
      if (this.showAdvanceSearchVisible) {
        this.initStus('advanced');
      } else {
        this.initStus();
      }
      this.dialogVisible = true;

    },
    deleteStu(data) {
      this.$confirm('此操作将永久删除 ' + data.name + '，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/student/' + data.id).then(resp => {
          if (resp) {
            if (this.showAdvanceSearchVisible) {
              this.initStus('advanced');
            } else {
              this.initStus();
            }
          }
        })
      }).catch(() => {
        this.$message({
          type: "info",
          message: '已取消删除'
        })
      })
    },
    doAddStu() {
      //判断有无id，有id为编辑，无id为添加
      if (this.stu.id) {
        //编辑学生信息
        this.$refs['stuForm'].validate(valid => {
          if (valid) {
            this.putRequest('/student/', this.stu).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                if (this.showAdvanceSearchVisible) {
                  this.initStus('advanced');
                } else {
                  this.initStus();
                }
              }
            })
          }
        })
      } else {
        //添加学生
        this.$refs['stuForm'].validate(valid => {
          if (valid) {
            this.postRequest('/student/', this.stu).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initStus();
              }
            })
          }
        })
      }

    },
    showAddStuView() {
      this.title = '添加学生';
      this.stu = {
        id: null,
        dept: '',
        gender: '男',
        major: '',
        name: '',
        password: '123',
        permission: 2,
        phone: '',
        username: ''
      },
          this.dialogVisible = true;
    },
    sizeChange(size) {
      this.size = size;
      if (this.showAdvanceSearchVisible) {
        this.initStus('advanced');
      } else {
        this.initStus();
      }

    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      if (this.showAdvanceSearchVisible) {
        this.initStus('advanced');
      } else {
        this.initStus();
      }
    },
    initStus(type) {
      this.loading = true;
      let url = '/student/?currentPage=' + this.currentPage + '&size=' + this.size;
      if (type && type == 'advanced') {
        if (this.searchValue.gender) {
          url += '&gender=' + this.searchValue.gender;
        }
        if (this.searchValue.dept) {
          url += '&dept=' + this.searchValue.dept;
        }
        if (this.searchValue.major) {
          url += '&major=' + this.searchValue.major;
        }
      } else {
        url += '&name=' + this.stuName;
      }
      this.getRequest(url).then(resp => {
        this.loading = false;
        if (resp) {
          this.students = resp.data;
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
  transition: all .3s ease;
}

.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */
{
  transform: translateX(10px);
  opacity: 0;
}
</style>
