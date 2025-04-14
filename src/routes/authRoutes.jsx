import Login from '../component/Login/Login';
import Register from '../component/Register/Register';

const authRoutes = ([
  {
    path: 'auth',
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ]
  }
]);

export default authRoutes;
