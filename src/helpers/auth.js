import { fetchJWTToken } from '@/Redux/auth/authorizeAcions'
import store from '@/Redux/store'

export const setAuthToken = () => {
    console.log('Setting auth token')
    const checkAndRefreshToken = async () => {
        console.log(store.getState()) 
        const expirationDateStr = store.getState().auth.expirationDate



        const expirationDate = new Date(expirationDateStr)
        const currentDate = new Date()
        const timeUntilExpiry = expirationDate.getTime() - currentDate.getTime()

        let refreshDelay = timeUntilExpiry - 60 * 1000 // refresh 1 minute before expiry
        // If it's already expiring soon or expired, refresh immediately
        if (refreshDelay <= 0) {
            if (window.authRefreshTimer) {
                clearTimeout(window.authRefreshTimer)
            }
            const userId = store.getState().auth.user?.id
            await store.dispatch(fetchJWTToken(userId))
            const newExpiration = new Date(store.getState().auth.expirationDate)
            refreshDelay = newExpiration.getTime() - currentDate.getTime() - 60 * 1000 // refresh 1 minute before new expiry
        }

        window.authRefreshTimer = setTimeout(() => {
            setAuthToken() // recursively set up the next refresh
        }, refreshDelay)

        return () => clearTimeout(window.authRefreshTimer)
    }

    return checkAndRefreshToken()
}
