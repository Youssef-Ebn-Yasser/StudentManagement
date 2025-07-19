import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaPhone,
  FaChevronLeft,
  FaChevronRight,
  FaTachometerAlt,
} from 'react-icons/fa';
import axiosInstance from '../../services/axiosInstance';

export default function StudentProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentData, setStudentData] = useState({
    name: '',
    email: '',
    phone: '',
    imageUrl: '',
    enrolledCourses: [],
  });
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);

  // Get studentId from localStorage (set this at login)
  const studentId = localStorage.getItem('guestId');

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);

        if (!studentId) {
          setError('NO_STUDENT_ID');
          return;
        }

        // Fetch student details
        const studentResponse = await axiosInstance.get(
          `/api/Student/GetById/GetById/${studentId}`
        );

        // Fetch enrolled courses
        const coursesResponse = await axiosInstance.get(
          `/api/Student/GetAllEnrolledStudentCourses/GetAllEnrolledStudentCourses?studentId=${studentId}`
        );

        if (studentResponse.data.succeeded && coursesResponse.data.succeeded) {
          const student = studentResponse.data.data;
          const enrolledCourses = coursesResponse.data.data || [];
          setStudentData({
            name: student.name || 'Not provided',
            email: student.email || 'Not provided',
            phone: student.phone || 'Not provided',
            imageUrl: student.imageUrl || 'https://via.placeholder.com/150',
            enrolledCourses: enrolledCourses,
          });
          setCurrentCourseIndex(0); // Reset slider to first course
        } else {
          throw new Error('Failed to fetch student data or courses');
        }
      } catch (err) {
        setError('Failed to fetch student data');
        console.error('Student data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [studentId]);

  const handleEditProfile = () => {
    navigate('/studentprofile/edit-profile');
  };

  const handlePrevCourse = () => {
    setCurrentCourseIndex((prev) =>
      prev === 0 ? studentData.enrolledCourses.length - 1 : prev - 1
    );
  };

  const handleNextCourse = () => {
    setCurrentCourseIndex((prev) =>
      prev === studentData.enrolledCourses.length - 1 ? 0 : prev + 1
    );
  };

  const handleGoToDashboard = () => {
    navigate('/studentdashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7fa]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    if (error === 'NO_STUDENT_ID') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#f4f7fa]">
          <div className="text-red-600 text-center">
            <p className="text-xl font-semibold">You have to login to show your profile</p>
            <button
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow hover:bg-indigo-700 transition-all"
              onClick={() => navigate('/auth/login')}
            >
              Go to Login
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7fa]">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold">{error}</p>
          <p className="text-sm mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  const hasCourses = studentData.enrolledCourses.length > 0;
  const currentCourse = hasCourses ? studentData.enrolledCourses[currentCourseIndex] : null;

  return (
    <div className="bg-[#f4f7fa] min-h-screen px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white border rounded-2xl p-8 shadow-lg mb-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative group">
              <img
                src={studentData.imageUrl}
                alt={studentData.name}
                className="w-36 h-36 rounded-full object-cover border-4 border-indigo-200 shadow-md transition-transform duration-300 group-hover:scale-105"
              />
              <button
                onClick={handleEditProfile}
                className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
                title="Edit Profile Picture"
              >
                <i className="fa fa-camera"></i>
              </button>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-extrabold text-indigo-700 mb-2">{studentData.name}</h1>
              <p className="text-gray-500 mb-4">{studentData.email}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <button
                  onClick={handleEditProfile}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg font-semibold shadow hover:from-indigo-600 hover:to-blue-600 transition-all"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleGoToDashboard}
                  className="flex items-center gap-2 px-6 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-semibold shadow hover:bg-indigo-100 border border-indigo-200 transition-all"
                  title="Go to Dashboard"
                >
                  <FaTachometerAlt className="text-lg" />
                  Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* About Section */}
          <div className="bg-white border rounded-2xl p-6 shadow">
            <h2 className="text-xl font-bold text-indigo-700 mb-4">About</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Phone</h3>
                <p className="text-gray-700 flex items-center gap-2">
                  <FaPhone className="text-indigo-600" /> {studentData.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Enrolled Courses Section as Slider */}
          <div className="bg-[#e9f0fb] border rounded-2xl p-6 shadow relative overflow-hidden">
            <h2 className="text-xl font-bold text-indigo-700 mb-4">Enrolled Courses</h2>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={handlePrevCourse}
                disabled={!hasCourses || studentData.enrolledCourses.length === 1}
                className={`p-2 rounded-full border border-indigo-200 bg-white shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400
                  ${!hasCourses || studentData.enrolledCourses.length === 1
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-indigo-600 hover:text-white hover:border-indigo-600'}
                `}
                aria-label="Previous Course"
              >
                <FaChevronLeft size={20} />
              </button>
              <div className="flex-1 min-w-0">
                {hasCourses ? (
                  <div className="border border-indigo-100 rounded-xl p-4 flex items-center gap-6 bg-white shadow hover:shadow-xl transition-shadow duration-200">
                    <img
                      src={currentCourse.imagePath}
                      alt={currentCourse.title}
                      className="w-24 h-24 object-cover rounded-xl border-2 border-indigo-200 shadow transition-transform duration-200 hover:scale-105"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-indigo-800 text-lg truncate">{currentCourse.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 truncate">{currentCourse.description}</p>
                      <div className="mt-2 flex gap-2 flex-wrap">
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                          {currentCourse.categoryName}
                        </span>
                        {currentCourse.level && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            {currentCourse.level}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">No enrolled courses found.</p>
                )}
              </div>
              <button
                onClick={handleNextCourse}
                disabled={!hasCourses || studentData.enrolledCourses.length === 1}
                className={`p-2 rounded-full border border-indigo-200 bg-white shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400
                  ${!hasCourses || studentData.enrolledCourses.length === 1
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-indigo-600 hover:text-white hover:border-indigo-600'}
                `}
                aria-label="Next Course"
              >
                <FaChevronRight size={20} />
              </button>
            </div>
            {hasCourses && (
              <div className="text-center text-xs text-gray-500 mt-2">
                Course {currentCourseIndex + 1} of {studentData.enrolledCourses.length}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}