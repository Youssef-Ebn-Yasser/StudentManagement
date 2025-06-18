import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaUserGraduate, FaBook, FaClock, FaEnvelope, FaPhone, FaLinkedin, FaTwitter, FaFacebook, FaComments } from 'react-icons/fa'; // Added FaComments for the chat icon
import Loader from '../Loader/Loader';
import toast from 'react-hot-toast';

const TeacherProfileView = () => {
  const { teacherName } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch teacher profile by name
        const teacherResponse = await axios.get(`https://e-learn-v1.runasp.net/api/Teacher/Teacher/ByName/${teacherName}`);
        console.log('Teacher Response:', teacherResponse.data);
        if (!teacherResponse.data.succeeded) {
          throw new Error(teacherResponse.data.message || 'Failed to load teacher information');
        }
        setTeacher(teacherResponse.data.data);

        // Fetch teacher's courses using the teacher's ID from the response
        if (teacherResponse.data.data?.id) {
          console.log('Fetching courses for teacher ID:', teacherResponse.data.data.id);
          const coursesResponse = await axios.get(`https://e-learn-v1.runasp.net/Course/GetAllCoursesOfTeacher/${teacherResponse.data.data.id}`);
          console.log('Courses Response:', coursesResponse.data);
          if (!coursesResponse.data.succeeded) {
            throw new Error(coursesResponse.data.message || 'Failed to load teacher courses');
          }
          setCourses(coursesResponse.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching teacher data:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load teacher information';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [teacherName]);

  // Add console log to check courses state
  useEffect(() => {
    console.log('Current courses state:', courses);
  }, [courses]);

  // Handle chat button click
  const handleChatClick = () => {
    // You'll need to define how your chat page identifies the conversation.
    // Common approaches:
    // 1. Pass the teacher's ID: `/chat/${teacher.id}`
    // 2. Pass the teacher's name: `/chat/${teacher.name}`
    // 3. Initiate a new chat session and get a chat room ID, then navigate.
    // For this example, I'm using teacher.id as it's a unique identifier.
    if (teacher && teacher.id) {
      navigate(`/chat/${teacher.id}`);
      // Or if your chat route is simpler, e.g., for a general chat:
      // navigate('/chat');
    } else {
      toast.error("Cannot start chat: Teacher ID not available.");
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-center text-red-500 mt-8">{error}</div>;
  if (!teacher) return <div className="text-center text-gray-500 mt-8">Teacher not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Teacher Profile Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8 relative"> {/* Added relative for FAB positioning */}
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Teacher Image */}
          <div className="w-48 h-48 rounded-full overflow-hidden">
            <img
              src={teacher.imageUrl || '../../../public/teacher-photo.avif'}
              alt={teacher.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '../../../public/teacher-photo.avif';
              }}
            />
          </div>

          {/* Teacher Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{teacher.name}</h1>
            <p className="text-gray-600 mb-4">{teacher.specialization}</p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <FaStar className="text-yellow-400" />
                <span>{teacher.rating || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaUserGraduate className="text-blue-500" />
                <span>{teacher.students || 0} Students</span>
              </div>
              <div className="flex items-center gap-2">
                <FaBook className="text-green-500" />
                <span>{courses.length || 0} Courses</span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-purple-500" />
                <span>{teacher.experience || 0} Years</span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2">
              {teacher.email && (
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-gray-400" />
                  <span className="text-gray-600">{teacher.email}</span>
                </div>
              )}
              {teacher.phone && (
                <div className="flex items-center gap-2">
                  <FaPhone className="text-gray-400" />
                  <span className="text-gray-600">{teacher.phone}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-4">
              {teacher.linkedin && (
                <a href={teacher.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                  <FaLinkedin className="text-2xl" />
                </a>
              )}
              {teacher.twitter && (
                <a href={teacher.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                  <FaTwitter className="text-2xl" />
                </a>
              )}
              {teacher.facebook && (
                <a href={teacher.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                  <FaFacebook className="text-2xl" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* --- Chat Button --- */}
        {/* Placed absolutely within the teacher profile section or fixed to the viewport */}
        <button
          onClick={handleChatClick}
          className="
            absolute        
            bottom-4        
            right-4
            md:mt-6        
            bg-indigo-600   
            text-white
            py-3
            px-6
            rounded-full
            shadow-lg
            hover:bg-indigo-700
            hover:shadow-xl
            hover:scale-105
            focus:outline-none
            focus:ring-2
            focus:ring-indigo-500
            focus:ring-opacity-75
            transition-all
            duration-300
            ease-in-out
            flex
            items-center
            justify-center
            space-x-2
            z-10           
          "
          aria-label="Start chat with teacher"
          title={`Start chat with ${teacher.name}`}
        >
          <FaComments className="text-xl" />
          <span className="text-lg font-semibold hidden md:inline"> Chat</span> {/* Hide text on small screens, show on medium+ */}
        </button>
        {/* --- End Chat Button --- */}

      </div> {/* End Teacher Profile Section */}

      {/* Teacher's Courses */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Teacher's Courses</h2>
        {courses.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No courses available</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/courses/course/${course.id}`)}
              >
                <img
                  src={course.imagePath || 'https://placehold.co/300x200'}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 font-semibold">${course.price}</span>
                    <span className="text-gray-500 text-sm">{course.level} Level</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherProfileView;