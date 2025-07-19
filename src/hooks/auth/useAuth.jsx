import { setAuthToken } from '@/helpers/auth';
import { fetchJWTToken, fetchUser } from '@/Redux/auth/authorizeAcions';
import axiosInstance from '@/services/axiosInstance';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authStorage } from '@/utils/authStorage';

const useAuth = () => {
    const authStore = useSelector((state) => state.auth)
    const dispatch = useDispatch()



    useEffect(() => {
        // Only fetch user if we have a refresh token and user is not already loaded
        const refreshToken = authStorage.getRefreshToken();
        const token = authStorage.getToken();
        
        if (!refreshToken || !token) {
            return;
        }
        
        // Restore token to axios instance if available
        if (token) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    
        // Only fetch user if we don't already have user data
        if (!authStore.user || !authStore.user.id) {
            dispatch(fetchUser())
            .then((response) => {
                const userId = response?.payload?.id;
                if (!userId) {
                    console.warn('No user ID in response');
                    return;
                }
                setAuthToken()
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
                // Don't clear auth state on error, let the user try again
            });
        } else {
            // User already loaded, just set up token refresh
            setAuthToken()
        }

    }, [])
  


   
    return {
        user: authStore?.user,
        isLogedin: authStore?.isLogedin,
        role: authStore?.role,
        loading: authStore?.loading,
        // role
    }
}
export default useAuth
