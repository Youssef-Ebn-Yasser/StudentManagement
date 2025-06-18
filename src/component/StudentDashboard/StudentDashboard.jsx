import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    courses: [],
    teachers: [],
    summary: {
      courses: 0,
      teachers: 0,
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Get studentId from localStorage
        const studentId = localStorage.getItem('guestId');
        if (!studentId) {
          setError('Student not logged in.');
          setLoading(false);
          return;
        }

        // Fetch enrolled courses for the logged-in student
        const coursesResponse = await axios.get(
          `https://e-learn-v1.runasp.net/api/Student/GetAllEnrolledStudentCourses/GetAllEnrolledStudentCourses?studentId=${studentId}`
        );

        if (!coursesResponse.data.succeeded || !Array.isArray(coursesResponse.data.data)) {
          throw new Error('Invalid courses data received');
        }

        const courses = coursesResponse.data.data;

        // Extract unique teachers by teacherName
        const teacherNames = [
          ...new Set(
            courses
              .filter((course) => course.teacherName && course.teacherName.trim() !== '')
              .map((course) => course.teacherName.trim())
          ),
        ];

        setDashboardData({
          courses: courses.map((course) => ({
            id: course.id,
            code: course.code,
            name: course.title,
            teacherName: course.teacherName,
            imagePath: course.imagePath,
            level: course.level,
            categoryName: course.categoryName,
            grade: course.grade || 'N/A',
          })),
          teachers: teacherNames,
          summary: {
            courses: courses.length,
            teachers: teacherNames.length,
          },
        });
      } catch (err) {
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold">{error}</p>
          <p className="text-sm mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen px-6 py-8">
      <h1 className="text-3xl font-bold text-indigo-700 mb-1">Student Dashboard</h1>
      <p className="text-gray-500 mb-6">Welcome back! Here's an overview of your academic progress.</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center mb-2">
            <i className="fa fa-book text-indigo-600 text-2xl mr-3" />
            <span className="text-lg font-semibold">Courses</span>
          </div>
          <div className="text-3xl font-bold text-indigo-700">{dashboardData.summary.courses}</div>
          <div className="text-gray-400">Enrolled Courses</div>
        </div>
        <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center mb-2">
            <i className="fa fa-user text-indigo-600 text-2xl mr-3" />
            <span className="text-lg font-semibold">Teachers</span>
          </div>
          <div className="text-3xl font-bold text-indigo-700">{dashboardData.summary.teachers}</div>
          <div className="text-gray-400">Your Teachers</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 overflow-x-auto">
        {['overview', 'courses', 'teachers'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-t-lg font-semibold whitespace-nowrap ${
              activeTab === tab
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-indigo-700'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Teachers Tab: All teachers */}
      {activeTab === 'teachers' && (
        <div className="grid md:grid-cols-2 gap-4">
          {dashboardData.teachers.map((teacherName, idx) => (
            <div
              key={teacherName + idx}
              className="bg-white border rounded-xl p-5 flex items-center shadow-sm cursor-pointer hover:bg-indigo-100"
              onClick={() => navigate(`/courses/teacher/${teacherName}`)}
            >
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg mr-4">
                {teacherName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{teacherName}</div>
              </div>
            </div>
          ))}
          {dashboardData.teachers.length === 0 && (
            <div className="text-gray-500">No teachers found.</div>
          )}
        </div>
      )}

      {/* Courses Tab: All courses */}
      {activeTab === 'courses' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardData.courses.map((course) => (
            <div
              key={course.id}
              className="bg-white border rounded-xl p-5 shadow-sm cursor-pointer hover:shadow-md transition"
              onClick={() => navigate(`/studentdashboard/course/${course.id}`)}
            >
              <div className="flex items-center mb-2">
                <i className="fa fa-book-open text-indigo-500 mr-2" />
                <span className="font-semibold text-md">{course.name}</span>
              </div>
              <div className="text-gray-500 text-sm mb-1 flex items-center">
                Teacher
                <i className="fa fa-user ml-2 text-gray-400" />
                <span className="ml-2 font-semibold text-gray-700">{course.teacherName}</span>
              </div>
              <div className="flex items-center mt-2 gap-2">
                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                  {course.categoryName}
                </span>
                {course.level && (
                  <span className="bg-red-400 text-white py-1 px-2 rounded-xl text-xs capitalize">
                    {course.level} Level
                  </span>
                )}
              </div>
              <div className="text-gray-500 text-sm mt-2">
                Current Grade <span className="font-bold text-gray-800 ml-2">{course.grade}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Overview Tab: Courses (4) and Teachers (2) */}
      {activeTab === 'overview' && (
        <>
          {/* Courses Overview */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-indigo-700">Courses</h2>
            <button
              onClick={() => setActiveTab('courses')}
              className="text-indigo-600 font-medium hover:underline text-sm"
            >
              View All
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dashboardData.courses.slice(0, 4).map((course) => (
              <div
                key={course.id}
                className="bg-white border rounded-xl p-5 shadow-sm cursor-pointer hover:shadow-md transition"
                onClick={() => navigate(`/studentdashboard/course/${course.id}`)}
              >
                <div className="flex items-center mb-2">
                  <i className="fa fa-book-open text-indigo-500 mr-2" />
                  <span className="font-semibold text-md">{course.name}</span>
                </div>
                <div className="text-gray-500 text-sm mb-1 flex items-center">
                  Teacher
                  <i className="fa fa-user ml-2 text-gray-400" />
                  <span className="ml-2 font-semibold text-gray-700">{course.teacherName}</span>
                </div>
                <div className="flex items-center mt-2 gap-2">
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                    {course.categoryName}
                  </span>
                  {course.level && (
                    <span className="bg-red-400 text-white py-1 px-2 rounded-xl text-xs capitalize">
                      {course.level} Level
                    </span>
                  )}
                </div>
                <div className="text-gray-500 text-sm mt-2">
                  Current Grade <span className="font-bold text-gray-800 ml-2">{course.grade}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Teachers Overview */}
          <div className="flex justify-between items-center mt-12 mb-4">
            <h2 className="text-xl font-bold text-indigo-700">Teachers</h2>
            <button
              onClick={() => setActiveTab('teachers')}
              className="text-indigo-600 font-medium hover:underline text-sm"
            >
              View All
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {dashboardData.teachers.slice(0, 2).map((teacherName, idx) => (
              <div
                key={teacherName + idx}
                className="bg-white border rounded-xl p-5 flex items-center shadow-sm cursor-pointer hover:bg-indigo-100"
                onClick={() => navigate(`/courses/teacher/${teacherName}`)}
              >
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg mr-4">
                  {teacherName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{teacherName}</div>
                </div>
              </div>
            ))}
            {dashboardData.teachers.length === 0 && (
              <div className="text-gray-500">No teachers found.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}