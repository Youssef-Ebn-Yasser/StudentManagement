import { createAsyncThunk } from '@reduxjs/toolkit'
import {
    registerAdmin,
    registerStudent,
    registerTeacher,
} from '@/services/auth'

const registerFunc = (userType) => {
    switch (userType) {
        case 'admin':
            return registerAdmin
        case 'student':
            return registerStudent
        case 'teacher':
            return registerTeacher
        default:
            throw new Error('Invalid user type')
    }
}

export const registerUser = createAsyncThunk(
    'auth/register',
    async (data, userType, { rejectWithValue }) => {
        try {
          console.log('data', data, userType)
            const register = registerFunc(userType)
            const response = await register(data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const registerBuilder = (builder) => {
    builder
        .addCase(registerUser.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false
            // state.user = action.payload.user
            // state.token = action.payload.token
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })
}
