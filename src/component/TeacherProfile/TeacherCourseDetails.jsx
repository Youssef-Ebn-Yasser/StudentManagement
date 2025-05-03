import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { FaStar, FaUsers, FaClock, FaGraduationCap, FaBook, FaClipboardList, FaTrash, FaEdit } from 'react-icons/fa';
import Loader from '../Loader/Loader';

const TeacherCourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Fixed courses data
  const fixedCourses = {
    1: {
      id: 1,
      title: "Complete Web Development Course",
      category: "Programming",
      description: "Learn web development from scratch to advanced. This comprehensive course covers HTML, CSS, JavaScript, React, Node.js, and more. Perfect for beginners and intermediate developers looking to enhance their skills.",
      imagePath: "https://img-c.udemycdn.com/course/750x422/1430746_2f43_10.jpg",
      price: 49.99,
      rating: 4.8,
      duration: 45,
      level: "Intermediate",
      students: Array(125).fill(null),
      lessons: [
        {
          id: 1,
          title: "Introduction to Web Development",
          description: "Learn the basics of web development and set up your development environment.",
          duration: 60
        },
        {
          id: 2,
          title: "HTML5 Fundamentals",
          description: "Master HTML5 and create structured, semantic web pages.",
          duration: 90
        }
      ]
    }
  };

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        // Check if it's one of our fixed courses
        if (fixedCourses[id]) {
          setCourse(fixedCourses[id]);
        } else {
          // Fallback to API call for other courses
          const response = await courseService.getCourseDetails(id);
          setCourse(response?.data || response);
        }
      } catch (err) {
        setError(err.message || 'Failed to load course details');
        console.error('Error fetching course details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
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
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-xl mb-4">Course not found</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              <img
                src={course.imagePath}
                alt={course.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="w-full md:w-2/3">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/teacher/course/edit/${course.id}`)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    <FaEdit className="inline-block mr-2" />
                    Edit Course
                  </button>
                  <button
                    onClick={() => {/* Handle delete */}}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    <FaTrash className="inline-block mr-2" />
                    Delete Course
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center">
                  <FaStar className="text-yellow-500 mr-2" />
                  <span>{course.rating}</span>
                </div>
                <div className="flex items-center">
                  <FaUsers className="text-blue-500 mr-2" />
                  <span>{course.students.length} students</span>
                </div>
                <div className="flex items-center">
                  <FaClock className="text-green-500 mr-2" />
                  <span>{course.duration} hours</span>
                </div>
                <div className="flex items-center">
                  <FaGraduationCap className="text-purple-500 mr-2" />
                  <span>{course.level}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-gray-900">${course.price}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('lessons')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'lessons'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Lessons
              </button>
            </nav>
          </div>

          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Course Overview</h2>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">What you'll learn</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    <li>Master web development fundamentals</li>
                    <li>Build responsive websites</li>
                    <li>Create interactive web applications</li>
                    <li>Deploy your projects online</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Requirements</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    <li>Basic computer knowledge</li>
                    <li>No prior programming experience required</li>
                    <li>Access to a computer with internet</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'lessons' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Course Lessons</h2>
                <button
                  onClick={() => navigate(`/teacher/course/${course.id}/lesson/new`)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Add New Lesson
                </button>
              </div>
              <div className="space-y-4">
                {course.lessons.map((lesson) => (
                  <div key={lesson.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{lesson.title}</h3>
                        <p className="text-gray-600">{lesson.description}</p>
                        <div className="flex items-center mt-2">
                          <FaClock className="text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500">{lesson.duration} minutes</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/teacher/course/${course.id}/lesson/${lesson.id}/edit`)}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {/* Handle delete */}}
                          className="text-red-500 hover:text-red-600"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherCourseDetails;
