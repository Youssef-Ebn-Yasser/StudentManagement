import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import NoAccess from './NoAccess/NoAccess';
import { useDispatch } from 'react-redux';
// import { expiredToken } from '@/redux/features/expiredToken/expiredToken';


const userRole = localStorage.getItem('userRole');
const ProtectedRoutes = ({ isAuth, accessRole }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tokenChecked, setTokenChecked] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(()=>{
    const checkToken = async()=>{
      const expirationDate = localStorage.getItem('expirationDate');
      const now = new Data().toISOString()

      if(expirationDate && now >=expirationDate){
        const result = await dispatch(expiredToken());

        if(expiredToken.rejected.match(result)){
          localStorage.removeItem('JWTToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('expirationDate');
          localStorage.removeItem('userRole');
          navigate('/auth/login');
          return;
        }
      }
      const roleCheck = accessRole === 'all' || userRole === accessRole;
      setHasAccess(roleCheck);
      setTokenChecked(true);
  
    }
    checkToken();
  },[accessRole, dispatch, navigate, userRole])

  if (!isAuth) {
    return <Navigate to="/auth/login" />;
  }

  if (!tokenChecked) {
    return <div className="text-center mt-10 text-gray-500">Checking authentication...</div>;
  }
  
  if (!hasAccess) {
    return <NoAccess />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
