import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  useEffect(() => {
    // Get search query and category from URL
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    const category = params.get('category') || 'All';
    setSearchQuery(query);
    setSelectedCategory(category);
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

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(location.search);
    if (category === 'All') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    navigate(`/courses?${params.toString()}`);
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
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar - Hidden on mobile, shown as dropdown */}
      <div className="lg:w-64 bg-white shadow-lg p-4 lg:p-6">
        <div className="lg:hidden mb-4">
          <select
            value={selectedCategory}
            onChange={(e) => handleCategorySelect(e.target.value)}
            className="w-full p-2 border rounded-lg bg-white"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <h2 className="text-xl font-bold mb-4 hidden lg:block">Categories</h2>
        <div className="space-y-2 hidden lg:block">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
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
      <div className="flex-1 p-4 lg:p-6">
        <h1 className="text-xl lg:text-2xl font-bold text-center mb-2 lg:mb-4">Courses</h1>
        <p className="text-sm lg:text-base text-center mb-4 lg:mb-8">Explore our wide range of courses</p>
        {searchQuery && (
          <p className="text-center mb-4 text-gray-600 text-sm lg:text-base">
            Showing results for: "{searchQuery}"
          </p>
        )}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8'>
          {filteredCourses.length > 0 ? filteredCourses.map((course) => (
            <Link 
              key={course.id}
              to={`/courses/course/${course.id}`}
            >
              <div
                className={`w-full border border-gray-300 rounded-lg overflow-hidden shadow-md font-sans group ${styles.card} h-[300px] lg:h-[330px] flex flex-col`} 
              >
                <div className="relative overflow-hidden">
                  <img
                    src={course.imagePath}
                    alt={course.title}
                    className="block w-full h-[140px] lg:h-[180px] object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
<div className='p-3 lg:p-4 flex-1 flex flex-col'>
  <div className="flex justify-between items-center mb-2">
    <span className="text-gray-500 text-xs lg:text-sm truncate max-w-[60%]">{course.title}</span>
    {course.level && (
      <span className="bg-red-400 text-white py-1 px-2 rounded-xl text-xs">
        {course.level} Level
      </span>
    )}
  </div>
  <h3 className="mt-0 mb-2 text-sm lg:text-lg font-semibold text-black line-clamp-2 flex-1">
    {course.description}
  </h3>
  <div className="flex items-center justify-between mt-auto">
    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
      {course.categoryName}
    </span>
    <span className="text-base lg:text-xl font-bold text-black">${course.price}</span>
  </div>
</div>
              </div>
            </Link>
          )) : (
            <div className="col-span-full flex flex-col items-center justify-center min-h-[50vh] lg:min-h-[60vh]">
              {searchQuery ? (
                <div className="text-center px-4">
                  <p className="text-lg lg:text-xl text-gray-600 mb-2 lg:mb-4">No courses found matching "{searchQuery}"</p>
                  <p className="text-sm lg:text-base text-gray-500">Try searching with different keywords or check your spelling</p>
                </div>
              ) : (
                <div className="scale-[2] lg:scale-[3]">
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