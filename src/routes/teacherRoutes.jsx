import { lazy, Suspense } from 'react';
import Loader from '@/component/Loader/Loader';
import CourseQuizStats from '@/component/TeacherProfile/teacherMange/CourseQuizStats';
import LessonQuizStats from '@/component/TeacherProfile/teacherMange/LessonQuizStats';
import CreateQuiz from '@/component/CreateQuiz/CreateQuiz';

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
  {
    path: '/teacher/course/:courseId/createquiz',
    element: <CreateQuiz />
  },
];

export default teacherRoutes;
