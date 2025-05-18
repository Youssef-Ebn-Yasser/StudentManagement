import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function StudentProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentData, setStudentData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    education: '',
    skills: [],
    interests: [],
    image: '',
    enrolledCourses: []
  });

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        
        // Fetch student details
        const studentResponse = await axios.get(`https://e-learn-v1.runasp.net/api/Student/GetById/GetById/85`);
        
        // Fetch enrolled courses
        const coursesResponse = await axios.get(`https://e-learn-v1.runasp.net/api/Student/GetAllEnrolledStudentCourses/GetAllEnrolledStudentCourses?studentId=85`);

        if (studentResponse.data.succeeded && coursesResponse.data.succeeded) {
          setStudentData({
            name: studentResponse.data.data.name || 'Not provided',
            email: studentResponse.data.data.email || 'Not provided',
            phone: 'Not provided',
            bio: 'No bio available',
            education: 'Not provided',
            skills: [],
            interests: [],
            image: 'https://via.placeholder.com/150',
            enrolledCourses: coursesResponse.data.data.map(course => ({
              id: course.id,
              title: course.title,
              description: course.description,
              imagePath: course.imagePath,
              level: course.level || 'Not specified',
              hours: course.hours || 'Not specified',
              categoryName: course.categoryName
            }))
          });
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (err) {
        setError('Failed to fetch student data');
        console.error('Student data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const handleEditProfile = () => {
    navigate('/studentprofile/edit-profile');
  };

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
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white border rounded-xl p-8 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <img
                src={studentData.image}
                alt={studentData.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100"
              />
              <button
                onClick={handleEditProfile}
                className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors"
              >
                <i className="fa fa-camera"></i>
              </button>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-indigo-700 mb-2">{studentData.name}</h1>
              <p className="text-gray-500 mb-4">{studentData.email}</p>
              <button
                onClick={handleEditProfile}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-indigo-700 mb-4">About</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">Bio</h3>
                  <p className="text-gray-700">{studentData.bio}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">Education</h3>
                  <p className="text-gray-700">{studentData.education}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">Phone</h3>
                  <p className="text-gray-700">{studentData.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-indigo-700 mb-4">Enrolled Courses</h2>
              <div className="space-y-4">
                {studentData.enrolledCourses.map((course) => (
                  <div key={course.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={course.imagePath} 
                        alt={course.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{course.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                        <div className="mt-2 flex gap-2">
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                            {course.categoryName}
                          </span>
                          {course.level && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                              {course.level}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
