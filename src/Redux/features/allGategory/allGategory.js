import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/services/axiosInstance";


export const allGategory = createAsyncThunk(
    'allGategory',
    async(_,thunkAPI)=>{
        try{
            const response = await axiosInstance.get('https://e-learn-v1.runasp.net/api/Category/All')
            return response.data.data
        }catch(error){
            console.log(error)
            return thunkAPI.rejectWithValue(error.message)
        }

    }

)

const gategorySlice = createSlice({
    name:'allGategory',
    initialState:{
        gategory:'',
        loading:false,
        error:null
    },
    reducers:{},

    extraReducers:(builder)=>{
        builder.addCase(allGategory.pending,(state)=>{
            state.loading=true;
            state.error=null
        })
        builder.addCase(allGategory.fulfilled,(state,action)=>{
            state.loading=false;
            state.gategory=action.payload
            console.log(action.payload);
            
        })
        builder.addCase(allGategory.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload
            console.log(action.payload);
            
        })
    }
})

export default gategorySlice.reducer;