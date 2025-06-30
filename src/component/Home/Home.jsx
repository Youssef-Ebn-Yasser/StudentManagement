import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import img from '../../assets/sliderpic.jpg';
import styles from './Home.module.css';
import { getPaginatedCourses } from '../../services/courseService';
import Loader from '../Loader/Loader';
<<<<<<< HEAD
import axios from 'axios';
=======
import { useTranslation } from 'react-i18next';
>>>>>>> df1764070c3c24a21dd448c63ea74bba25258beb

const CourseCard = ({ course }) => (
  <Link
    to={`/courses/course/${course.id}`}
    className={`w-[280px] sm:w-[300px] md:w-[320px] border border-gray-300 rounded-lg overflow-hidden shadow-md font-sans group ${styles.card}`}
    aria-label={`View course: ${course.title}`}
  >
    <div className="relative overflow-hidden">
      <img
        src={course.imagePath || img}
        alt={course.title}
        className="block w-full h-32 sm:h-36 md:h-40 object-cover transition-transform duration-300 group-hover:scale-110"
        onError={(e) => {
          e.target.src = img;
        }}
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
        <span className="text-base lg:text-xl font-bold text-black">${course.price}</span>
      </div>
    </div>
  </Link>
);

const Pagination = ({ currentPage, totalPages, onPageChange, hasNextPage, hasPreviousPage }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };
  

  return (
    <div className="flex items-center justify-center gap-2" role="navigation" aria-label="Pagination">
      <button
        className={`px-4 py-2 rounded-md ${
          !hasPreviousPage
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        } transition-colors duration-200`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
        aria-label="Previous page"
      >
        Previous
      </button>
      <div className="flex items-center gap-2">
        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            className={`w-10 h-10 rounded-md ${
              currentPage === pageNum
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors duration-200`}
            onClick={() => onPageChange(pageNum)}
            aria-label={`Page ${pageNum}`}
            aria-current={currentPage === pageNum ? 'page' : undefined}
          >
            {pageNum}
          </button>
        ))}
      </div>
      <button
        className={`px-4 py-2 rounded-md ${
          !hasNextPage
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        } transition-colors duration-200`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
};

const useCourseFetch = (initialPage = 1, enOrderBy = 0) => {
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  

  useEffect(() => {
    let isMounted = true;

    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getPaginatedCourses(page, enOrderBy);
        if (!isMounted) return;

        if (response?.succeeded && response?.data?.data) {
          setCourses(response.data.data);
          setTotalPages(response.data.totalPage);
          setHasNextPage(response.data.hasNextPage);
          setHasPreviousPage(response.data.hasPreviousPage);
        } else {
          setError('Failed to fetch courses. Please try again later.');
        }
      } catch (error) {
        if (!isMounted) return;
        setError(error.message || 'An unexpected error occurred');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCourses();

    return () => {
      isMounted = false;
    };
  }, [page, enOrderBy]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return {
    courses,
    page,
    setPage: handlePageChange,
    totalPages,
    loading,
    error,
    hasNextPage,
    hasPreviousPage
  };
};

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
<<<<<<< HEAD

  // Fetch sliders from API
  const [sliders, setSliders] = useState([]);
  const [sliderLoading, setSliderLoading] = useState(true);

  useEffect(() => {
    const fetchSliders = async () => {
      setSliderLoading(true);
      try {
        const res = await axios.get('https://e-learn-v1.runasp.net/api/Slider');
        setSliders(res.data || []);
      } catch (err) {
        setSliders([]);
      } finally {
        setSliderLoading(false);
      }
    };
    fetchSliders();
  }, []);

=======
  const { t } = useTranslation();
  
>>>>>>> df1764070c3c24a21dd448c63ea74bba25258beb
  // Use the custom hook for each course section with different enOrderBy values
  const recommendedCourses = useCourseFetch(1, 0); // Recommended courses
  const popularCourses = useCourseFetch(1, 2);    // Popular courses
  const trendingCourses = useCourseFetch(1, 1);   // Trending courses

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const CourseSection = ({ title, courses, loading, error, currentPage, totalPages, onPageChange, hasNextPage, hasPreviousPage }) => (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 px-2 sm:px-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2 sm:mb-0">{title}</h2>
        <Link
          to={`/courses`}
          className={`${styles.primary} group flex items-center`}
          aria-label={`View all ${title.toLowerCase()}`}
        >
          {t('View-More')}
          <i className="fa-solid fa-angle-right ml-2 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true"></i>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48 sm:h-64">
          <Loader />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-48 sm:h-64">
          <p className="text-red-500 text-base sm:text-lg mb-4">{error}</p>
          <button
            onClick={() => onPageChange(1)}
            className="bg-indigo-600 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-indigo-700"
            aria-label="Retry loading courses"
          >
            Retry
          </button>
        </div>
      ) : courses.length === 0 ? (
        <div className="flex justify-center items-center h-48 sm:h-64">
          <p className="text-gray-500 text-base sm:text-lg">{t('No-courses-available')}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-12 xl:gap-16 px-2 sm:px-0 justify-items-center">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-6 sm:mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                hasNextPage={hasNextPage}
                hasPreviousPage={hasPreviousPage}
              />
            </div>
          )}
        </>
      )}
    </>
  );

  return (
    <>
      <div className="min-h-screen w-full max-w-[1300px] mx-auto px-2 sm:px-4 bg-white mt-[56px] sm:mt-[75px]">
        <div className="py-4 sm:py-8">
          {/* Recommended Courses Section */}
          <CourseSection
            title={t("recommend-for-you")}
            courses={recommendedCourses.courses}
            loading={recommendedCourses.loading}
            error={recommendedCourses.error}
            currentPage={recommendedCourses.page}
            totalPages={recommendedCourses.totalPages}
            onPageChange={recommendedCourses.setPage}
            hasNextPage={recommendedCourses.hasNextPage}
            hasPreviousPage={recommendedCourses.hasPreviousPage}
          />

          <div className="py-6 sm:py-8">
            {/* Slider Section */}
            <div className="mt-4 sm:mt-8 relative overflow-hidden">
              {sliderLoading ? (
                <div className="flex justify-center items-center h-48 sm:h-64">
                  <Loader />
                </div>
              ) : sliders.length === 0 ? (
                <div className="flex justify-center items-center h-48 sm:h-64">
                  <p className="text-gray-500 text-base sm:text-lg">No sliders available</p>
                </div>
              ) : (
                <>
                  <div
                    className="flex transition-transform duration-500"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    role="region"
                    aria-label="Featured sliders"
                  >
                    {sliders.map((slide, index) => (
                      <div
                        key={slide.id}
                        className="flex flex-col sm:flex-row items-center justify-between py-8 sm:py-16 px-4 sm:px-8 md:px-16 lg:px-24 min-w-full"
                      >
                        <div className="w-full sm:w-2/5 flex-shrink-0 mb-6 sm:mb-0">
                          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
                            {slide.content}
                          </h2>
                          <button
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-md text-sm sm:text-base transition"
                            aria-label="Go to slider link"
                            onClick={() => window.open(slide.link, '_blank')}
                          >
                            Visit Link
                          </button>
                        </div>
                        <div className="w-full sm:w-2/5 sm:ml-8 rounded-lg overflow-hidden shadow-lg flex justify-center">
                          <img
                            src={slide.path || img}
                            alt={slide.content}
                            className="w-full h-56 sm:h-64 object-cover rounded-lg border"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center mt-4 mb-4" role="tablist">
                    {sliders.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2 h-2 sm:w-3 sm:h-3 mx-1 sm:mx-2 rounded-full ${
                          currentSlide === index
                            ? 'bg-indigo-600'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        role="tab"
                        aria-selected={currentSlide === index}
                        aria-label={`Slide ${index + 1}`}
                      ></button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Popular Courses Section */}
          <CourseSection
            title={t("first-courses")}
            courses={popularCourses.courses}
            loading={popularCourses.loading}
            error={popularCourses.error}
            currentPage={popularCourses.page}
            totalPages={popularCourses.totalPages}
            onPageChange={popularCourses.setPage}
            hasNextPage={popularCourses.hasNextPage}
            hasPreviousPage={popularCourses.hasPreviousPage}
          />

          <div className="py-6 sm:py-8">
            {/* Trending Courses Section */}
            <CourseSection
              title={t('Affordable-to-PremiumCourses')}
              courses={trendingCourses.courses}
              loading={trendingCourses.loading}
              error={trendingCourses.error}
              currentPage={trendingCourses.page}
              totalPages={trendingCourses.totalPages}
              onPageChange={trendingCourses.setPage}
              hasNextPage={trendingCourses.hasNextPage}
              hasPreviousPage={trendingCourses.hasPreviousPage}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;