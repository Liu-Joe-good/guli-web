<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps
      :active="3"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="发布课程" />
    </el-steps>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>你确定要发布课程吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="CourseFinal"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <div class="ccInfo">
      <img :src="coursePublish.cover" />
      <div class="main">
        <h2>{{ coursePublish.title }}</h2>
        <p class="gray">
          <span>共{{ coursePublish.lessonNum }}课时</span>
        </p>
        <p>
          <span
            >所属分类：{{ coursePublish.subjectLevelOne }} —
            {{ coursePublish.subjectLevelTwo }}</span
          >
        </p>
        <p>课程讲师：{{ coursePublish.teacherName }}</p>
        <h3 class="red">￥{{ coursePublish.price }}</h3>
      </div>
    </div>
    <div>
      <el-button @click="previous">返回修改</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="dialogVisible = true"
        >发布课程</el-button
      >
    </div>
  </div>
</template>
<script>
import course from "@/api/edu/course.js";
export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseId: "",
      coursePublish: {},
      dialogVisible:false
    };
  },
  created() {
    console.log("publish created");
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
      this.getCoursePublish();
    }
  },
  methods: {
    previous() {
      console.log("previous");
      this.$router.push({ path: "/course/chapter/" + this.courseId });
    },
    getCoursePublish() {
      course.getCoursePublish(this.courseId).then((Response) => {
        this.coursePublish = Response.data.coursePublish;
      });
    },
    CourseFinal(){
      this.dialogVisible=false
      course.CourseRelease(this.courseId).then((Response) => {
        this.$message({
          type:"SUCCESS",
          message:"发布课程成功"
        })
        this.$router.push({path:`/course/list`})
      });
    }
  },
};
</script>