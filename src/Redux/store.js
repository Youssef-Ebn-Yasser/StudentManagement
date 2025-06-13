import { configureStore } from '@reduxjs/toolkit';
// import authSlice from '@/redux/auth/authSlice';
// import confirmEmailReducer from "@/redux/features/confirmEmail/confirmSlice";
// import loginReducer from "@/redux/features/login/loginSlice";
// import userDetailsReducer from './features/getUserDetails/userDetailsSlice';
import allStudentReducer from './features/allStudents/allStudents'
import allTeacherReducer from './features/allTeachers/allTeachers'
import allCoursesReducer from './features/allCourses/allCourses'
import allLessonsReducer from './features/allLessons/allLessons'
import allGategoryReducer from './features/allGategory/allGategory'
import authSlice from './auth/authSlice';
import teacherStatsReducer from '@/Redux/features/teacherStats/teacherStats';
import reviewAssignReducer from '@/Redux/features/reviewAssign/reviewAssign'

let store = configureStore({
    reducer: {
        // authTeacher: authReducerTeacher,
        // authStudent:authReducerStudent,
        // authAdmin:authReducerAdmin,
        // confirmEmail:confirmEmailReducer,
        // login:loginReducer,
        // expiration:expiredReducer,
        auth: authSlice,
        // userDetails: userDetailsReducer,
        allStudents:allStudentReducer,
        allTeachers:allTeacherReducer,
        allCourses:allCoursesReducer,
        allLessons:allLessonsReducer,
        allGategory:allGategoryReducer,
        teacherStats: teacherStatsReducer,
        reviewAssign:reviewAssignReducer,
    },
})
export default store
