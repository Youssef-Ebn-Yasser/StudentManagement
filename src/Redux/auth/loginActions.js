import { login, getUser } from '@/services/auth'
import axiosInstance from '@/services/axiosInstance'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const loginUser = createAsyncThunk(
    'auth/login',
    async (data, { rejectWithValue }) => {
        try {
            const tokensData = await login(data)
            const user = await getUser(tokensData.data.refreshToken)

            return {
                user: user.data,
                ...tokensData.data,
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
            axiosInstance.defaults.headers.common[
                'Authorization'
            ] = `Bearer ${action.payload.token}`
            localStorage.setItem('refreshToken', action.payload.refreshToken)
            localStorage.setItem('studentId', action.payload.user.id);
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })
}
