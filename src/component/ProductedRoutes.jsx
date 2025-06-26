import useAuth from '@/hooks/auth/useAuth'
import { Navigate, Outlet } from 'react-router-dom'
import NoAccess from './NoAccess/NoAccess'
import Loader from './Loader/Loader'

const ProtectedRoutes = ({ isProtected, accessRole, children }) => {
    const { role, isLogedin, loading } = useAuth()

  
    if (loading) return <Loader />

    if (isProtected && !isLogedin) {
        return <Navigate to="/auth/login" />
    }

    if (isProtected && accessRole !== 'all' && role?.toLowerCase() !== accessRole?.toLowerCase()) {
        return <NoAccess />
    }

    return children
}

export default ProtectedRoutes
