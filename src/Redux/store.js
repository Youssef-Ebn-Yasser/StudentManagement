import { configureStore } from '@reduxjs/toolkit';
import authSlice from './auth/authSlice';
import confirmEmailReducer from "./features/confirmEmail/confirmSlice";
import loginReducer from "./features/login/loginSlice";
// import userDetailsReducer from './features/getUserDetails/userDetailsSlice';

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
    },
})
export default store
