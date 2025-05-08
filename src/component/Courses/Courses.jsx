import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Courses.module.css';
import Loader from '../Loader/Loader';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Get search query from URL
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    setSearchQuery(query);
  }, [location]);

  async function getCourses() {
    try {
      setLoading(true);
      setError(null);
      let { data } = await axios.get('https://e-learn-v1.runasp.net/Course/GetAll');
      console.log(data.data);
      setCourses(data.data);
      setFilteredCourses(data.data);
      
      // Extract unique categories from courses
      const uniqueCategories = [...new Set(data.data.map(course => course.categoryName))].filter(Boolean);
      setCategories(['All', ...uniqueCategories]);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  const filterCourses = (courses, query, category) => {
    let filtered = courses;
    
    // Filter by category
    if (category && category !== 'All') {
      filtered = filtered.filter(course => course.categoryName === category);
    }

    // Filter by search query
    if (query.trim()) {
      const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
      
      filtered = filtered.filter(course => {
        const courseTitle = course.title.toLowerCase();
        const courseCategory = course.categoryName?.toLowerCase() || '';
        const courseLevel = course.level?.toLowerCase() || '';
        
        return searchTerms.some(term => 
          courseTitle.includes(term) ||
          courseCategory.includes(term) ||
          courseLevel.includes(term)
        );
      });
    }

    return filtered;
  };

  useEffect(() => {
    getCourses();
  }, []);

  useEffect(() => {
    setFilteredCourses(filterCourses(courses, searchQuery, selectedCategory));
  }, [searchQuery, courses, selectedCategory]);

  if (loading && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="scale-[3]">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button 
            onClick={getCourses}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Courses</h1>
        <p className="text-center mb-8">Explore our wide range of courses</p>
        {searchQuery && (
          <p className="text-center mb-4 text-gray-600">
            Showing results for: "{searchQuery}"
          </p>
        )}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {filteredCourses.length > 0 ? filteredCourses.map((course) => (
            <Link 
              key={course.id}
              to={`/courses/course/${course.id}`}
            >
              <div
                className={`w-full border border-gray-300 rounded-lg overflow-hidden shadow-md font-sans group ${styles.card} h-[330px] flex flex-col`} 
              >
                <div className="relative overflow-hidden">
                  <img
                    src={course.imagePath}
                    alt={course.title}
                    className="block w-full h-[180px] object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className='p-4 flex-1 flex flex-col'>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500 text-sm">{course.title}</span>
                    {course.level && (
                      <span className="bg-red-400 text-white py-1 px-2 rounded-xl text-xs">
                        {course.level} level
                      </span>
                    )}
                  </div>
                  <h3 className="mt-0 mb-2 text-lg font-semibold text-black line-clamp-2 flex-1">
                    {course.description}
                  </h3>
                  <div className="flex justify-between items-center mt-auto">
                    <div className="flex items-center">
                      <i className="fas fa-star text-yellow-500 text-sm"></i>
                      <span className="ml-1 text-sm text-black">4.5</span>
                      <span className="text-gray-500 text-sm ps-1">(1253)</span>
                    </div>
                    <span className="text-xl font-bold text-black">${course.price}</span>
                  </div>
                </div>
              </div>
            </Link>
          )) : (
            <div className="col-span-full flex flex-col items-center justify-center min-h-[60vh]">
              {searchQuery ? (
                <div className="text-center">
                  <p className="text-xl text-gray-600 mb-4">No courses found matching "{searchQuery}"</p>
                  <p className="text-gray-500">Try searching with different keywords or check your spelling</p>
                </div>
              ) : (
                <div className="scale-[3]">
                  <Loader />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Courses;