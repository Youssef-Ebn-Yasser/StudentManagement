import axios from 'axios'

const isDevelopment = import.meta.env.DEV;
const baseURL = isDevelopment ? 'https://e-learn-v1.runasp.net' : 'https://e-learn-v1.runasp.net';

const axiosInstance = axios.create({
    baseURL,
    timeout: 10000, // Set a timeout for requests
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    withCredentials: false, // Disable credentials since backend doesn't support it
})

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log the request for debugging
    console.log('Making request to:', `${config.baseURL}${config.url}`, 'with method:', config.method);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
    (error) => {
    if (error.message === 'Network Error') {
      console.error('Network Error:', error);
      // You can add custom handling for network errors here
        }
    return Promise.reject(error);
    }
);

export default axiosInstance
