import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const getUserDetails=createAsyncThunk(
    'auth/getUserDtails',
    async(_,{rejectWithValue})=>{
        const userId= localStorage.getItem('userId')

        if(!userId){
            return rejectWithValue('No user id found')
        }

        try{
            const response = await axios.get(`http://e-learn-v1.runasp.net/api/Teacher/Teacher/ById/${userId}`)
            return response.data
        }catch(error){
            if(error.response && error.response.data){
                if(error.response.status===404){
                    return rejectWithValue('User not found')
                }else{
                    return rejectWithValue(error.response.data.message || 'There are an error')
                }
            }else if(error.message){
                return rejectWithValue(error.message)
            }else{
                return rejectWithValue('Something went wrong')
                }
            }
        }
)

const userDetailsSlice= createSlice({
    name:'userDetails',
    initialState:{
        userData:null,
        loading:false,
        error:''
    },
    reducers:{},

    extraReducers:(builder)=>{
        builder.addCase(getUserDetails.pending,(state)=>{
            state.loading=true;
            state.error=null
        })
        builder.addCase(getUserDetails.fulfilled,(state,action)=>{
            state.loading = false;
            state.userData = action.payload;

        })
        builder.addCase(getUserDetails.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload
        })
    }
})

export default userDetailsSlice.reducer;

