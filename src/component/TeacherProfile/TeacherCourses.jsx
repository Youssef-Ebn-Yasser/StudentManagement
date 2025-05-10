import React, { useState, useEffect, useMemo } from 'react';
import { courseService } from '../../services/courseService';
import { FaStar, FaUsers } from 'react-icons/fa';
import Loader from '../Loader/Loader';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const TeacherCourses = ({ teacherId, setActiveTab }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Category');
  const [sortBy, setSortBy] = useState('Latest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Categories for the dropdown
  const categories = [
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
    fetchCourses();
  }, [teacherId]);

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

  // Filter and sort courses
  const filteredAndSortedCourses = useMemo(() => {
    // First, filter the courses
    let result = courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All Category' || course.category === selectedCategory;
      return matchesSearch && matchesCategory;
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
  }, [courses, searchQuery, selectedCategory, sortBy]);

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <button 
            onClick={() => setActiveTab('create-course')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
          >
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
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Latest">Latest</option>
              <option value="Oldest">Oldest</option>
              <option value="A-Z">A-Z</option>
              <option value="Z-A">Z-A</option>
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
            <p className="text-gray-500 text-lg">No courses found</p>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default TeacherCourses; 