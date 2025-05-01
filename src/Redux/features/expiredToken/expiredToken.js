import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const expiredToken= createAsyncThunk(
    'auth/expiredToken',
    async (_,{rejectWithValue})=>{
        const refreshToken = localStorage.getItem('refreshToken');  // Get the refresh token from localStorage

    if (!refreshToken) {
      return rejectWithValue('No refresh token available');
    }
        try{
            const response = await axios.get('http://e-learn-v1.runasp.net/api/Auth/GetRefreshToken',
                {params:{
                    refreshToken
                }
            }
            )
            localStorage.setItem('JWTToken', response.data.token);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('expirationDate', response.data.expiration);
            
            return response.data
        }catch(error){
            if (error.response && error.response.data) {
                if (error.response.status === 409) {
                  return rejectWithValue("The email or other data is duplicate.");
                  
                  
                } else {
                  return rejectWithValue(error.response?.data?.message || "There are an error");
                }
              } else if (error.message) {
                return rejectWithValue(error.message); 
              } else {
                return rejectWithValue("Something went wrong");
              }  
        }
    }
)

const expirationSlice= createSlice({
    name:'expiration',
    initialState:{
        refreshToken:'',
        loading:false,
        error:''
    },
    reducers:{},

    extraReducers:(builder)=>{
        builder.addCase(expiredToken.pending,(state)=>{
            state.loading=true;
            state.error=null
        })
        builder.addCase(expiredToken.fulfilled,(state,action)=>{
            state.loading = false;
            state.refreshToken= action.payload.refreshToken;

        })
        builder.addCase(expiredToken.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload
            localStorage.removeItem('JWTToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('expirationDate');
            localStorage.removeItem('userRole');
        })
    }
    
})