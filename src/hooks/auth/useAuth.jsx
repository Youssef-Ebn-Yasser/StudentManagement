import { setAuthToken } from '@/helpers/auth';
import { fetchJWTToken, fetchUser } from '@/Redux/auth/authorizeAcions';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useAuth = () => {
    const authStore = useSelector((state) => state.auth)
    const dispatch = useDispatch()



    useEffect(() => {
    
        dispatch(fetchUser())
        .then((response) => {
            const userId = response?.payload?.id;
            if (!userId) {
                return;
            }
            setAuthToken()
            
        }
        )
        .catch((error) => {
            console.error('Error fetching user data:', error);
        });

    }, [])
  



    return {
        user: authStore?.user,
        isLogedin: authStore?.isLogedin,
        // role
    }
}
export default useAuth
