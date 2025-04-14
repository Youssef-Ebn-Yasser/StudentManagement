import ProtectedRoutes from '@/component/ProductedRoutes';
import Dashboard from '../component/Dashboard/Dashboard';
import Home from '../component/Home/Home';
import Layout from '../component/Layout/Layout';
import Profile from '../component/Profile/Profile';

const isAuth = true; // Replace with actual authentication logic

const routesConfig = [
  { path: '', element: <Home />, isProtected: false, accessRole: 'all' },
  { path: 'profile', element: <Profile />, isProtected: true, accessRole: 'all' },
  { path: 'dashboard', element: <Dashboard />, isProtected: true , accessRole: 'admin' },
];


const mainRoutes = [
  {
    path: '',
    element: <Layout />, 
    children: routesConfig.map(({ path, element, isProtected, accessRole }) => (
      isProtected
        ? { path, element: <ProtectedRoutes 
            accessRole={accessRole}
            isAuth={isAuth}>{element}</ProtectedRoutes> }
        : { path, element }
    )),
  },
]

export default mainRoutes;
