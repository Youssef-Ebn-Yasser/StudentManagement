import React, { useState, useEffect, useMemo } from 'react';
import { courseService } from '../../services/courseService';
import { FaStar, FaUsers } from 'react-icons/fa';
import Loader from '../Loader/Loader';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import axiosInstance from '../../services/axiosInstance';

const TeacherCourses = ({ teacherId, setActiveTab }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Category');
  const [sortBy, setSortBy] = useState('Latest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // Categories for the dropdown
  const categoriesForDropdown = [
    'All Category',
    'Programming',
    'Design',
    'Business',
    'Marketing',
    'Science',
    'Mathematics',
    'Languages',
    'Arts'
  ];

  useEffect(() => {
    fetchCategories();
    if (selectedCategory === 'All Category') {
      fetchCourses();
    } else {
      fetchCoursesByCategory();
    }
  }, [teacherId, selectedCategory]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseService.getAllCourses();
      const coursesData = response?.data || [];
      // Show all courses without filtering by teacher ID
      setCourses(Array.isArray(coursesData) ? coursesData : []);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchCoursesByCategory = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/Course/GetAllByCategory?categoryName=${selectedCategory}`);
      console.log('Courses by category response:', response);
      
      if (response.data && response.data.succeeded) {
        const coursesData = response.data.data || [];
        setCourses(Array.isArray(coursesData) ? coursesData : []);
      } else {
        console.error('Unexpected response structure:', response.data);
        setCourses([]);
      }
    } catch (err) {
      console.error('Error fetching courses by category:', err);
      setError('Failed to load courses for this category');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const response = await axiosInstance.get('/api/Category/GetAll');
      console.log('Categories API Response:', response);
      
      // Check if response has data property
      if (response.data && response.data.data) {
        setCategories(response.data.data);
      } else if (response.data && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.error('Unexpected categories data structure:', response.data);
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Filter and sort courses
  const filteredAndSortedCourses = useMemo(() => {
    // First, filter by search query
    let result = courses.filter(course => {
      return course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             course.description.toLowerCase().includes(searchQuery.toLowerCase());
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

  // Handle category selection change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Handle sort selection change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="w-full min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
            <button 
              onClick={() => navigate('/teacher/createcourse')}
              className="bg-gradient-to-r from-[var(--primary-dark)] to-[var(--primary-color)] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Course
            </button>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[200px] appearance-none"
                  disabled={isLoadingCategories}
                >
                  <option value="All Category">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {isLoadingCategories && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <div className="animate-spin h-5 w-5 text-gray-400">
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
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
                <div key={course?.id || Math.random()} className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition duration-300 flex flex-col">
                  <img
                    src={course?.imagePath || 'https://via.placeholder.com/300x200'}
                    alt={course?.title || 'Course'}
                    className="w-full h-64 object-cover rounded-t-xl"
                  />
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                        {course?.title || 'Untitled Course'}
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {course?.description || 'No description available'}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                        <FaStar className="text-yellow-400 mr-1" />
                        <span className="text-gray-700">{course?.rating || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <FaUsers className="text-gray-400 mr-1" />
                        <span className="text-gray-700">{course?.students || 0} students</span>
                      </div>
                    </div>
                    <div className="mt-auto">
                    <button 
                        onClick={() => navigate(`/teacher/course/${course.id}`)}
                        className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                    >
                      View Details
                    </button>
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
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default TeacherCourses; 