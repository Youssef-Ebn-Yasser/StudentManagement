import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import img1 from '../../assets/homepicstatic1.jpg';
import img2 from '../../assets/homepicstatic2.jpg';
import img3 from '../../assets/homepicstatic2.jpg';
import img4 from '../../assets/homepicstatic1.jpg';
import img from '../../assets/sliderpic.jpg';
import styles from './Home.module.css';
import { getPaginatedCourses } from '../../services/courseService';

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Recommended Courses State
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [recommendedPage, setRecommendedPage] = useState(1);
  const [recommendedTotalPages, setRecommendedTotalPages] = useState(1);
  const [recommendedLoading, setRecommendedLoading] = useState(true);
  const [recommendedError, setRecommendedError] = useState(null);

  // Popular Courses State
  const [popularCourses, setPopularCourses] = useState([]);
  const [popularPage, setPopularPage] = useState(1);
  const [popularTotalPages, setPopularTotalPages] = useState(1);
  const [popularLoading, setPopularLoading] = useState(true);
  const [popularError, setPopularError] = useState(null);

  // Trending Courses State
  const [trendingCourses, setTrendingCourses] = useState([]);
  const [trendingPage, setTrendingPage] = useState(1);
  const [trendingTotalPages, setTrendingTotalPages] = useState(1);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [trendingError, setTrendingError] = useState(null);

  const slides = [
    {
      title: 'Digital Illustrations',
      description:
        'Qui aliquip quis magna non sint voluptate officia qui. Laborum sit mollit id sint et dolore conseq.',
      buttonText: 'Explore more',
      img: img,
    },
    {
      title: 'Creative Designs',
      description:
        'Explore the world of creative designs with our expert tutorials and resources.',
      buttonText: 'Learn More',
      img: img,
    },
  ];

  // Fetch Recommended Courses
  useEffect(() => {
    let isMounted = true;

    const fetchRecommendedCourses = async () => {
      try {
        setRecommendedLoading(true);
        setRecommendedError(null);
        const response = await getPaginatedCourses(recommendedPage);
        
        if (!isMounted) return;

        if (response?.succeeded && response?.data?.data) {
          setRecommendedCourses(response.data.data);
          setRecommendedTotalPages(response.data.totalPage || 1);
        } else {
          setRecommendedError('Invalid response format from server');
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Error fetching recommended courses:', error);
        setRecommendedError(error.message || 'An error occurred while fetching courses');
      } finally {
        if (isMounted) {
          setRecommendedLoading(false);
        }
      }
    };

    fetchRecommendedCourses();

    return () => {
      isMounted = false;
    };
  }, [recommendedPage]);

  // Fetch Popular Courses
  useEffect(() => {
    let isMounted = true;

    const fetchPopularCourses = async () => {
      try {
        setPopularLoading(true);
        setPopularError(null);
        const response = await getPaginatedCourses(popularPage);
        
        if (!isMounted) return;

        if (response?.succeeded && response?.data?.data) {
          setPopularCourses(response.data.data);
          setPopularTotalPages(response.data.totalPage || 1);
        } else {
          setPopularError('Invalid response format from server');
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Error fetching popular courses:', error);
        setPopularError(error.message || 'An error occurred while fetching courses');
      } finally {
        if (isMounted) {
          setPopularLoading(false);
        }
      }
    };

    fetchPopularCourses();

    return () => {
      isMounted = false;
    };
  }, [popularPage]);

  // Fetch Trending Courses
  useEffect(() => {
    let isMounted = true;

    const fetchTrendingCourses = async () => {
      try {
        setTrendingLoading(true);
        setTrendingError(null);
        const response = await getPaginatedCourses(trendingPage);
        
        if (!isMounted) return;

        if (response?.succeeded && response?.data?.data) {
          setTrendingCourses(response.data.data);
          setTrendingTotalPages(response.data.totalPage || 1);
        } else {
          setTrendingError('Invalid response format from server');
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Error fetching trending courses:', error);
        setTrendingError(error.message || 'An error occurred while fetching courses');
      } finally {
        if (isMounted) {
          setTrendingLoading(false);
        }
      }
    };

    fetchTrendingCourses();

    return () => {
      isMounted = false;
    };
  }, [trendingPage]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <button
          className={`px-4 py-2 rounded-md ${
            currentPage === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          } transition-colors duration-200`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <div className="flex items-center gap-2">
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              className={`w-10 h-10 rounded-md ${
                currentPage === idx + 1
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } transition-colors duration-200`}
              onClick={() => onPageChange(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
        </div>
        <button
          className={`px-4 py-2 rounded-md ${
            currentPage === totalPages
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          } transition-colors duration-200`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  };

  const CourseCard = ({ course }) => (
    <Link
      key={course.id}
      to={`/courses/course/${course.id}`}
      className={`w-72 border border-gray-300 rounded-lg overflow-hidden shadow-md font-sans group ${styles.card}`}
    >
      <div className="relative overflow-hidden">
        <img
          src={course.imagePath || img}
          alt={course.title}
          className="block w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            e.target.src = img;
          }}
        />
      </div>
      <div className="p-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-gray-500 text-sm">{course.level || 'All Levels'}</span>
        </div>
        <h3 className="mt-0 mb-1 text-lg font-semibold text-black line-clamp-2">
          {course.title}
        </h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{course.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <i className="fas fa-star text-yellow-500 text-sm"></i>
            <span className="ml-1 text-sm text-black">4.5</span>
            <span className="text-gray-500 text-sm ps-1">(1253)</span>
          </div>
          <span className="text-xl font-bold text-black">${course.price}</span>
        </div>
      </div>
    </Link>
  );

  const CourseSection = ({ title, courses, loading, error, currentPage, totalPages, onPageChange }) => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-black">{title}</h2>
        <Link
          to={`/courses`}
          className={`${styles.primary} me-5 group flex items-center mt-4`}
        >
          View More
          <i className="fa-solid fa-angle-right ml-2 transition-transform duration-300 group-hover:translate-x-1"></i>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => onPageChange(1)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      ) : courses.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 text-lg">No courses available</p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap justify-center gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </>
      )}
    </>
  );

  return (
    <>
      <div className="min-h-screen w-full max-w-[1300px] mx-auto px-4 bg-white mt-[75px]">
        <br />
        <br />
        
        {/* Recommended Courses Section */}
        <CourseSection
          title="Recommended for you"
          courses={recommendedCourses}
          loading={recommendedLoading}
          error={recommendedError}
          currentPage={recommendedPage}
          totalPages={recommendedTotalPages}
          onPageChange={setRecommendedPage}
        />

        <br />
        <br />
                {/* Slider Section */}
                <div className="mt-8 relative overflow-hidden">
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                className="flex flex-row items-center justify-between py-16 px-8 md:px-24 lg:px-32 min-w-full"
              >
                <div className="w-2/5 flex-shrink-0">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    {slide.title}
                  </h2>
                  <p className="text-gray-600 mb-6">{slide.description}</p>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md">
                    {slide.buttonText}
                  </button>
                </div>
                <div className="w-2/5 ml-8 rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={slide.img}
                    alt={slide.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-4 mb-4">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 mx-2 rounded-full ${
                  currentSlide === index
                    ? 'bg-indigo-600'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              ></button>
            ))}
          </div>
        </div>

        {/* Popular Courses Section */}
        <CourseSection
          title="Popular courses"
          courses={popularCourses}
          loading={popularLoading}
          error={popularError}
          currentPage={popularPage}
          totalPages={popularTotalPages}
          onPageChange={setPopularPage}
        />

        <br />
        <br />

        {/* Trending Courses Section */}
        <CourseSection
          title="Trending courses"
          courses={trendingCourses}
          loading={trendingLoading}
          error={trendingError}
          currentPage={trendingPage}
          totalPages={trendingTotalPages}
          onPageChange={setTrendingPage}
        />

        <br />
        <br />


      </div>
    </>
  );
}

export default Home;
