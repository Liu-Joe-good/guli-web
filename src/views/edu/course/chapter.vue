<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps
      :active="2"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>
    <!-- 添加章节按钮 -->
    <el-button type="text" @click="addChapterForm">添加章节</el-button>
    <!-- 添加和修改章节表单，即弹框 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加或修改章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title" />
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number
            v-model="chapter.sort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title" />
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number
            v-model="video.sort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API + '/eduVod/video/UploadVideo'"
            :limit="1"
            class="upload-demo"
          >
            <!-- :on-success为当上传成功时，:on-remove为当删除，:on-exceed为当上传为多个时之前提示，:file-list为文件列表，:limit为默认上传个数 -->
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">
                最大支持1G，<br />
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br />
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br />
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br />
                SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>
              <i class="el-icon-question" />
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 章节小节显示 -->
    <el-form label-width="120px">
      <el-form-item label="章节课时"> </el-form-item>
      <ul>
        <li v-for="chapter in chapters" :key="chapter.id">
          {{ chapter.title }}
          <span class="acts">
            <!-- 添加小节按钮 -->
            <el-button type="text" @click="addVideoForm(chapter.id)"
              >添加课时</el-button
            >
            <el-button
              style=""
              type="text"
              @click="updateChapterForm(chapter.id)"
              >编辑</el-button
            >
            <el-button type="text" @click="deleteChapterForm(chapter.id)"
              >删除</el-button
            >
          </span>
          <ul>
            <li v-for="video in chapter.list" :key="video.id">
              {{ video.title }}
              <span class="acts">
                <el-button
                  style=""
                  type="text"
                  @click="updateVideoForm(video.id)"
                  >编辑</el-button
                >
                <el-button type="text" @click="deleteVideoForm(video.id)"
                  >删除</el-button
                >
              </span>
            </li>
          </ul>
        </li>
      </ul>
      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next"
          >下一步</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import chapter from "@/api/edu/chapter.js";
import course from "@/api/edu/course.js";
import video from "@/api/edu/video.js";
export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      chapters: [], // 数组用【】 对象用{} 属性用“”
      chapter: {
        title: "",
        sort: 0,
        //id:"",
        list: [], // 这里的属性怎么弄？一定对应后端的实体类  增加章节出现问题？调用API名字写错，后端入参有问题
      },
      video: {
        title: "",
        sort: 0,
        isFree: 0,
        id: "",
        videoSourceId:"",
        videoOriginalName:""
      },
      courseid: "",
      dialogChapterFormVisible: false,
      dialogVideoFormVisible: false,
      BASE_API: process.env.BASE_API, // 接口API地址
      // 上传视频后的信息
      fileList: [],
    };
  },
  created() {
    // 如果有参数，且参数不为空,获取url上传的参数
    if (this.$route.params && this.$route.params.id) {
      this.courseid = this.$route.params.id;
      // 调用方法显示章节和小节
      this.GetChapterandVideoList();
      //this.getVideoList();
    }
  },
  methods: {
    previous() {
      console.log("previous");
      this.$router.push({ path: "/course/info/" + this.courseid });
    },
    next() {
      console.log("next");
      this.$router.push({ path: "/course/publish/" + this.courseid });
    },
    // 上传成功
    handleVodUploadSuccess(Response,file,fileList) {
      // 里面后面两个参数暂时没用到
      this.video.videoSourceId = Response.data.videoId;
      this.video.videoOriginalName=file.name;
    },
    // 当上传为多个时之前提示
    handleUploadExceed(files,fileList) {
      this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },
    handleVodRemove(){
      // 调用接口删除的方法
      video.deleteVideoByMV(this.video.videoSourceId).then(Response=>{
        // 提示信息
        this.$message({
          type: "SUCCESS",
          message: "删除视频成功"
        });
      })
      // 万一接口删除方法没成功，也可清空videoSourceId
      this.fileList=[];
      // bug（已解决）:删除后videoSourceId还会存入数据库中不会清掉
      this.video.videoSourceId = "";
      this.video.videoOriginalName="";
    },
    beforeVodRemove(file,fileList){
      return this.$confirm(`确认移除${file.name}?`)
    },
    // 增加章节弹框
    addChapterForm() {
      (this.dialogChapterFormVisible = true),
        (this.chapter.title = ""),
        (this.chapter.sort = 0);
    },
    // 修改章节弹框
    updateChapterForm(chapterId) {
      // 这个入参不能写chapter.id,故入参名做了更改
      // 在修改框必须传值下来，方法内也得写入参，
      this.dialogChapterFormVisible = true;
      // 回显章节
      chapter.getChapter(chapterId).then((Response) => {
        this.chapter = Response.data.eduChapter;
      });
    },
    deleteChapterForm(chapterId) {
      this.$confirm('章节下面所有小节都会删除,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            chapter.deleteChapter(chapterId).then((Response) => {
            // 提示信息
            this.$message({
              type: "SUCCESS",
              message: "删除章节成功",
            });
            // 刷新,此处必须写在deleteChapter方法里面，不然不会执行
            this.GetChapterandVideoList();
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });


      
    },
    // 获取章节列表
    GetChapterandVideoList() {
      chapter.GetChapterandVideoList(this.courseid).then((Response) => {
        this.chapters = Response.data.allChapterandVideoList; // 搞错去掉了S，导致出现问题，传的为对象，实际本身是数组
      });
    },
    // 增加章节
    addChapter() {
      // 此处必须传courseID,否则会报错，且必须在该方法前执行
      this.chapter.courseId = this.courseid;
      chapter.addChapter(this.chapter).then((Response) => {
        // 取消弹框
        this.dialogChapterFormVisible = false;
        // 提示信息
        this.$message({
          type: "SUCCESS",
          message: "添加章节成功",
        });
        // 刷新
        this.GetChapterandVideoList();
      });
    },
    // 修改章节
    updateChapter() {
      chapter.updateChapter(this.chapter.id, this.chapter).then((Response) => {
        // 取消弹框
        this.dialogChapterFormVisible = false;
        // 提示信息
        this.$message({
          type: "SUCCESS",
          message: "修改章节成功",
        });
        // 刷新
        this.GetChapterandVideoList();
      });
    },
    // 弹框确定按钮
    saveOrUpdate() {
      if (this.chapter.id != null) {
        // 此处不能为chapterId,与回显方法相比较，在方法里用this，但接收@click传下的值时不用this
        // 为啥此处this.chapter.id有值呢？因为回显功能最先执行，获取了：key中的chapter.id
        this.updateChapter();
      } else {
        this.addChapter();
      }
    },
    /**-----------------------------小节方法---------------------------------------- */
    // 获取小节列表
    getVideoList() {
      console.log("?");
      
      video.getVideoList(this.courseid).then((Response) => {
        for (var i = 0; i < this.chapters.length; i++) {
          console.log(this.video.chapterId);
          console.log(this.chapters[i].chapterId);
          console.log(Response.data.VideoVoList);
          if (this.video.chapterId === this.chapters[i].chapterId) {
            this.chapters[i].list = Response.data.VideoVoList;
          }
        }
      });
    },
    // 添加小节
    addVideo() {
      video.addVideo(this.video).then((Response) => {
        this.dialogVideoFormVisible = false;
        this.$message({
          type: "SUCCESS",
          message: "添加小节成功",
        });
        this.GetChapterandVideoList(); // 为何此处刷新时用章节的，而不用小节？
      });
    },
    // 增加小节按钮
    addVideoForm(chapterId) {
      this.dialogVideoFormVisible = true;
      this.video = {}; // 写错了video为对象而不是数组【】
      this.video.courseId = this.courseid;
      this.video.chapterId = chapterId;
    },
    // 删除小节
    deleteVideoForm(videoId) {
      video.deleteVideo(videoId).then((Response) => {
        this.$message({
          type: "SUCCESS",
          message: "删除小节成功",
        });
        this.GetChapterandVideoList();
      });
    },
    // 回显小节详细信息
    updateVideoForm(videoId) {
      this.dialogVideoFormVisible = true;
      video.getVideo(videoId).then((Response) => {
        this.video = Response.data.eduVideo;
      });
    },
    // 修改小节
    updateVideo() {
      video.updateVideo(this.video.id,this.video).then((Response) => {
        console.log("OK");
        this.$message({
          type: "SUCCESS",
          message: "修改小节成功",
        });
        this.GetChapterandVideoList();
        this.dialogVideoFormVisible = false;
      });
    },
    // 保持和修改按钮
    saveOrUpdateVideo() {
      if (this.video.id != null) {
        this.updateVideo();
      } else {
        this.addVideo();
      }
    },
  },
};
</script>