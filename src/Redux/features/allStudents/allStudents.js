import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const allStudent = createAsyncThunk(
    'allStudent',
    async()=>{
        try{
            const response = await axios.get('https://e-learn-v1.runasp.net/api/Student/GetAll/GetAll')
            return response.data.data
        }catch(error){
            console.log(error)
        }

    }

)

const studentSlice = createSlice({
    name:'allStudents',
    initialState:{
        students:[],
        loading:false,
        error:null
    },
    reducers:{},

    extraReducers:(builder)=>{
        builder.addCase(allStudent.pending,(state)=>{
            state.loading=true;
            state.error=null
        })
        builder.addCase(allStudent.fulfilled,(state,action)=>{
            state.loading=false;
            state.students=action.payload
            console.log(action.payload);
            
        })
        builder.addCase(allStudent.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload
        })
    }
})

export default studentSlice.reducer;