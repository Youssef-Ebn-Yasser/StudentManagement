import { lazy, Suspense } from 'react';
import Loader from '@/component/Loader/Loader';
import CourseQuizStats from '@/component/TeacherProfile/teacherMange/CourseQuizStats';
import LessonQuizStats from '@/component/TeacherProfile/teacherMange/LessonQuizStats';

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
  {
    path: '/teacher/course/:courseId/quiz-stats',
    element: <CourseQuizStats />
  },
  {
    path: '/teacher/lesson/:lessonId/quiz-stats',
    element: <LessonQuizStats />
  },
];

export default teacherRoutes;
