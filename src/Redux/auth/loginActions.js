import { login, getUser } from '@/services/auth'
import axiosInstance from '@/services/axiosInstance'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const loginUser = createAsyncThunk(
    'auth/login',
    async (data, { rejectWithValue }) => {
        try {
            const tokensData = await login(data)
            const user = await getUser(tokensData.data.refreshToken)

            // Check if user has admin or teacher role
            const isAdmin = user.data.roles.includes('Admin')
            const isTeacher = user.data.roles.includes('Teacher') || (user.data.email && user.data.email.toLowerCase().includes('teacher'))

            return {
                user: user.data,
                ...tokensData.data,
                isAdmin,
                isTeacher
            }
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const loginBuilder = (builder) => {
    builder
        .addCase(loginUser.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload.user
            state.token = action.payload.token
            // state.refreshToken = action.payload.refreshToken
            state.expirationDate = action.payload.expiration
            state.isLogedin = true
            state.role = action.payload.user.roles[0]
            state.isAdmin = action.payload.isAdmin
            state.isTeacher = action.payload.isTeacher
            axiosInstance.defaults.headers.common[
                'Authorization'
            ] = `Bearer ${action.payload.token}`
            localStorage.setItem('refreshToken', action.payload.refreshToken)
            // Store adminId instead of studentId for admin users
            if (action.payload.isAdmin) {
                localStorage.setItem('adminId', action.payload.user.id)
            } else {
                localStorage.setItem('guestId', action.payload.user.id)
            }
            localStorage.setItem('isAdmin', action.payload.isAdmin)
            localStorage.setItem('isTeacher', action.payload.isTeacher)
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })
}
