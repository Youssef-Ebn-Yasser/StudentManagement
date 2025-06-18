import { lazy, Suspense } from 'react';
import Loader from '@/component/Loader/Loader';

const ManageQuiz = lazy(() => import('@/component/TeacherProfile/teacherMange/ManageQuiz'));

const teacherRoutes = [
  {
    path: '/teacher/manage-quiz',
    element: (
      <Suspense fallback={<Loader />}>
        <ManageQuiz />
      </Suspense>
    ),
  },
];

export default teacherRoutes;
