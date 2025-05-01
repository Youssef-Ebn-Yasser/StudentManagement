import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Courses.module.css';
import Loader from '../Loader/Loader';

function Courses() {
  const [courses, setCourses] = useState([]);

  async function getCourses() {
    try {
      let { data } = await axios.get('http://e-learn-v1.runasp.net/Course/GetAll');
      console.log(data.data);
      setCourses(data.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }

  useEffect(() => {
    getCourses();
  }, []);

  useEffect(() => {
    document.body.style.display = 'block';
    document.body.style.backgroundColor = 'white';
    return () => {
      document.body.style.display = '';
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <>
      <div className="min-h-screen w-full max-w-[1300px] mx-auto px-4 bg-white mt-[75px]">
        <div className="p-6 max-w-7xl mx-auto mt-10">
          <h1 className="text-2xl font-bold text-center mb-4">Courses</h1>
          <p className="text-center mb-8">Explore our wide range of courses</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {courses.length > 0 ? courses.map((course, index) => (
              <div
                key={index}
                className={`w-72 border border-gray-300 rounded-lg overflow-hidden shadow-md font-sans group ${styles.card}`} 
              >
                <div className="relative overflow-hidden">
                  <img
                    src={course.imagePath}
                    alt={course.title}
                    className="block w-full h-[180px] object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className='p-4'>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500 text-sm">{course.title}</span>
                    <span className="bg-red-400 text-white py-1 px-2 rounded-xl text-xs">
                      Beginner Level
                    </span>
                  </div>
                  <h3 className="mt-0 mb-2 text-lg font-semibold text-black line-clamp-2">
                    {course.description}
                  </h3>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <i className="fas fa-star text-yellow-500 text-sm"></i>
                      <span className="ml-1 text-sm text-black">4.5</span>
                      <span className="text-gray-500 text-sm ps-1">(1253)</span>
                    </div>
                    <span className="text-xl font-bold text-black">${course.price}</span>
                  </div>
                  <Link
                    to={`/course/${course.id}`}
                    className="w-full bg-[#6C63FF] text-white hover:bg-[#5952ff] px-4 py-2 rounded-md font-semibold text-center block transition duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            )) : (
              <div className="col-span-full flex items-center justify-center min-h-[60vh]">
                <div className="scale-[2.5]">
                  <Loader />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Courses;