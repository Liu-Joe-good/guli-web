<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name" />
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" min="0" />
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career" />
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea" />
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar" />
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像</el-button>

        <!--
        v-show：是否显示上传组件
        :key：类似于id，如果一个页面多个图片上传控件，可以做区分
        :url：后台上传的url地址
        @close：关闭上传组件
                @crop-upload-success：上传成功后的回调-->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/eduoss/fileoss'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import teacher from "@/api/edu/teacher.js"
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
export default {
  components:{
    ImageCropper,PanThumb
  },
  data() {
    return {
      teacher: {
        name: "",
        sort: 0,
        level: 1,
        career: "",
        intro: "",
        avatar: ""
      },
      saveBtnDisabled: false, // 是否可多次提交
      imagecropperShow:false,
      imagecropperKey:0,
      BASE_API:process.env.BASE_API // 组件帮忙把文件名也改了，防止中文
    };
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      const id = this.$route.params.id;
      this.getInfo(id);
    }
  },
  watch: {
    $route(to, form) {
      this.teacher = {};
    }
  },
  methods: {
    // 实现增添或修改教师信息
    saveOrUpdate() {
      if (!this.teacher.id) {
        this.AddTeacher();
      }else{
        console.log(this.id);
        this.update();
      }
    },
    // 增添教师
    AddTeacher() {
      teacher.AddTeacher(this.teacher).then(Response => {
        // 提示信息
        this.$message({
          Type: "success",
          message: "增添成功！"
        });
        // 回到讲师列表
        this.$router.push({
          path: "/teacher/table"
        });
      });
    },
    // 数据回显
    getInfo(id) {
      teacher
        .getTeacherInfo(id)
        .then(response => (this.teacher = response.data.eduteacher));
    },
    // 修改教师
    update() {
      teacher.updateTeacher(this.teacher.id, this.teacher).then(response => {
        // 提示信息
        this.$message({
          Type: "success",
          message: "修改成功！"
        }),
          this.$router.push({ path: "/teacher/table" });
      });
    },
    close(){
      this.imagecropperShow=false
      this.imagecropperKey=this.imagecropperKey+1 // 解决bug
    },
    cropSuccess(data){
      console.log("调这个？")
      this.imagecropperShow=false
      this.teacher.avatar=data.url
      this.imagecropperKey=this.imagecropperKey+1 // 解决bug
    }
  }
};
</script>