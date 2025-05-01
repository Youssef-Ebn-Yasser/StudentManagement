import { configureStore } from "@reduxjs/toolkit";
import  authReducerTeacher  from "./features/registerTeacher/authSlice";
import authReducerStudent from "./features/registerStudent/authSlice";
import authReducerAdmin from "./features/registerAdmin/authSlice";
// import confirmEmailReducer from "./features/confirmEmail/confirmSlice";
import loginReducer from "./features/login/loginSlice";
import expiredReducer from "./features/expiredToken/expiredToken";


let store = configureStore({
    reducer:{
        authTeacher: authReducerTeacher,
        authStudent:authReducerStudent,
        authAdmin:authReducerAdmin,
        // confirmEmail:confirmEmailReducer,
        login:loginReducer,
        expiration:expiredReducer


    }
})
export default store;
