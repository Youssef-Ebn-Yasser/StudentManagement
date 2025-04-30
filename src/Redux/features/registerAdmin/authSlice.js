import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const registerAdmin= createAsyncThunk(
    'auth/RegisterAdmin',
    async (formsData, {rejectWithValue})=>{
       try{
        const response = await axios.post('http://e-learn-v1.runasp.net/api/Auth/register/admin', formsData)
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


const getTokenFromLocalStorage = () => {
    try {
        return localStorage.getItem('userToken');
    } catch (e) {
        console.error("Could not access localStorage", e);
        return null;
    }
};

//create the slice

const authSlice = createSlice({
    name:'auth',
    initialState:{
        userToken: getTokenFromLocalStorage(),
        loading:false,
        error:null
    },

    reducers:{},

    extraReducers:(builder)=>{
        builder.addCase(registerAdmin.pending,(state)=>{
            state.loading=true;
            state.error=null
        })
        builder.addCase(registerAdmin.fulfilled,(state,action)=>{
            state.loading=false;
            state.userToken= action.payload.token
            localStorage.setItem('userToken', action.payload.token);
        })
        builder.addCase(registerAdmin.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload
        })
    }
})

export default authSlice.reducer;
