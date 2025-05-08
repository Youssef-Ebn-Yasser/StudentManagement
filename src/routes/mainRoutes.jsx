import ProtectedRoutes from '@/component/ProductedRoutes'
import Dashboard from '../component/Dashboard/Dashboard'
import Home from '../component/Home/Home'
import Layout from '../component/Layout/Layout'
import Teachers from './../component/Teachers/Teachers'
import About from './../component/About/About'
import Courses from './../component/Courses/Courses'
import TeacherProfile from '@/component/TeacherProfile/TeacherProfile'
import CreateCourse from '@/component/TeacherProfile/CreateCourse'
import TeacherCourses from '@/component/TeacherProfile/TeacherCourses'
import AccountSettings from '@/component/TeacherProfile/settingsPage/AccountSettings'
import TeacherCourseDetails from '@/component/TeacherProfile/TeacherCourseDetails'
import CoursesDetails from '@/component/CoursesDetails/CoursesDetails'
import StudentDashboard from '@/component/StudentDashboard/StudentDashboard'
import StudentProfile from '@/component/StudentProfile/StudentProfile'
import EditProfile from '@/component/StudentProfile/EditProfile'
import AddLesson from '@/component/TeacherProfile/AddLesson'
import EditCourse from '@/component/TeacherProfile/EditCourse'

const isAuth = true // Replace with actual authentication logic

const routesConfig = [
    { path: '', element: <Home />, isProtected: false, accessRole: 'all' },
    {
        path: 'courses',
        element: <Courses />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'teachers',
        element: <Teachers />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'about',
        element: <About />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'dashboard',
        element: <Dashboard />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'studentdashboard',
        element: <StudentDashboard />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'studentprofile',
        element: <StudentProfile />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'teacher/profile',
        element: <TeacherProfile />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'teacher/createcourse',
        element: <CreateCourse />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'teacher/courses',
        element: <TeacherCourses />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'teacher/course/:id',
        element: <TeacherCourseDetails />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'teacher/course/:courseId/lesson/new',
        element: <AddLesson />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'courses/course/:id',
        element: <CoursesDetails />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'teacher/settings',
        element: <AccountSettings />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'studentprofile/edit-profile',
        element: <EditProfile />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'teacher/course/edit/:id',
        element: <EditCourse />,
        isProtected: false,
        accessRole: 'all',
    },
]

const mainRoutes = [
    {
        path: '',
        element: <Layout />,
        children: [
            // Public routes
            ...routesConfig
                .filter((route) => !route.isProtected)
                .map(({ path, element }) => ({ path, element })),

            // Protected wrapper
            {
                element: (
                    <ProtectedRoutes
                        isAuth={!!localStorage.getItem('refreshToken')}
                        accessRole="all"
                    />
                ),
                children: routesConfig
                    .filter((route) => route.isProtected)
                    .map(({ path, element }) => ({ path, element })),
            },
        ],
    },
]

// const mainRoutes = [
//   {
//     path: '',
//     element: <Layout />,
//     children: routesConfig.map(({ path, element, isProtected, accessRole }) => (
//       isProtected
//         ? { path, element: <ProtectedRoutes
//             accessRole={accessRole}
//             isAuth={!!localStorage.getItem('JWTToken')}>{element}</ProtectedRoutes> }
//         : { path, element }
//     )),
//   },
// ]

export default mainRoutes
