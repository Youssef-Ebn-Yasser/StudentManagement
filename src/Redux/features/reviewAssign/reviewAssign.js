import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const reviewAssign = createAsyncThunk(
  'reviewAssign',
  async (lessonId, { rejectWithValue }) => {
    if (!lessonId) {
      return rejectWithValue("lessonId is required");
    }
    try {
      const response = await axios.get(
        `https://e-learn-v1.runasp.net/api/Assignment/GetAssignmentByLessonId?lessonId=${lessonId}`
      );
      if (!response.data || !response.data.succeeded) {
        // Handle API-level errors
        return rejectWithValue(response.data?.messages?.[0] || "Failed to fetch assignments");
      }
      return response.data.data;
      
    } catch (error) {
      // Handle network or server errors
      const apiError =
        error.response?.data?.messages?.[0] ||
        error.response?.data?.massage ||
        error.response?.data?.error ||
        error.message ||
        "Unknown error";
      return rejectWithValue(apiError);
    }
  }
);

const assignSlice = createSlice({
  name: 'reviewAssign',
  initialState: {
    assignments: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(reviewAssign.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(reviewAssign.fulfilled, (state, action) => {
      state.loading = false;
      state.assignments = action.payload;
    });
    builder.addCase(reviewAssign.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
});

export default assignSlice.reducer;