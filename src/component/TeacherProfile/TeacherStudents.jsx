import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../../services/axiosInstance';
import { useTranslation } from 'react-i18next';

const ChatIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-indigo-500 hover:text-indigo-700 cursor-pointer transition-colors duration-200"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);


function TeacherStudents() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { t } = useTranslation(); 

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        if (!user?.id) {
          throw new Error("Teacher ID not found. Please log in again.");
        }

        console.log('Fetching students for teacher ID:', user.id);

        const response = await axiosInstance.get(`/api/ChatRooms/student/EnroolWithTeacher`, {
          params: { teacherId: user.id }
        });

        console.log('API Response:', response.data);

        if (response.data.succeeded && response.data.data) {
          const coursesWithStudents = response.data.data.filter(course =>
            Object.keys(course.keyValuePairs).length > 0
          );
          setCourses(coursesWithStudents);
        } else {
          throw new Error(response.data.massage || 'Failed to fetch data');
        }

      } catch (err) {
        console.error('Error fetching students:', err);
        if (err.response?.status === 401) {
          setError('Authentication failed. Please log in again.');
        } else if (err.response?.status === 403) {
          setError('Access denied. You do not have permission to view this data.');
        } else {
          setError(err.message || 'Failed to fetch students data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [user]);

  const handleChatClick = (studentId) => {
    navigate(`/chatt/${studentId}`);
  };

  if (loading) {
    return <div className="text-center p-10">{t("loading-students")}...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{t('error')}: {error}</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t("enrolled-students")}</h1>

        {courses.length > 0 ? (
          <div className="space-y-6">
            {courses.map((course) => (
              <div key={course.courseName} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-5 bg-indigo-600">
                  <h2 className="text-xl font-semibold text-white">{course.courseName}</h2>
                </div>

                <ul className="divide-y divide-gray-200">
                  {Object.entries(course.keyValuePairs).map(([studentId, studentName]) => (
                    <li key={studentId} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <p className="text-md font-medium text-gray-800">{studentName}</p>

                      <button
                        onClick={() => handleChatClick(studentId)}
                        aria-label={`Chat with ${studentName}`}
                      >
                        <ChatIcon />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-10 bg-white rounded-lg shadow-md">
            <p className="text-gray-600">{t("no-enrolled-students")}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherStudents;
