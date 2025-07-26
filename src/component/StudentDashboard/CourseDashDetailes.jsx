import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../Loader/Loader';
import { FaVideo } from 'react-icons/fa';
import { FaGraduationCap } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { convertToEgyptTime } from '../../utils/timeUtils';
import axiosInstance from '@/services/axiosInstance';

export default function CourseDashDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/Course?id=${id}`);
        if (response.data.succeeded) {
          setCourse(response.data.data);
        } else {
          throw new Error(response.data.massage || t('failed_to_load_course_details'));
        }
      } catch (err) {
        setError(err.message || t('failed_to_load_course_details'));
        console.error('Error fetching course details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, [id, t]);

  const lessonsCount = course?.lessonInfo?.length || 0;

  // Helper to format date in Egypt timezone
  const formatDate = (dateString) => {
    return convertToEgyptTime(dateString);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {loading && <Loader visible={loading} />}
        <ContentWrapper $loading={loading}>
            <Loader />
        </ContentWrapper>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {t('go_back')}
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-xl mb-4">{t('course_not_found')}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {t('go_back')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Course Image */}
            <div className="w-full md:w-1/2">
              <img
                src={course.imagePath}
                alt={course.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            {/* Course Info */}
            <div className="w-full md:w-1/2">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
              <p className="text-gray-600 mb-6">{course.description}</p>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  <span className="ml-2 text-gray-600">{lessonsCount} {t('lessons')}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-1 text-gray-600">{course.hours} {t('hours')}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                  <span className="ml-1 text-gray-600">
                    {t('teacher')}:{' '}
                    <button
                      onClick={() => navigate(`/courses/teacher/${course.teacherId}`)}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {course.teacherName || t('not_specified')}
                    </button>
                  </span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-4">
                {/* View Meetings Button */}
                <button
                  onClick={() => navigate(`/studentdashboard/course/${course.id}/stmeetings`)}
                  className="inline-flex items-center bg-purple-600 text-white px-6 py-2 rounded-lg shadow hover:bg-purple-700 transition font-semibold"
                >
                  <FaVideo className="mr-2 text-lg" />
                  {t('view_zoom_meetings')}
                </button>
                {/* Show Quiz Results Button */}
                <button
                  onClick={() => navigate(`/studentdashboard/course/${course.id}/quiz-stats`)}
                  className="inline-flex items-center bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition font-semibold"
                >
                  <FaGraduationCap className="mr-2 text-lg" />
                  {t('show_quiz_results')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Course Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`${
                  activeTab === 'description'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {t('description')}
              </button>
              <button
                onClick={() => setActiveTab('curriculum')}
                className={`${
                  activeTab === 'curriculum'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {t('curriculum')}
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-600">{course.description}</p>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div className="space-y-4">
                {course.lessonInfo && course.lessonInfo.length > 0 ? (
                  course.lessonInfo.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                      onClick={() => navigate(`lesson/${lesson.id}`)}
                    >
                      <div className="flex items-center justify-between p-4">
                        <span className="text-gray-900">{lesson.title}</span>
                        <span className="text-xs text-blue-600 ml-2">{t('view_assignments')}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">{t('no_lessons_available')}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('student_comments')}</h2>
          {course.commentInfo && course.commentInfo.length > 0 ? (
            <div className="space-y-6">
              {[...course.commentInfo]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 3)
                .map((comment) => (
                  <div
                    key={comment.id}
                    className="flex items-start gap-4 bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                        {comment.studentName ? comment.studentName[0].toUpperCase() : 'S'}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-indigo-700">{comment.studentName || t('student')}</span>
                        <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-700 text-base">{comment.content}</p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500">{t('no_comments_yet')}</p>
          )}
        </div>
      </div>
    </div>
  );
}