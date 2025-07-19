import { createAsyncThunk } from '@reduxjs/toolkit';
import
  {
    getJWTToken,
    getUser
  } from '@/services/auth';
import { authStorage } from '@/utils/authStorage';

// Async thunks for API calls

export const fetchJWTToken = createAsyncThunk('auth/getJWTToken', async (userId, { rejectWithValue }) => {
  try {
    const response = await getJWTToken(userId);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const fetchUser = createAsyncThunk('auth/getUser', async () => {
  try {
    const response = await getUser();
    return response.data;
  } catch (error) {
    return error.response.data;
  }
});

export const authorizeBuilder = (builder) => {
    builder
        .addCase(fetchUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.isLogedin = true

            state.role = action.payload?.roles[0]

            
        })
        .addCase(fetchUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            // Don't clear user state on error to prevent logout
            // Only clear if explicitly needed
        });

    builder
        .addCase(fetchJWTToken.pending, (state) => {
            // state.loading = true;
            state.error = null;
        })
        .addCase(fetchJWTToken.fulfilled, (state, action) => {
            // state.loading = false;
            state.token = action.payload;
            authStorage.setAuthData({ token: action.payload });
        })
        .addCase(fetchJWTToken.rejected, (state, action) => {
            // state.loading = false;
            state.error = action.payload;
        });
};
