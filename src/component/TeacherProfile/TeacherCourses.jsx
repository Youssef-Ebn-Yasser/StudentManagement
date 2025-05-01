import React, { useState, useEffect, useMemo } from 'react';
import { courseService } from '../../services/courseService';
import { Link } from 'react-router-dom';
import { FaStar, FaUsers } from 'react-icons/fa';

const TeacherCourses = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Complete Web Development Course",
      category: "Programming",
      description: "Learn web development from scratch to advanced",
      imagePath: "https://img-c.udemycdn.com/course/750x422/1430746_2f43_10.jpg",
      price: 49.99,
      rating: 4.8,
      students: Array(125).fill(null),
    },
    {
      id: 2,
      title: "UI/UX Design Masterclass",
      category: "Design",
      description: "Master the art of user interface and user experience design",
      imagePath: "https://img-c.udemycdn.com/course/750x422/1650610_2673_5.jpg",
      price: 39.99,
      rating: 4.9,
      students: Array(98).fill(null),
    },
    {
      id: 3,
      title: "Digital Marketing Essentials",
      category: "Marketing",
      description: "Learn digital marketing strategies and techniques",
      imagePath: "https://img-c.udemycdn.com/course/750x422/903744_8eb2.jpg",
      price: 44.99,
      rating: 4.7,
      students: Array(156).fill(null),
    }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Category');
  const [sortBy, setSortBy] = useState('Latest');
  const [loading, setLoading] = useState(false);
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
    // Commenting out the API call since we're using fixed courses
    // fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseService.getAllCourses();
      const coursesData = response?.data || [];
      setCourses(Array.isArray(coursesData) ? coursesData : []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses');
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
          return b.students.length - a.students.length;
        case 'Price: Low to High':
          return a.price - b.price;
        case 'Price: High to Low':
          return b.price - a.price;
        case 'Latest':
        default:
          return b.id - a.id; // Assuming newer courses have higher IDs
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
    <div className="w-full min-h-screen bg-white">
      <div className="w-full p-8 lg:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl lg:text-5xl font-bold">My Courses</h1>
            <span className="bg-[#6C63FF] text-white px-6 py-3 rounded-full text-lg">
              {filteredAndSortedCourses.length} Courses
            </span>
          </div>
          <Link 
            to="/teacher/createcourse" 
            className="bg-[#6C63FF] hover:bg-[#5952ff] text-white px-10 py-4 rounded-md text-center text-xl font-semibold ml-auto"
          >
            Create New Course
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row justify-between gap-6 mb-12">
          <div className="w-full lg:w-auto">
            <input
              type="text"
              placeholder="Search in your courses..."
              className="px-8 py-5 text-xl border border-gray-200 rounded-md focus:outline-none focus:border-[#6C63FF] w-full lg:w-[500px]"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-end">
            <select
              className="px-8 py-5 text-xl border border-gray-200 rounded-md focus:outline-none focus:border-[#6C63FF] w-full sm:w-72"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="Latest">Latest</option>
              <option value="Most Popular">Most Popular</option>
              <option value="Price: Low to High">Price: Low to High</option>
              <option value="Price: High to Low">Price: High to Low</option>
            </select>
            <select
              className="px-8 py-5 text-xl border border-gray-200 rounded-md focus:outline-none focus:border-[#6C63FF] w-full sm:w-72"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-[calc(100vh-300px)]">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-[#6C63FF]"></div>
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
                <div className="p-8 flex flex-col flex-grow">
                  <div className="text-base font-semibold text-[#6C63FF] uppercase mb-4">
                    {course?.category || 'UNCATEGORIZED'}
                  </div>
                  <h3 className="text-2xl font-semibold text-[#1e2022] mb-6 line-clamp-2 flex-grow">
                    {course?.title || 'Untitled Course'}
                  </h3>
                  <div className="flex items-center mb-6">
                    <FaStar className="text-[#ffc107] text-2xl mr-3" />
                    <span className="text-lg text-gray-600 mr-8">{course?.rating || 4.5}</span>
                    <FaUsers className="text-gray-400 text-2xl mr-3" />
                    <span className="text-lg text-gray-600">
                      {course?.students?.length || 0} students
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
                    <span className="text-3xl font-bold text-[#6C63FF]">
                      ${course?.price || 0}
                    </span>
                    <Link
                      to={`/course/${course?.id}`}
                      className="bg-[#6C63FF] text-white hover:bg-[#5952ff] px-6 py-3 rounded-md font-semibold text-lg flex items-center gap-2 transition duration-300"
                    >
                      View Details 
                      <span className="text-xl">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-300px)]">
            <p className="text-gray-600 text-2xl mb-8">No courses found matching your criteria</p>
            <Link
              to="/teacher/profile/createcourse"
              className="bg-[#6C63FF] text-white hover:bg-[#5952ff] px-8 py-4 rounded-md font-semibold text-xl flex items-center gap-3"
            >
              Create your first course 
              <span className="text-2xl">→</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherCourses; 