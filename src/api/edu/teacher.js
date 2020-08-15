import request from '@/utils/request'
export default{
    //讲师列表
    getTeacherListPage(current,limit,teacherQuery){
        return request({
            url:`/eduservice/edu-teacher/pageTeacherCondition/${current}/${limit}`,
            method:'post',
            // 后端是通过requestBody获取json数据
            // 而data表示把对象转化为json数据传递到接口里面
            data:teacherQuery
        })
    },
    // 删除教师
    deleteTeacherById(id){
        return request({
            url:`/eduservice/edu-teacher/deleteTeacherById/${id}`,
            method:'delete'
        })
    },
    // 新增教师信息
    AddTeacher(eduTeacher){
        return request({
            url:`/eduservice/edu-teacher/addTeacher`,
            method:'post',
            data:eduTeacher
        })
    },
    // 数据回显
    getTeacherInfo(id){
        return request({
            url:`/eduservice/edu-teacher/getTeacherById/${id}`,
            method:'get'
        })
    },
    // 修改教师
    updateTeacher(id,eduTeacher){
        return request({
            url:`/eduservice/edu-teacher/updateTeacher/${id}`,
            method:'put',
            data:eduTeacher
        })
    }
}