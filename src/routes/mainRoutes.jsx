import ProtectedRoutes from '@/component/ProductedRoutes';
import Dashboard from '../component/Dashboard/Dashboard';
import Home from '../component/Home/Home';
import Layout from '../component/Layout/Layout';
import Profile from '../component/Profile/Profile';
import Teachers from './../component/Teachers/Teachers';
import About from './../component/About/About';
import Courses from './../component/Courses/Courses';
import CoursesDetails from './../component/CoursesDetails/CoursesDetails';
import TeacherProfile from '@/component/Teacher/TeacherProfile';
import CreateCourse from '@/component/Teacher/CreateCourse';

const isAuth = true; // Replace with actual authentication logic

const routesConfig = [
  { path: '', element: <Home/>, isProtected: false, accessRole: 'all' },
  { path: 'profile', element: <Profile />, isProtected: true, accessRole: 'all' },
  { path: 'courses', element: <Courses />, isProtected: false, accessRole: 'all' },
  { path: 'teachers', element: <Teachers />, isProtected: false, accessRole: 'all' },
  { path: 'about', element: <About />, isProtected: false, accessRole: 'all' },
  { path: 'coursesDetails', element: <CoursesDetails />, isProtected: false, accessRole: 'all' },
  { path: 'dashboard', element: <Dashboard />, isProtected: false , accessRole: 'all' },
  { path: 'teacher/profile', element: <TeacherProfile />, isProtected: false , accessRole: 'all' },
  { path: 'teacher/profile/createcourse', element: <CreateCourse />, isProtected: false , accessRole: 'all' },
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
