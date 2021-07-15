import request from '@/utils/request'
export default{
    // 通过课程id查询所有小节
    getVideoList(chapterId){
        return request({
            url:`/eduservice/edu-video/getVideoList/${chapterId}`,
            method:'get'
        })
    },
    // 增加小节
    addVideo(eduVideo){
        return request({
            url:`/eduservice/edu-video/addVideo`,
            method:'post',
            data:eduVideo
        })
    },
    // 回显小节
    getVideo(videoId){
        return request({
            url:`/eduservice/edu-video/getVideo/${videoId}`,
            method:'get'
        })
    },
     // 修改小节
     updateVideo(videoId,eduVideo){
        return request({
            url:`/eduservice/edu-video/updateVideo/${videoId}`,
            method:'put',
            data:eduVideo
        })
    },
    // 删除小节
    deleteVideo(videoId){
        return request({
            url:`/eduservice/edu-video/deleteVideo/${videoId}`,
            method:'delete'
        })
    },
    // 删除视频
    deleteVideoByMV(videoSourceId){
        return request({
            url:`/eduVod/video/deleteVideo/${videoSourceId}`,
            method:'delete'
        })
    }
}