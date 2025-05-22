import useAuth from '@/hooks/auth/useAuth';
import { Navigate, Outlet } from 'react-router-dom';
import NoAccess from './NoAccess/NoAccess';


const ProtectedRoutes = ({ isAuth, accessRole }) => {
  const { role, isLogedin} = useAuth();
  
  const hasAccess = role === accessRole || accessRole === 'all';

 

  if (!isLogedin) {
    return <Navigate to="/auth/login" />;
  }

  
  if (!hasAccess) {
    return <NoAccess />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
