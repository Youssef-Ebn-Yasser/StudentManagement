import { createSlice } from '@reduxjs/toolkit'
import { loginBuilder } from './loginActions'
import { registerBuilder } from './registerActions'
import { authorizeBuilder } from './authorizeAcions'
import { confirmBuilder } from './confirmationAcions'

// Initial state
const initialState = {
    user: null,
    refreshToken: null,
    expirationDate: null,
    token: null,
    isLogedin: false,
    role: null,
    loading: false,
    error: null,
}

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
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('expirationDate')
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
