import request from '@/utils/request'
export default{
    // 新增课程列表
    addCourse(courseInfo){
        return request({
            url:`/eduservice/edu-course/addCourseInfo`,
            method:'post',
            data:courseInfo
        })
    },
    // 课程讲师列表
    findAllTeacher(){
        return request({
            url:`/eduservice/edu-teacher/findAll`,
            method:'get'
        })
    }
}