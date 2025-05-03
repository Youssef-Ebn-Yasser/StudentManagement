import { createAsyncThunk } from '@reduxjs/toolkit';
import
    {
        registerAdmin,
        registerStudent,
        registerTeacher
    } from '@/services/auth';


export const registerAdminUser = createAsyncThunk('auth/registerAdmin', async (data, { rejectWithValue }) => {
  try {
    const response = await registerAdmin(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});


export const registerStudentUser = createAsyncThunk('auth/registerStudent', async (data, { rejectWithValue }) => {
  try {
    const response = await registerStudent(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const registerTeacherUser = createAsyncThunk('auth/registerTeacher', async (data, { rejectWithValue }) => {
  try {
    const response = await registerTeacher(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});



export const registerBuilder = (builder) => {
     builder
          .addCase(registerAdminUser.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(registerAdminUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
          })
          .addCase(registerAdminUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          });

           builder
                .addCase(registerStudentUser.pending, (state) => {
                  state.loading = true;
                  state.error = null;
                })
                .addCase(registerStudentUser.fulfilled, (state, action) => {
                  state.loading = false;
                  state.user = action.payload.user;
                  state.token = action.payload.token;
                })
                .addCase(registerStudentUser.rejected, (state, action) => {
                  state.loading = false;
                  state.error = action.payload;
                });
          
              builder
                .addCase(registerTeacherUser.pending, (state) => {
                  state.loading = true;
                  state.error = null;
                })
                .addCase(registerTeacherUser.fulfilled, (state, action) => {
                  state.loading = false;
                  state.user = action.payload.user;
                  state.token = action.payload.token;
                })
                .addCase(registerTeacherUser.rejected, (state, action) => {
                  state.loading = false;
                  state.error = action.payload;
                });

                
            }
