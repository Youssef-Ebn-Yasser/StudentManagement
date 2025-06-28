import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Loader from '../Loader/Loader';
import axios from 'axios';
import { API_URL } from '@/config';
import { FaBook, FaChalkboardTeacher, FaUsers, FaFileAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const TeacherDashboard = () => {

  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const teacherId = user?.id;
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!teacherId) {
      setLoading(false);
      console.warn('Teacher ID not available. Cannot fetch dashboard data.');
      return;
    }
    fetchData();
  }, [teacherId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch teacher's courses (basic info)
      console.log('Fetching basic course list for teacher ID:', teacherId);
      const coursesRes = await axios.get(`${API_URL}/Course/GetAllCoursesOfTeacher/${teacherId}`);
      const coursesData = coursesRes.data?.data || [];
      console.log('Basic courses response data:', coursesData);

      let coursesWithLessons = [];
      // For each course, fetch its details (including lessons)
      for (const course of coursesData) {
        console.log('Fetching details for course ID:', course.id);
        const courseDetailRes = await axios.get(`${API_URL}/Course/Get/${course.id}`);
        const courseDetail = courseDetailRes.data?.data || {};
        console.log(`Details for course ${course.id}:`, courseDetail);
        console.log(`Lessons for course ${course.id} (lessonInfo):`, courseDetail.lessonInfo);
        coursesWithLessons.push({ ...course, lessonInfo: courseDetail.lessonInfo || [] });
      }
      setCourses(coursesWithLessons);

      // Collect all lessons for stats (optional)
      let allLessons = [];
      for (const course of coursesWithLessons) {
        if (Array.isArray(course.lessonInfo)) {
          allLessons = allLessons.concat(course.lessonInfo);
        }
      }
      setLessons(allLessons);

    } catch (error) {
      console.error('Error fetching teacher dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-[#6366f1] text-white rounded hover:bg-[#4f46e5] transition"
      >
        ← {t("go-back")}
      </button>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaBook className="text-2xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">{t("total-courses")}</h3>
              <p className="text-2xl font-semibold">{courses.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaChalkboardTeacher className="text-2xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">{t("total-lessons")}</h3>
              <p className="text-2xl font-semibold">{lessons.length}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Recent Courses */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">{t("recent-courses")}</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("course-name")}</th>
                {courses && courses.some(c => c.categoryName) && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("category")}</th>
                )}
                {courses && courses.some(c => c.studentsCount !== undefined) && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Students")}</th>
                )}
                {courses && courses.some(c => c.rating !== undefined) && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("rating")}</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.slice(0, 5).map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{course.title}</div>
                  </td>
                  {courses.some(c => c.categoryName) && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{course.categoryName || '-'}</div>
                    </td>
                  )}
                  {courses.some(c => c.studentsCount !== undefined) && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{course.studentsCount !== undefined ? course.studentsCount : '-'}</div>
                    </td>
                  )}
                  {courses.some(c => c.rating !== undefined) && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{course.rating !== undefined ? course.rating : '-'}</div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Lessons Grouped by Course */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">{t("lessons-of-course")}</h2>
        <div className="space-y-8">
          {courses.length === 0 && <div className="text-gray-500">{t("no-courses-found")}</div>}
          {courses.map((course) => (
            <div key={course.id}>
              <h3 className="font-bold text-lg mb-2 text-[#6366f1]">{course.title}</h3>
              {Array.isArray(course.lessonInfo) && course.lessonInfo.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {course.lessonInfo.map((lesson) => (
                    <div key={lesson.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h4 className="font-medium text-md mb-2">{lesson.title}</h4>
                      {lesson.description && <p className="text-gray-600 text-sm mb-2">{lesson.description}</p>}
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        {lesson.duration && <span>{t("duration")}: {lesson.duration} {t("min")}</span>}
                        {lesson.materialsCount !== undefined && <span>{t("materials")}: {lesson.materialsCount}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 italic mb-6">{t("no-lessons-for-course")}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard; 