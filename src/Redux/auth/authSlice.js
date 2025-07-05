import { createSlice } from '@reduxjs/toolkit'
import { loginBuilder } from './loginActions'
import { registerBuilder } from './registerActions'
import { authorizeBuilder } from './authorizeAcions'
import { confirmBuilder } from './confirmationAcions'
import { authStorage } from '@/utils/authStorage'

// Initial state
const initialState = authStorage.getInitialAuthState();

// Slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null
            state.refreshToken = null
            state.expirationDate = null
            state.token = null
            state.isLogedin = false
            state.role = null
            state.isAdmin = false
            state.isTeacher = false
            state.loading = false
            state.error = null
            
            // Clear all authentication-related localStorage items
            authStorage.clearAuthData()
        },
    },
    extraReducers: (builder) => {
        loginBuilder(builder)
        registerBuilder(builder)
        authorizeBuilder(builder)
        confirmBuilder(builder)
    },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
