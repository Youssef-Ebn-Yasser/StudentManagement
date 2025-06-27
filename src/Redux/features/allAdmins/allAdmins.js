import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk to fetch all admins
export const allAdmins = createAsyncThunk(
  'allAdmins',
  async () => {
    try {
      const response = await axios.get('https://e-learn-v1.runasp.net/api/Authorize/admins');
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

const adminSlice = createSlice({
  name: 'allAdmins',
  initialState: {
    admins: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(allAdmins.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(allAdmins.fulfilled, (state, action) => {
      state.loading = false;
      state.admins = action.payload;
    });
    builder.addCase(allAdmins.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    });
  }
});

export default adminSlice.reducer;