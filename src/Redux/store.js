import { configureStore } from "@reduxjs/toolkit";
import  authReducerTeacher  from "./features/registerTeacher/authSlice";
import authReducerStudent from "./features/registerStudent/authSlice";
import authReducerAdmin from "./features/registerAdmin/authSlice";

let store = configureStore({
    reducer:{
        authTeacher: authReducerTeacher,
        authStudent:authReducerStudent,
        authAdmin:authReducerAdmin

    }
})
export default store;
