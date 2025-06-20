import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// It's good practice to include necessary external CSS/icon libraries.
// For Font Awesome icons used in this component, you would typically link it
// in your main HTML file (e.g., public/index.html) like this:
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" xintegrity="sha512-..." crossorigin="anonymous" referrerpolicy="no-referrer" />

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

        // Check if the API call was successful and data is an array
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
            imagePath: course.imagePath, // Keeping imagePath, though not used in current render
            level: course.level,
            categoryName: course.categoryName,
            grade: course.grade || 'N/A', // Default to 'N/A' if grade is missing
          })),
          teachers: teacherNames,
          summary: {
            courses: courses.length,
            teachers: teacherNames.length,
          },
        });
      } catch (err) {
        // More specific error message based on the error object
        setError(`Failed to fetch dashboard data: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // Empty dependency array means this effect runs once after the initial render

  // Loading spinner component
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  // Error message component
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <p className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong.</p>
          <p className="text-gray-700 text-lg">{error}</p>
          <p className="text-sm text-gray-500 mt-4">Please try refreshing the page or contact support if the issue persists.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    // Main container with a subtle background color
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8 font-inter">
      {/* Page Title and Description */}
      <h1 className="text-4xl font-extrabold text-indigo-800 mb-2">Student Dashboard</h1>
      <p className="text-gray-600 text-lg mb-8">Welcome back! Here's an overview of your academic progress.</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-xl flex flex-col items-start transform hover:scale-[1.02] transition duration-300 ease-in-out border-b-4 border-indigo-600">
          <div className="flex items-center mb-3">
            <i className="fas fa-book-open text-indigo-700 text-3xl mr-4" />
            <span className="text-xl font-bold text-gray-800">Enrolled Courses</span>
          </div>
          <div className="text-5xl font-extrabold text-indigo-700 mb-1">{dashboardData.summary.courses}</div>
          <div className="text-gray-500 text-md">Total courses you're taking</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-xl flex flex-col items-start transform hover:scale-[1.02] transition duration-300 ease-in-out border-b-4 border-teal-600">
          <div className="flex items-center mb-3">
            <i className="fas fa-chalkboard-teacher text-teal-700 text-3xl mr-4" />
            <span className="text-xl font-bold text-gray-800">Your Teachers</span>
          </div>
          <div className="text-5xl font-extrabold text-teal-700 mb-1">{dashboardData.summary.teachers}</div>
          <div className="text-gray-500 text-md">Educators guiding your learning</div>
        </div>
      </div>

      {/* Tabs for Navigation */}
      <div className="flex space-x-2 sm:space-x-4 mb-8 border-b border-gray-200 overflow-x-auto pb-2">
        {['overview', 'courses', 'teachers'].map((tab) => (
          <button
            key={tab}
            className={`px-5 py-3 rounded-t-xl font-semibold text-lg whitespace-nowrap transition duration-300
              ${activeTab === tab
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg transform scale-105 border-b-4 border-indigo-800'
                : 'text-gray-700 hover:bg-gray-200 hover:text-indigo-800 bg-white border border-transparent hover:border-gray-300'
              }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Conditional Rendering based on activeTab */}

      {/* Teachers Tab Content */}
      {activeTab === 'teachers' && (
        <section className="animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">All Teachers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardData.teachers.length > 0 ? (
              dashboardData.teachers.map((teacherName, idx) => (
                <div
                  key={teacherName + idx}
                  className="bg-white rounded-xl p-6 flex items-center shadow-lg cursor-pointer hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:border-indigo-400 border-2 border-transparent"
                  onClick={() => navigate(`/courses/teacher/${teacherName}`)}
                >
                  <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-extrabold text-2xl mr-5 flex-shrink-0">
                    {teacherName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-xl text-gray-900">{teacherName}</div>
                    <div className="text-gray-500 text-sm">View courses taught</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500 text-lg">No teachers found for your enrolled courses.</div>
            )}
          </div>
        </section>
      )}

      {/* Courses Tab Content */}
      {activeTab === 'courses' && (
        <section className="animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">All Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dashboardData.courses.length > 0 ? (
              dashboardData.courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:border-indigo-400 border-2 border-transparent"
                  onClick={() => navigate(`/studentdashboard/course/${course.id}`)}
                >
                  <div className="flex items-center mb-3">
                    <i className="fas fa-chalkboard text-indigo-600 text-2xl mr-3" />
                    <span className="font-bold text-lg text-gray-900">{course.name}</span>
                  </div>
                  <div className="text-gray-600 text-sm mb-2 flex items-center">
                    <i className="fas fa-user-tie text-gray-400 text-sm mr-2" />
                    <span className="font-medium text-gray-700">{course.teacherName}</span>
                  </div>
                  <div className="flex flex-wrap items-center mt-3 gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                      {course.categoryName}
                    </span>
                    {course.level && (
                      <span className="bg-purple-600 text-white py-1 px-3 rounded-full text-xs font-semibold capitalize">
                        {course.level} Level
                      </span>
                    )}
                  </div>
                  <div className="text-gray-700 text-md mt-4 flex items-center">
                    Current Grade: <span className="font-bold text-indigo-700 ml-2 text-lg">{course.grade}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500 text-lg">You are not enrolled in any courses yet.</div>
            )}
          </div>
        </section>
      )}

      {/* Overview Tab Content (Combines limited Courses and Teachers) */}
      {activeTab === 'overview' && (
        <section className="animate-fade-in">
          {/* Courses Overview Section */}
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-3xl font-bold text-gray-800">Recent Courses</h2>
            <button
              onClick={() => setActiveTab('courses')}
              className="text-indigo-600 font-semibold hover:underline text-md px-4 py-2 rounded-lg hover:bg-indigo-50 transition duration-200"
            >
              View All Courses <i className="fas fa-arrow-right ml-1"></i>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {dashboardData.courses.slice(0, 4).length > 0 ? (
              dashboardData.courses.slice(0, 4).map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:border-indigo-400 border-2 border-transparent"
                  onClick={() => navigate(`/studentdashboard/course/${course.id}`)}
                >
                  <div className="flex items-center mb-3">
                    <i className="fas fa-chalkboard text-indigo-600 text-2xl mr-3" />
                    <span className="font-bold text-lg text-gray-900">{course.name}</span>
                  </div>
                  <div className="text-gray-600 text-sm mb-2 flex items-center">
                    <i className="fas fa-user-tie text-gray-400 text-sm mr-2" />
                    <span className="font-medium text-gray-700">{course.teacherName}</span>
                  </div>
                  <div className="flex flex-wrap items-center mt-3 gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                      {course.categoryName}
                    </span>
                    {course.level && (
                      <span className="bg-purple-600 text-white py-1 px-3 rounded-full text-xs font-semibold capitalize">
                        {course.level} Level
                      </span>
                    )}
                  </div>
                  <div className="text-gray-700 text-md mt-4 flex items-center">
                    Current Grade: <span className="font-bold text-indigo-700 ml-2 text-lg">{course.grade}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500 text-lg">No recent courses to display. Enroll in some to get started!</div>
            )}
          </div>

          {/* Teachers Overview Section */}
          <div className="flex justify-between items-center mt-10 mb-5">
            <h2 className="text-3xl font-bold text-gray-800">Key Teachers</h2>
            <button
              onClick={() => setActiveTab('teachers')}
              className="text-indigo-600 font-semibold hover:underline text-md px-4 py-2 rounded-lg hover:bg-indigo-50 transition duration-200"
            >
              View All Teachers <i className="fas fa-arrow-right ml-1"></i>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {dashboardData.teachers.slice(0, 2).length > 0 ? (
              dashboardData.teachers.slice(0, 2).map((teacherName, idx) => (
                <div
                  key={teacherName + idx}
                  className="bg-white rounded-xl p-6 flex items-center shadow-lg cursor-pointer hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:border-indigo-400 border-2 border-transparent"
                  onClick={() => navigate(`/courses/teacher/${teacherName}`)}
                >
                  <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-extrabold text-2xl mr-5 flex-shrink-0">
                    {teacherName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-xl text-gray-900">{teacherName}</div>
                    <div className="text-gray-500 text-sm">View courses taught</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500 text-lg">No key teachers to display.</div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
