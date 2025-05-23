import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    assignments: [],
    courses: [],
    teachers: [],
    summary: {
      assignments: 0,
      courses: 0,
      teachers: 0,
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch enrolled courses for student ID 85
        const coursesResponse = await axios.get(
          `https://e-learn-v1.runasp.net/api/Student/GetAllEnrolledStudentCourses/GetAllEnrolledStudentCourses?studentId=85`
        );

        // Validate courses response
        if (!coursesResponse.data.succeeded || !Array.isArray(coursesResponse.data.data)) {
          console.error('Invalid courses response:', coursesResponse.data);
          throw new Error('Invalid courses data received');
        }

        const courses = coursesResponse.data.data;

        // Fetch assignments for each course
        const assignmentsPromises = courses.map((course) =>
          axios.get(
            `https://e-learn-v1.runasp.net/api/Assignment/GetStudentAssignmentInCourse?studentId=85&courseId=${course.id}`
          )
        );
        const assignmentsResponses = await Promise.all(assignmentsPromises);

        // Process assignments data
        const allAssignments = assignmentsResponses.flatMap((response, idx) => {
          const assignmentData = response.data.data || [];
          if (assignmentData.length && assignmentData[0].path) {
            return [{
              title: 'Assignment PDF',
              courseName: courses[idx].title,
              dueDate: '',
              status: 'Available',
              progress: 0,
              path: assignmentData[0].path,
            }];
          }
          return [];
        });

        // Get unique teachers from courses (filter out courses without teacher)
        const teachers = [
          ...new Map(
            courses
              .filter((course) => course.teacher)
              .map((course) => [
                course.teacher.id,
                {
                  name: course.teacher.name,
                  specialization: course.teacher.specialization,
                  email: course.teacher.email,
                  initials: course.teacher.name
                    .split(' ')
                    .map((n) => n[0])
                    .join(''),
                  subject: course.teacher.specialization,
                },
              ])
          ).values(),
        ];

        // Update dashboard data
        setDashboardData({
          assignments: allAssignments.map((assignment) => ({
            title: assignment.title,
            course: assignment.courseName,
            due: assignment.dueDate
              ? new Date(assignment.dueDate).toLocaleDateString()
              : '',
            status: assignment.status,
            percent: assignment.progress || 0,
            path: assignment.path,
          })),
          courses: courses.map((course) => ({
            id: course.id, // <-- include id for navigation
            code: course.code,
            name: course.title,
            progress: course.progress || 0,
            grade: course.grade || 'N/A',
          })),
          teachers,
          summary: {
            assignments: allAssignments.length,
            courses: courses.length,
            teachers: teachers.length,
          },
        });
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error('Dashboard data fetch error:', err);
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center mb-2">
            <i className="fa fa-clipboard-list text-indigo-600 text-2xl mr-3" />
            <span className="text-lg font-semibold">Assignments</span>
          </div>
          <div className="text-3xl font-bold text-indigo-700">{dashboardData.summary.assignments}</div>
          <div className="text-gray-400">Total Assignments</div>
        </div>
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
        {['overview', 'assignments', 'courses', 'teachers'].map((tab) => (
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

      {/* Content based on active tab */}
      {activeTab === 'assignments' && (
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {dashboardData.assignments.map((assignment, idx) => (
            <div key={assignment.title + idx} className="bg-white border rounded-xl p-5 shadow-sm">
              <div className="flex items-center mb-2">
                <i className="fa fa-file-alt text-indigo-600 mr-2" />
                <span className="font-semibold text-lg">{assignment.title}</span>
                <span className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${
                  assignment.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {assignment.status}
                </span>
              </div>
              <div className="text-gray-500 mb-2">{assignment.course}</div>
              {assignment.percent > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${assignment.percent}%` }}></div>
                </div>
              )}
              <div className="text-gray-400 text-sm">Due: {assignment.due}</div>
              {/* PDF Link Only */}
              {assignment.path && (
                <div className="mt-4">
                  <a
                    href={assignment.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 underline"
                  >
                    Open Assignment PDF in new tab
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'teachers' && (
        <div className="grid md:grid-cols-2 gap-4">
          {dashboardData.teachers.map((teacher) => (
            <div key={teacher.email} className="bg-white border rounded-xl p-5 flex items-center shadow-sm">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg mr-4">
                {teacher.initials}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{teacher.name}</div>
                <div className="text-gray-500 text-sm">{teacher.subject}</div>
                <div className="text-gray-400 text-xs">{teacher.email}</div>
              </div>
              <button className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700">
                Contact
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'courses' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardData.courses.map((course) => (
            <div
              key={course.id}
              className="bg-white border rounded-xl p-5 shadow-sm cursor-pointer hover:shadow-md transition"
              onClick={() => navigate(`/studentdashboard/course/${course.id}`)} // Go to course details
            >
              <div className="flex items-center mb-2">
                <i className="fa fa-book-open text-indigo-500 mr-2" />
                <span className="font-semibold text-md">{course.code}: {course.name}</span>
              </div>
              <div className="text-gray-500 text-sm mb-1 flex items-center">
                Progress
                <i className="fa fa-chart-line ml-2 text-gray-400" />
                <span className="ml-auto font-semibold text-gray-700">{course.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-indigo-900 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
              </div>
              <div className="text-gray-500 text-sm">
                Current Grade <span className="font-bold text-gray-800 ml-2">{course.grade}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'overview' && (
        <>
          {/* Recent Assignments with View All */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-indigo-700">Recent Assignments</h2>
            <button
              onClick={() => setActiveTab('assignments')}
              className="text-indigo-600 font-medium hover:underline text-sm"
            >
              View All
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {dashboardData.assignments.slice(0, 2).map((assignment, idx) => (
              <div key={assignment.title + idx} className="bg-white border rounded-xl p-5 shadow-sm">
                <div className="flex items-center mb-2">
                  <i className="fa fa-file-alt text-indigo-600 mr-2" />
                  <span className="font-semibold text-lg">{assignment.title}</span>
                  <span className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${
                    assignment.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {assignment.status}
                  </span>
                </div>
                <div className="text-gray-500 mb-2">{assignment.course}</div>
                {assignment.percent > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${assignment.percent}%` }}></div>
                  </div>
                )}
                <div className="text-gray-400 text-sm">Due: {assignment.due}</div>
                {/* PDF Link Only */}
                {assignment.path && (
                  <div className="mt-4">
                    <a
                      href={assignment.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 underline"
                    >
                      Open Assignment PDF in new tab
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Course Progress */}
          <div className="flex justify-between items-center mt-12 mb-4">
            <h2 className="text-xl font-bold text-indigo-700">Course Progress</h2>
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
                onClick={() => navigate(`/studentdashboard/course/${course.id}`)} // Go to course details
              >
                <div className="flex items-center mb-2">
                  <i className="fa fa-book-open text-indigo-500 mr-2" />
                  <span className="font-semibold text-md">{course.code}: {course.name}</span>
                </div>
                <div className="text-gray-500 text-sm mb-1 flex items-center">
                  Progress
                  <i className="fa fa-chart-line ml-2 text-gray-400" />
                  <span className="ml-auto font-semibold text-gray-700">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-indigo-900 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                </div>
                <div className="text-gray-500 text-sm">
                  Current Grade <span className="font-bold text-gray-800 ml-2">{course.grade}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}