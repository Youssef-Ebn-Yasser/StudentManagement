import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const allCourses = createAsyncThunk(
    'allCourses',
    async()=>{
        try{
            const response = await axios.get('https://e-learn-v1.runasp.net/Course/GetAll')
            return response.data.data
        }catch(error){
            console.log(error)
        }

    }

)

const studentSlice = createSlice({
    name:'allCourses',
    initialState:{
        courses:[],
        loading:false,
        error:null
    },
    reducers:{},

    extraReducers:(builder)=>{
        builder.addCase(allCourses.pending,(state)=>{
            state.loading=true;
            state.error=null
        })
        builder.addCase(allCourses.fulfilled,(state,action)=>{
            state.loading=false;
            state.courses=action.payload
            console.log(action.payload);
            
        })
        builder.addCase(allCourses.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload
        })
    }
})

export default studentSlice.reducer;