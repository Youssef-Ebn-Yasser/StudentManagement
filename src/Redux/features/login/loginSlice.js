import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const login= createAsyncThunk(
    'auth/Login',
    async (formsData, {rejectWithValue})=>{
       try{
        const response = await axios.post('http://e-learn-v1.runasp.net/api/Auth/login', formsData)
        return response.data
       }catch(error){
        if (error.response && error.response.data) {
            if (error.response.status === 409) {
              return rejectWithValue("The email or other data is duplicate.");
            } else {
              return rejectWithValue(error.response.data.message || "There are an error");
            }
          } else if (error.message) {
            return rejectWithValue(error.message); 
          } else {
            return rejectWithValue("Something went wrong");
          }
       }
    }
)

export const isTokenExpired = () => {
    const expiration = localStorage.getItem('expirationDate');
    if (!expiration) return true;
  
    const now = new Date().getTime();
    const expirationTime = new Date(expiration).getTime();
  
    return now > expirationTime; // true means expired
  };

const getTokenFromLocalStorage = () => {
    try {
        return localStorage.getItem('JWTToken');
    } catch (e) {
        console.error("Could not access localStorage", e);
        return null;
    }
};

//create the slice

const authSlice = createSlice({
    name:'login',
    initialState:{
        userToken: getTokenFromLocalStorage(),
        refreshToken:'',
        expirationDate:'',
        loading:false,
        error:null
    },

    reducers:{
        logout: (state) => {
            state.userToken = null;
            state.refreshToken = '';
            state.expirationDate = '';
            state.loading = false;
            state.error = null;
            localStorage.removeItem('JWTToken');
            localStorage.removeItem('userToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('expirationDate');
            localStorage.removeItem('userRole');
        },
    },

    extraReducers:(builder)=>{
        builder.addCase(login.pending,(state)=>{
            state.loading=true;
            state.error=null
        })
        builder.addCase(login.fulfilled,(state,action)=>{
            state.loading=false;
            state.userToken= action.payload.token
            localStorage.setItem('userToken', action.payload.data.token);

            state.refreshToken=action.payload.refreshToken
            state.expirationDate=action.payload.expiration

            localStorage.setItem('JWTToken', action.payload.token);
            localStorage.setItem('refreshToken', action.payload.refreshToken);
            localStorage.setItem('expirationDate', action.payload.expiration);

            // Set userRole in localStorage if present in response
            if (action.payload.data.role) {
              localStorage.setItem('userRole', action.payload.data.role);
            } else if (action.payload.data.roles && action.payload.data.roles.length > 0) {
              localStorage.setItem('userRole', action.payload.data.roles[0]);
            }
        })
        builder.addCase(login.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload
        })
    }
})

export const { logout } = authSlice.actions;
export default authSlice.reducer;
