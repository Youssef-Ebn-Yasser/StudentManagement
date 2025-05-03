import axiosInstance from './axiosInstance'

export const login = async (data) => {
    const res = await axiosInstance.post('/api/Auth/login', data)
    return res.data
}

export const registerAdmin = async (data) => {
    const res = await axiosInstance.post('/api/Auth/register/admin', data)
    return res.data
}

export const confirmEmail = async ({ userId, token }) => {
    const queryString = new URLSearchParams({
        userId,
        token,
    }).toString()
    const res = await axiosInstance.post(
        `/api/Auth/confirm-email?${queryString}`
    )
    return res.data
}

export const registerStudent = async (data) => {
    const res = await axiosInstance.post('/api/Auth/register/student', data)
    return res.data
}

export const registerTeacher = async (data) => {
    const res = await axiosInstance.post('/api/Auth/register/teacher', data)
    return res.data
}

export const getRefreshToken = async (data) => {
    const res = await axiosInstance.post('/api/Auth/GetRefreshToken', data)
    return res.data
}

export const getJWTToken = async (userId) => {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
        throw new Error('No refresh token found')
    }
    const res = await axiosInstance.get(
        `/api/Auth/GetJWTToken?userId=${userId}`,
        {
            headers: {
                refreshToken: refreshToken,
            },
        }
    )
    return res.data
}

export const getUser = async (exRefreshToken) => {
     let refreshToken = exRefreshToken
    if(!refreshToken) {
        refreshToken = localStorage.getItem('refreshToken')
    }
    if (!refreshToken) {
        throw new Error('No refresh token found')
    }
  
    const res = await axiosInstance.get(
        `/api/Auth/GetUserByToken`,
        {
            headers: {
                refreshToken: refreshToken,
            },
        }
    )
    return res.data
}
