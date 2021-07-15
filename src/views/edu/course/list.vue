<template>
  <div class="app-container">
    <!-- 弹框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>你确定要删除该课程吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="CourseFinal"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="courseQuery.title" placeholder="课程名" />
      </el-form-item>

      <el-form-item>
        <el-select
          v-model="courseQuery.status"
          clearable placeholder="课程状态"
        >
          <el-option value="Draft" label="未发布" />
          <el-option value="Normal" label="已发布" />
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="courseQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-form-item>
        <el-date-picker
          v-model="courseQuery.finish"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getList()"
        >查询</el-button
      >
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
    <el-table :data="list">
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">{{
          (page - 1) * limit + scope.$index + 1
        }}</template>
      </el-table-column>

      <el-table-column prop="title" label="课程名称" width="80" />

      <el-table-column label="课程状态" width="80">
        <template slot-scope="scope">{{
          scope.row.status === "Draft" ? "未发布" : "已发布"
        }}</template>
      </el-table-column>

      <el-table-column prop="lessonNum" label="总课时" width="160" />

      <el-table-column prop="price" label="课程销售价格" width="160" />

      <el-table-column prop="buyCount" label="销售数量" width="160" />

      <el-table-column prop="viewCount" label="浏览数量" width="160" />

      <el-table-column prop="gmtCreate" label="创建时间" width="160" />

      <el-table-column prop="gmtModified" label="更新时间" width="160" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/course/info/' + scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit"
              >编辑课程基本信息</el-button
            >
          </router-link>
          <router-link :to="'/course/chapter/' + scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit"
              >编辑课程大纲信息</el-button
            >
          </router-link>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
            >删除课程基本信息</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
    />
  </div>
</template>
<script>
import course from "@/api/edu/course.js";
export default {
  data() {
    return {
      list: null,
      total: 0,
      page: "",
      limit: 5,
      courseQuery: {
      },
      dialogVisible:false
    };
  },
  created(){
    this.getList()
  },
  methods:{
    getList(page = 1){ // 把样式的值为1取下来
      this.page=page // 把样式的值变为this.page的值
      course.pageCourseCondition(this.page,this.limit,this.courseQuery)
        .then(response => {
          this.total = response.data.total
          this.list = response.data.rows
        })
    },
    resetData() {
      // 清空查询条件
      this.courseQuery = {};
      // 显示列表
      this.getList();
    },
    removeDataById(id){
      this.dialogVisible=true
      this.list.id=id
    },
    CourseFinal(){
      course.deleteCourse(this.list.id).then(response=>{
          this.$message({
            type:"SUCCESS",
            message:"删除成功"
          })
          this.dialogVisible=false
          this.getList()
        })
    }
  }
};
</script>