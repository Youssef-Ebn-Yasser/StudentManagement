import { createAsyncThunk } from '@reduxjs/toolkit'
import {
    registerStudent,
    // registerAdmin,
    // registerTeacher,
} from '@/services/auth'

// Only allow student registration for now
const registerFunc = (userType) => {
    switch (userType) {
        case 'student':
            return registerStudent
        // Uncomment below if you implement admin/teacher registration
        // case 'admin':
        //     return registerAdmin
        // case 'teacher':
        //     return registerTeacher
        default:
            throw new Error('Invalid user type')
    }
}

export const registerUser = createAsyncThunk(
    'auth/register',
    async ({ data, userType }, { rejectWithValue }) => {
        try {
            const register = registerFunc(userType)
            const response = await register(data)
            // response is already res.data from the service
            return response
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message || 'Registration failed')
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
            // You can store user/token here if needed:
            // state.user = action.payload.data.userId
            // state.token = action.payload.data.token
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })
}