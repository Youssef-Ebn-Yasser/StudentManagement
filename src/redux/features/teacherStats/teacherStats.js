import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '@/config';

export const fetchTeacherStats = createAsyncThunk(
  'teacherStats/fetchTeacherStats',
  async () => {
    const response = await axios.get(`${API_URL}/Teacher/Stats`);
    return response.data;
  }
);

const teacherStatsSlice = createSlice({
  name: 'teacherStats',
  initialState: {
    stats: {
      totalStudents: 0,
      totalMaterials: 0,
      averageRating: 0
    },
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchTeacherStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default teacherStatsSlice.reducer; 