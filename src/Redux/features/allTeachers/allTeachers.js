import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const allTeachers = createAsyncThunk(
    'allTeachers',
    async()=>{
        try{
            const response = await axios.get('https://e-learn-v1.runasp.net/api/Teacher/Teacher/All')
            return response.data.data
        }catch(error){
            console.log(error)
        }

    }

)

const teacherSlice = createSlice({
    name:'allTeachers',
    initialState:{
        teachers:[],
        loading:false,
        error:null
    },
    reducers:{},

    extraReducers:(builder)=>{
        builder.addCase(allTeachers.pending,(state)=>{
            state.loading=true;
            state.error=null
        })
        builder.addCase(allTeachers.fulfilled,(state,action)=>{
            state.loading=false;
            state.teachers=action.payload
            console.log(action.payload);
            
        })
        builder.addCase(allTeachers.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload
        })
    }
})

export default teacherSlice.reducer;