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
    },
    // 课程列表回显功能实现
    getCourse(courseId){
        return request({
            url:`/eduservice/edu-course/getCourseInfo/${courseId}`,
            method:'get'
        })
    },
    // 修改课程信息
    updateCourse(courseId,courseInfo){
        return request({
            url:`/eduservice/edu-course/updateCourseInfo/${courseId}`,
            method:'put',
            data:courseInfo
        })
    },
    // 课程的最终体现
    getCoursePublish(courseId){
        return request({
            url:`/eduservice/edu-course/getCoursePublish/${courseId}`,
            method:'get'
        })
    },
    // 课程的发布成功
    CourseRelease(courseId){
        return request({
            url:`/eduservice/edu-course/CourseRelease/`+courseId,
            method:'put'
        })
    },
    // 带查询条件的课程列表展示
    pageCourseCondition(current,limit,courseQuery){
        return request({
            url:`/eduservice/edu-course/pageCourseCondition/${current}/${limit}`,
            method:`post`,
            data:courseQuery
        })
    },
    // 删除课程
    deleteCourse(courseId){
        return request({
            url:`/eduservice/edu-course/deleteCourse/${courseId}`,
            method:`delete`
        })
    }
    
}