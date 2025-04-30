import { configureStore } from "@reduxjs/toolkit";
import  authReducer  from "./features/registerTeacher/authSlice";

let store = configureStore({
    reducer:{
        auth: authReducer
    }
})
export default store;
