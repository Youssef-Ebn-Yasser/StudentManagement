import { createAsyncThunk } from '@reduxjs/toolkit';
import
    {
        confirmEmail
    } from '../../services/auth';

// Async thunks for API calls




export const confirmUserEmail = createAsyncThunk('auth/confirmEmail', async (
    { userId, token }
    , { rejectWithValue }) => {
  try {
    const response = await confirmEmail({ userId, token });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const confirmBuilder = (builder) => {
    builder
        .addCase(confirmUserEmail.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(confirmUserEmail.fulfilled, (state, action) => {
            state.loading = false;
           
        })
        .addCase(confirmUserEmail.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
}
