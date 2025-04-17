import TeacherReg from '@/component/TeacherReg/TeacherReg';
import Login from '../component/Login/Login';
import Register from '../component/Register/Register';
import StudentReg from '@/component/StudentReg/StudentReg';
import AdminReg from '@/component/AdminReg/AdminReg';

const authRoutes = ([
  {
    path: 'auth',
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'teacherRegister', element: <TeacherReg /> },
      { path: 'studentRegister', element: <StudentReg /> },
      { path: 'adminRegister', element: <AdminReg /> },
    ]
  }
]);

export default authRoutes;
