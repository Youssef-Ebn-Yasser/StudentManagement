import axios from 'axios';
import React, { useState, useEffect } from 'react';

function Courses() {
  const [courses, setCourses] = useState([]);

  async function getCourses() {
    try {
      let { data } = await axios.get('http://e-learn-v1.runasp.net/Course/GetAll');
      console.log(data.data); // Log the data to see its structure
      setCourses(data.data); // Assuming `data.data` contains the array of courses
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }

  useEffect(() => {
    getCourses();
  }, []);

  // Add body styling effect
  useEffect(() => {
    // Set body styles when the component is mounted
    document.body.style.display = 'block';
    document.body.style.backgroundColor = 'white';

    // Cleanup function to reset styles when the component unmounts
    return () => {
      document.body.style.display = '';
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <>
      <div className="p-6  max-w-4xl mx-auto mt-10">
        <h1 className="text-2xl font-bold text-center mb-4">Courses</h1>
        <p className="text-center mb-4">Explore our wide range of courses</p>
        <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-5">
          {courses.map((course, index) => (
            <div
              key={index}
              className="w-72 border border-gray-300 rounded-lg overflow-hidden shadow-md font-sans group "
            >
              <div className="relative overflow-hidden">
              <img
                src={course.imagePath} // Assuming the API provides an `imagePath` field
                alt={course.title} // Assuming the API provides a `title` field
                className="block w-full h-auto transition-transform duration-300 group-hover:scale-110"
              />
              </div>
              <div className='p-4'>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">{course.title}</span>
                <span className="bg-red-400 text-white py-1 px-2 rounded-xl text-xs">
                  Beginner Level
                </span>
              </div>
              <h3 className="mt-0 mb-2 text-lg font-semibold text-black">
              {course.description}
              </h3>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <i className="fas fa-star text-yellow-500 text-sm"></i>
                  <span className="ml-1 text-sm text-black">4.5</span>
                  <span className="text-gray-500 text-sm ps-1">(1253)</span>
                </div>
                <span className="text-xl font-bold text-black">${course.price}</span>
              </div>
              </div>


            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Courses;