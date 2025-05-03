import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'http://e-learn-v1.runasp.net',
    timeout: 10000, // Set a timeout for requests
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    withCredentials: false, // Disable sending cookies in cross-origin requests
})

// // Add a request interceptor
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     // Log the request for debugging
//     console.log('Making request to:', config.url, 'with method:', config.method);
//     return config;
//   },
//   (error) => {
//     console.error('Request Error:', error);
//     return Promise.reject(error);
//   }
// );

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // Log successful responses for debugging
        console.log('Response received:', response.status, response.config.url)
        return response
    },
    (error) => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Response Error:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers,
                url: error.config.url,
                method: error.config.method,
            })

            if (error.response.status === 401) {
                // Handle unauthorized access
                localStorage.removeItem('token')
                window.location.href = '/login'
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No Response Received:', {
                request: error.request,
                url: error.config.url,
                method: error.config.method,
            })
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Request Setup Error:', {
                message: error.message,
                url: error.config?.url,
                method: error.config?.method,
            })
        }
        return Promise.reject(error)
    }
)

export default axiosInstance
