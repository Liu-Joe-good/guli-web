<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps
      :active="1"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>

    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input
          v-model="courseInfo.title"
          placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"
        />
      </el-form-item>

      <!-- 所属分类 TODO -->
      <el-form-item label="课程分类">
        <el-select
          @change="subjectLevelOneChanged"
          v-model="courseInfo.subjectParentId"
          placeholder="一级分类"
        >
          <el-option
            v-for="subjectParent in subjectParentList"
            :key="subjectParent.id"
            :label="subjectParent.title"
            :value="subjectParent.id"
          />
        </el-select>
        <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
          <el-option
            v-for="subject in subjectList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
          <!-- :key为唯一标识 :label为显示的数据，:value为实际的值 -->
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>

      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description" />
      </el-form-item>

      <!-- 课程封面-->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API + '/eduoss/fileoss'"
          class="avatar-uploader"
        >
          <img style="max-width:100%;max-height:100%" :src="courseInfo.cover" />
        </el-upload>
      </el-form-item>

      <!-- 课程价格 -->
      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />元
      </el-form-item>
      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate"
          >保存并下一步</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import course from "@/api/edu/course.js";
import subject from "@/api/edu/subject.js";
import Tinymce from "@/components/Tinymce";
export default {
  components: { Tinymce },
  data() {
    return {
      components: { Tinymce },
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseInfo: {
        // 里面的属性可写可不写
        title: "",
        subjectId: "", // 二级分类
        subjectParentId: "", // 一级分类
        teacherId: "",
        lessonNum: 0,
        description: "",
        cover: "/static/timg.jpg",
        price: 0,
      },
      teacherList: [], // 为集合或数组
      subjectParentList: [], // 为一级分类的数组或集合
      subjectList: [], // 为二级分类的数组或集合
      courseid: "",
      BASE_API: process.env.BASE_API, // 接口API地址,在config的dev.env.js中
    };
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseid = this.$route.params.id;
      // this.getCourse()
      this.getInfo();
      this.findAllTeacher();
    } else {
      console.log("info created");
      this.findAllTeacher();
      this.getSubjectList();
    }
  },
  watch: {
    $route(to, form) {
      this.courseInfo = {
        // 里面的属性可写可不写
        title: "",
        subjectId: "", // 二级分类
        subjectParentId: "", // 一级分类
        teacherId: "",
        lessonNum: 0,
        description: "",
        cover: "/static/timg.jpg",
        price: 0,
      };
    },
  },
  methods: {
    saveOrUpdate() {
      if (this.courseid) {
        course.updateCourse(this.courseid, this.courseInfo).then((response) => {
          console.log("实现了吗？")
          // 提示信息
          this.$message({
            type: "success",
            message: "修改课程成功",
          });
          // 跳转到第二步
          this.$router.push({
            path: `/course/chapter/` + this.courseid,
          });
        });
      } else {
        course.addCourse(this.courseInfo).then((response) => {
          // 提示信息
          this.$message({
            type: "success",
            message: "添加课程成功",
          });
          // 跳转到第二步
          this.$router.push({
            path: `/course/chapter/` + response.data.courseId,
          });
        });
      }
    },
    // 查询所有讲师
    findAllTeacher() {
      course.findAllTeacher().then((Response) => {
        this.teacherList = Response.data.items;
      });
    },
    // 查询所有一级分类
    getSubjectList() {
      subject.getSubjectList().then((Response) => {
        this.subjectParentList = Response.data.list;
      });
    },
    // 一二级分类联动
    subjectLevelOneChanged(value) {
      // 这个value可以直接用来获取,不必入参
      console.log(value);
      // value为一级分类的id值
      for (var i = 0; i < this.subjectParentList.length; i++) {
        // var没有默认值，要赋初始值
        // 获取一级分类id
        var subjectOne = this.subjectParentList[i].id;
        if (subjectOne === value) {
          this.subjectList = this.subjectParentList[i].children;
          this.courseInfo.subjectId = ""; // 把二级id值清空 data属性里面此值可写可不写的原因是v-model可以生成此值，但此行代码先于v-model实现，故此属性必须先在data中添加
        }
      }
    },
    // 导入图片成功后
    handleAvatarSuccess(res, file) {
      // res即response
      this.courseInfo.cover = res.data.url;
    },
    // 导入之前需要做的限制
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const size2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("只能为jpg格式");
      }
      if (!size2M) {
        this.$message.error("大小不超过2M");
      }
    },
    // 数据回显,使用下面的方法更合适
    // getCourse(){
    //   course.getCourse(this.courseid).then(Response=>{
    //     this.courseInfo=Response.data.CourseInfoVo
    //   })
    // },
    // 数据回显后课程第二个分类修改的话没有一二级联动，怎么实现二级联动第二个分类也有值？（因为回显的话@Change根本没执行，故只有分类id）
    getInfo() {
      // 里面调用了两个方法:
      // 第一步：第一个方法获取subjectId和subjectParentId
      // 第二步：第二个方法获取所有的当前subjectParentId和第一个方法的subjectParentId比对
      // 第三步：如果一样则把第二个方法的值提取出来。
      course.getCourse(this.courseid).then((Response) => {
        this.courseInfo = Response.data.CourseInfoVo;
        subject.getSubjectList().then((Response) => {
          this.subjectParentList = Response.data.list;
          for (let i = 0; i < this.subjectParentList.length; i++) {
            if (
              this.courseInfo.subjectParentId === this.subjectParentList[i].id
            ) {
              this.subjectList = this.subjectParentList[i].children;
            }
          }
        });
      });
    },
  },
};
</script>
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>