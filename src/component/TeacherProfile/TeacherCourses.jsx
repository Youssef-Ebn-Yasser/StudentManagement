import React, { useState, useEffect, useMemo } from 'react';
import { courseService } from '../../services/courseService';
import { FaStar, FaUsers } from 'react-icons/fa';
import Loader from '../Loader/Loader';
import { useNavigate, useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';

const TeacherCourses = ({ setActiveTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const teacherId = user?.id;
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Latest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if we're in course selection mode for adding a lesson or material
  const isAddLessonMode = location.pathname === '/teacher/add-lesson';
  const isAddMaterialMode = location.pathname === '/teacher/add-material';
  const isSelectionMode = isAddLessonMode || isAddMaterialMode;

  useEffect(() => {
    console.log('TeacherCourses mounted with teacherId:', teacherId);
    if (!teacherId) {
      console.error('No teacherId provided to TeacherCourses component');
      setError('Teacher ID is required');
      return;
    }
    fetchCourses();
  }, [teacherId]);

  const fetchCourses = async () => {
    try {
      if (!teacherId) {
        console.error('No teacherId available for fetching courses');
        setError('Teacher ID is required');
        return;
      }
      setLoading(true);
      console.log('Fetching courses for teacherId:', teacherId);
      const response = await courseService.getTeacherCourses(teacherId);
      console.log('Response from getTeacherCourses:', response);
      if (response.succeeded) {
        const coursesData = response.data || [];
        setCourses(Array.isArray(coursesData) ? coursesData : []);
      } else {
        throw new Error(response.messages?.[0] || 'Failed to load courses');
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort courses
  const filteredAndSortedCourses = useMemo(() => {
    // First, filter by search query
    let result = courses.filter(course => {
      const title = course.title || '';
      const description = course.description || '';
      return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             description.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Then, sort the filtered results
    return result.sort((a, b) => {
      switch (sortBy) {
        case 'Most Popular':
          return b.studentsCount - a.studentsCount;
        case 'Price: Low to High':
          return a.price - b.price;
        case 'Price: High to Low':
          return b.price - a.price;
        case 'Latest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  }, [courses, searchQuery, sortBy]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle sort selection change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const getPageTitle = () => {
    if (isAddLessonMode) return 'Select Course for New Lesson';
    if (isAddMaterialMode) return 'Select Course for New Material';
    return 'My Courses';
  };

  const handleCourseAction = (courseId) => {
    if (isAddLessonMode) {
      navigate('/teacher/course/lesson/new', { state: { courseId } });
    } else if (isAddMaterialMode) {
      navigate('/teacher/course/lesson/material/new', { state: { courseId } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto">
          {/* Back to Profile Button */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/teacher/profile')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Profile
            </button>
          </div>

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {getPageTitle()}
            </h1>
            {!isSelectionMode && (
              <button 
                onClick={() => navigate('/teacher/createcourse')}
                className="bg-gradient-to-r from-[var(--primary-dark)] to-[var(--primary-color)] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Course
              </button>
            )}
          </div>

          {!teacherId ? (
            <div className="flex items-center justify-center h-[calc(100vh-300px)]">
              <div className="text-center">
                <div className="scale-[2.5] mb-4">
                  <Loader />
                </div>
                <p className="text-gray-600">Loading teacher information...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Search and Filter Section */}
              <div className="mb-8 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex gap-4">
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Latest">Latest</option>
                    <option value="Most Popular">Most Popular</option>
                    <option value="Price: Low to High">Price: Low to High</option>
                    <option value="Price: High to Low">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Courses Grid */}
              {loading ? (
                <div className="flex items-center justify-center h-[calc(100vh-300px)]">
                  <div className="scale-[2.5]">
                    <Loader />
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-[calc(100vh-300px)] text-red-600 text-2xl">
                  {error}
                </div>
              ) : filteredAndSortedCourses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 xl:gap-10">
                  {filteredAndSortedCourses.map((course) => (
                    <div 
                      key={course?.id || Math.random()} 
                      className="w-full border border-gray-300 rounded-lg overflow-hidden shadow-md font-sans group hover:shadow-lg transition duration-300 h-[300px] lg:h-[330px] flex flex-col"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={course?.imagePath || 'https://via.placeholder.com/300x200'}
                          alt={course?.title || 'Course'}
                          className="block w-full h-[140px] lg:h-[180px] object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-3 lg:p-4 flex-1 flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-500 text-xs lg:text-sm truncate max-w-[60%]">{course?.title || 'Untitled Course'}</span>
                          {course?.level && (
                            <span className="bg-red-400 text-white py-1 px-2 rounded-xl text-xs">
                              {course.level} Level
                            </span>
                          )}
                        </div>
                        <h3 className="mt-0 mb-2 text-sm lg:text-lg font-semibold text-black line-clamp-2 flex-1">
                          {course?.description || 'No description available'}
                        </h3>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                            {course?.categoryName || 'Uncategorized'}
                          </span>
                          <span className="text-base lg:text-xl font-bold text-black">${course?.price || 0}</span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          {isSelectionMode ? (
                            <button 
                              onClick={() => handleCourseAction(course.id)}
                              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 text-sm"
                            >
                              {isAddLessonMode ? 'Add Lesson' : 'Upload Material'}
                            </button>
                          ) : (
                            <>
                              <button 
                                onClick={() => navigate('/teacher/course/details', { state: { courseId: course.id } })}
                                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 text-sm"
                              >
                                View Details
                              </button>
                              <button 
                                onClick={() => navigate('/teacher/course/edit', { state: { courseId: course.id } })}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 text-sm"
                              >
                                Edit
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {searchQuery ? 'No courses match your search' : 'No courses available in this category'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default TeacherCourses;