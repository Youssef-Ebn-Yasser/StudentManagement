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
import StudentDashboard from '@/component/StudentDashboard/StudentDashboard'
import StudentProfile from '@/component/StudentProfile/StudentProfile'
import StudentProfile2 from '@/component/StudentProfile/StudentProfile2'
import EditProfile from '@/component/StudentProfile/EditProfile'
import AddLesson from '@/component/TeacherProfile/AddLesson'
import EditCourse from '@/component/TeacherProfile/EditCourse'
import AdminProfile from '@/component/AdminProfile/AdminProfile'
import AddTeacher from '@/component/AdminProfile/AddTeacher'
import AddGategory from '@/component/AdminProfile/AddGategory'
import AddCourse from '@/component/AdminProfile/AddCourse'
import Students from '@/component/AdminProfile/Students'
import AdminDashboard from '@/component/AdminDashboard/AdminDashboard'
import ControlCourse from '@/component/AdminProfile/ControlCourse'
import StudentDetails from '@/component/AdminProfile/StudentDetails'
import CoursesDetails from '@/component/CoursesDetails/CoursesDetails'
import CourseDashDetails from '@/component/StudentDashboard/CourseDashDetailes'
import AddMaterial from '@/component/TeacherProfile/AddMaterial'
import TeacherProfileView from '@/component/StudentDashboard/TeacherProfileView'
import CreateQuiz from '@/component/CreateQuiz/CreateQuiz'
import Quiz from '@/component/StudentDashboard/Quiz'
import TeacherRequest from '@/component/Register/TeacherRequest'
import TeacherDashboard from '@/component/TeacherDashboard/TeacherDashboard'
import LessonDetails from '@/component/StudentDashboard/LessonDetails'
import CreateZoom from '@/component/TeacherProfile/CreateZoom'
import MeetingData from '@/component/TeacherProfile/MeetingData'
import MeetingSdata from './../component/StudentDashboard/MeetingSdata'
import teacherRoutes from './teacherRoutes'
import QuizView from '../component/StudentDashboard/QuizView'
import ReviewStudentAnswers from '@/component/TeacherProfile/teacherMange/ReviewStudentAnswers'
import ManageAssignments from '@/component/TeacherProfile/teacherMange/ManageAssignments'
import TeacherStudents from '../component/TeacherProfile/TeacherStudents'
import ChatRoom from '../component/StudentDashboard/ChatRoom'
import TChatRoom from '../component/TeacherProfile/TChatRoom'
import StudentAnswers from '@/component/TeacherProfile/teacherMange/StudentAnswers'
import StudentQuizStats from '@/component/StudentDashboard/StudentQuizStats'
import PaymobCheckout from '@/component/CoursesDetails/PaymobCheckout'
import RegisterAdmin from '@/component/AdminProfile/RegisterAdmin'
import AllAdmins from '@/component/AdminProfile/AllAdmins'
import StudentProfile3 from '@/component/StudentProfile/StudentProfile3'
import Report from '../component/Report/report'
import Translate from '@/component/Translate/Translate'




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
        path: 'createquiz',
        element: <CreateQuiz />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'admins',
        element: <AllAdmins />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: '/studentdashboard/course/:courseId/lesson/:lessonId',
        element: <LessonDetails />,
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
        path: 'studentprofilee',
        element: <StudentProfile2 />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'studentprofileee',
        element: <StudentProfile3 />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'courses/course/:id/paymob-checkout',
        element: <PaymobCheckout/>,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'studentdashboard/quiz/:lessonId',
        element: <Quiz />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'studentdashboard/lesson/:lessonId/quiz',
        element: <QuizView />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'studentdashboard/course/:courseId/quiz-stats',
        element: <StudentQuizStats />,
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
        path: 'teacher/profile/students',
        element: <TeacherStudents />,
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
        path: 'teacher/add-lesson',
        element: <TeacherCourses />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'teacher/add-material',
        element: <TeacherCourses />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'teacher/course/lesson/new',
        element: <AddLesson />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'teacher/course/lesson/material/new',
        element: <AddMaterial />,
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
        path: 'teacher/course/details',
        element: <TeacherCourseDetails />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'teacher/course/meetings',
        element: <MeetingData />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'studentdashboard/course/:courseId/stmeetings',
        element: <MeetingSdata />,
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
        path: 'courses/teacher/:teacherName',
        element: <TeacherProfileView />,
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
        path: '/chat/:teacherId',
        element: <ChatRoom />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: '/chatt/:studentId',
        element: <TChatRoom />,
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
        path: 'teacher/course/edit',
        element: <EditCourse />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'teacher/review-student-answers',
        element: <ReviewStudentAnswers />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'teacher/review-student-answers/:answerId',
        element: <StudentAnswers />,
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
        path: 'admin/reg-admin',
        element: <RegisterAdmin/>,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'admin/controlCourse',
        element: <ControlCourse/>,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'admin/studentDetails',
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
    {
        path: 'teacher/assignments',
        element: <ManageAssignments />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'become-teacher',
        element: <TeacherRequest />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'teacher/dashboard',
        element: <TeacherDashboard />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'teacher/create-zoom',
        element: <CreateZoom />,
        isProtected: false,
        accessRole: 'all',
    },
    {
        path: 'admin/reports',
        element: <Report />,
        isProtected: true,
        accessRole: 'admin',
    },
    ...teacherRoutes,
    {
        path: 'translate',
        element: <Translate/>,
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
