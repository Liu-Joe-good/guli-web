import request from '@/utils/request'
export default{
    // 通过课程id获取章节小节列表
    GetChapterandVideoList(courseId){
        return request({
            url:`/eduservice/chapter/GetChapterandVideoList/${courseId}`,
            method:'get'
        })
    },
    // 增加章节
    addChapter(eduChapter){
        return request({
            url:`/eduservice/chapter/addChapter`,
            method:'post',
            data:eduChapter
        })
    },
    // 回显章节
    getChapter(ChapterId){
        return request({
            url:`/eduservice/chapter/getChapter/${ChapterId}`,
            method:'get'
        })
    },
     // 修改章节
     updateChapter(ChapterId,eduChapter){
        return request({
            url:`/eduservice/chapter/updateChapter/${ChapterId}`,
            method:'put',
            data:eduChapter
        })
    },
    // 删除章节
    deleteChapter(ChapterId){
        return request({
            url:`/eduservice/chapter/deleteChapter/${ChapterId}`,
            method:'delete'
        })
    },
}