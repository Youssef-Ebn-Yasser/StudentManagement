import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Courses.module.css';
import Loader from '../Loader/Loader';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
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
      let { data } = await axios.get('http://e-learn-v1.runasp.net/Course/GetAll');
      console.log(data.data);
      setCourses(data.data);
      setFilteredCourses(data.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  const filterCourses = (courses, query) => {
    if (!query.trim()) {
      return courses;
    }

    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    return courses.filter(course => {
      const courseTitle = course.title.toLowerCase();
      const courseCategory = course.category?.toLowerCase() || '';
      const courseLevel = course.level?.toLowerCase() || '';
      
      return searchTerms.some(term => 
        courseTitle.includes(term) ||
        courseCategory.includes(term) ||
        courseLevel.includes(term)
      );
    });
  };

  useEffect(() => {
    getCourses();
  }, []);

  useEffect(() => {
    setFilteredCourses(filterCourses(courses, searchQuery));
  }, [searchQuery, courses]);

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
    <>
      <div className="min-h-screen w-full max-w-[1300px] mx-auto px-4 bg-white mt-[75px]">
        <div className="p-6 max-w-7xl mx-auto mt-10">
          <h1 className="text-2xl font-bold text-center mb-4">Courses</h1>
          <p className="text-center mb-8">Explore our wide range of courses</p>
          {searchQuery && (
            <p className="text-center mb-4 text-gray-600">
              Showing results for: "{searchQuery}"
            </p>
          )}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
            {filteredCourses.length > 0 ? filteredCourses.map((course) => (
              <Link to={`/course/${course.id}`}>
                <div
                  key={course.id}
                  className={`w-72 border border-gray-300 rounded-lg overflow-hidden shadow-md font-sans group ${styles.card} h-[330px] flex flex-col`} 
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
    </>
  );
}

export default Courses;