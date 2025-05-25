import { fetchJWTToken } from '@/Redux/auth/authorizeAcions'
import store from '@/Redux/store'

export const setAuthToken = () => {
    const checkAndRefreshToken = async () => {
        const state = store.getState()
        const { user, expirationDate: expirationDateStr, isLogedin } = state.auth

        // If user is not logged in or no expiration date, don't set up refresh
        if (!isLogedin || !expirationDateStr || !user?.id) {
            if (window.authRefreshTimer) {
                clearTimeout(window.authRefreshTimer)
            }
            return
        }

        const expirationDate = new Date(expirationDateStr)
        const currentDate = new Date()
        const timeUntilExpiry = expirationDate.getTime() - currentDate.getTime()

        // If token is already expired, try to refresh immediately
        if (timeUntilExpiry <= 0) {
            if (window.authRefreshTimer) {
                clearTimeout(window.authRefreshTimer)
            }
            try {
                await store.dispatch(fetchJWTToken(user.id))
                // After successful refresh, set up the next refresh
                const newExpiration = new Date(store.getState().auth.expirationDate)
                const newTimeUntilExpiry = newExpiration.getTime() - currentDate.getTime()
                const refreshDelay = newTimeUntilExpiry - 60 * 1000 // refresh 1 minute before expiry
                
                if (refreshDelay > 0) {
                    window.authRefreshTimer = setTimeout(() => {
                        setAuthToken()
                    }, refreshDelay)
                }
            } catch (error) {
                console.error('Failed to refresh token:', error)
                // If refresh fails, clear the timer and let the user re-login
                if (window.authRefreshTimer) {
                    clearTimeout(window.authRefreshTimer)
                }
            }
            return
        }

        // Set up refresh for when token is about to expire
        const refreshDelay = timeUntilExpiry - 60 * 1000 // refresh 1 minute before expiry
        if (refreshDelay > 0) {
            window.authRefreshTimer = setTimeout(() => {
                setAuthToken()
            }, refreshDelay)
        }

        return () => {
            if (window.authRefreshTimer) {
                clearTimeout(window.authRefreshTimer)
            }
        }
    }

    return checkAndRefreshToken()
}
