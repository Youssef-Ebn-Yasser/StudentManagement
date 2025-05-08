import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const allLessons = createAsyncThunk(
    'allLessons',
    async()=>{
        try{
            const response = await axios.get('https://e-learn-v1.runasp.net/api/Lesson/GetLessonDetails/Get/All/Lessons')
            return response.data.data
        }catch(error){
            console.log(error)
        }

    }

)

const lessonSlice = createSlice({
    name:'allLessons',
    initialState:{
        lessons:[],
        loading:false,
        error:null
    },
    reducers:{},

    extraReducers:(builder)=>{
        builder.addCase(allLessons.pending,(state)=>{
            state.loading=true;
            state.error=null
        })
        builder.addCase(allLessons.fulfilled,(state,action)=>{
            state.loading=false;
            state.lessons=action.payload
            console.log(action.payload);
            
        })
        builder.addCase(allLessons.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload
        })
    }
})

export default lessonSlice.reducer;