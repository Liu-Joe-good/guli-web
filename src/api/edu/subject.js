import request from '@/utils/request'
export default{
    //讲师列表
    getSubjectList(){
        return request({
            url:`/eduservice/edu-subject/getSubjectList`,
            method:'get',
        })
    },
    
}