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
import AdminProfile from '@/component/AdminProfile/AdminProfile'
import AddTeacher from '@/component/AdminProfile/AddTeacher'
import AddGategory from '@/component/AdminProfile/AddGategory'
import AddCourse from '@/component/AdminProfile/AddCourse'
import Students from '@/component/AdminProfile/Students'
import AdminDashboard from '@/component/AdminDashboard/AdminDashboard'
import CourseDashDetails from '@/component/StudentDashboard/CourseDashDetailes'
import CourseDetails from '@/component/AdminProfile/CourseDetails'
import StudentDetails from '@/component/AdminProfile/StudentDetails'

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
        element: <CourseDetails />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'studentdashboard/course/:id',
        element: <CourseDashDetails />,
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
    {
        path: 'admin/profile',
        element: <AdminProfile />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'admin/addteacher',
        element: <AddTeacher />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'admin/addgategory',
        element: <AddGategory/>,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'admin/addcourse',
        element: <AddCourse/>,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'admin/courseDetails/:id',
        element: <CourseDetails/>,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'admin/studentDetails/:id',
        element: <StudentDetails/>,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'admin/students',
        element: <Students/>,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'admin/dashboard',
        element: <AdminDashboard/>,
        isProtected: false,
        accessRole: 'all',
    },
]

const mainRoutes = [
    {
        path: '',
        element: <Layout />,
        children: routesConfig.map(
            ({ path, element, isProtected = false, accessRole = 'all' }) => ({
                path,
                element: (
                    <ProtectedRoutes
                        isProtected={isProtected}
                        accessRole={accessRole}
                    >
                        {element}
                    </ProtectedRoutes>
                ),
            })
        ),
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
