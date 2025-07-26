import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import img from '../../assets/sliderpic.jpg'
import homepic1 from '../../assets/homepicstatic1.jpg'
import homepic2 from '../../assets/homepicstatic2.jpg'
import styles from './Home.module.css'
import { getPaginatedCourses } from '../../services/courseService'
import Loader from '../Loader/Loader'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { FaPlay, FaStar, FaUsers, FaClock, FaGraduationCap, FaArrowRight, FaArrowLeft, FaCode, FaPalette, FaBriefcase, FaChartLine, FaFlask, FaCalculator, FaLanguage, FaPaintBrush } from 'react-icons/fa'
import { allGategory } from '../../Redux/features/allGategory/allGategory'
import ContentWrapper from '../ContentWrapper/ContentWrapper'

const CourseCard = ({ course }) => (
    <Link
        to={`/courses/course/${course.id}`}
        className={`w-[280px] sm:w-[300px] md:w-[320px] border border-gray-200 rounded-xl overflow-hidden shadow-lg font-sans group ${styles.card} bg-white`}
        aria-label={`View course: ${course.title}`}
    >
        <div className="relative overflow-hidden">
            <img
                src={course.imagePath || img}
                alt={course.title}
                className="block w-full h-40 sm:h-44 md:h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                    e.target.src = img
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="p-4 lg:p-5 flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-3">
                <span className="text-gray-500 text-xs lg:text-sm truncate max-w-[60%] font-medium">
                    {course.title}
                </span>
                {course.level && (
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-1 px-3 rounded-full text-xs font-semibold shadow-md">
                        {course.level} Level
                    </span>
                )}
            </div>
            <h3 className="mt-0 mb-3 text-sm lg:text-lg font-semibold text-gray-800 line-clamp-2 flex-1 leading-relaxed">
                {course.description}
            </h3>
            <div className="flex items-center justify-end mt-auto">
                <span className="text-lg lg:text-xl font-bold text-indigo-600">
                    ${course.price}
                </span>
            </div>
        </div>
    </Link>
)

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    hasNextPage,
    hasPreviousPage,
}) => {
    if (totalPages <= 1) return null

    const getPageNumbers = () => {
        const pages = []
        const maxVisiblePages = 5
        let startPage = Math.max(
            1,
            currentPage - Math.floor(maxVisiblePages / 2)
        )
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1)
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i)
        }
        return pages
    }

    return (
        <div
            className="flex items-center justify-center gap-3"
            role="navigation"
            aria-label="Pagination"
        >
            <button
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    !hasPreviousPage
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!hasPreviousPage}
                aria-label="Previous page"
            >
                <FaArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
                {getPageNumbers().map((pageNum) => (
                    <button
                        key={pageNum}
                        className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                            currentPage === pageNum
                                ? 'bg-indigo-600 text-white shadow-lg scale-110'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                        }`}
                        onClick={() => onPageChange(pageNum)}
                        aria-label={`Page ${pageNum}`}
                        aria-current={
                            currentPage === pageNum ? 'page' : undefined
                        }
                    >
                        {pageNum}
                    </button>
                ))}
            </div>
            <button
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    !hasNextPage
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!hasNextPage}
                aria-label="Next page"
            >
                <FaArrowRight className="w-4 h-4" />
            </button>
        </div>
    )
}

const useCourseFetch = (initialPage = 1, enOrderBy = 0) => {
    const [courses, setCourses] = useState([])
    const [page, setPage] = useState(initialPage)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [hasNextPage, setHasNextPage] = useState(false)
    const [hasPreviousPage, setHasPreviousPage] = useState(false)

    useEffect(() => {
        let isMounted = true

        const fetchCourses = async () => {
            try {
                setLoading(true)
                setError(null)
                const response = await getPaginatedCourses(page, enOrderBy)
                if (!isMounted) return

                if (response?.succeeded && response?.data?.data) {
                    setCourses(response.data.data)
                    setTotalPages(response.data.totalPage)
                    setHasNextPage(response.data.hasNextPage)
                    setHasPreviousPage(response.data.hasPreviousPage)
                } else {
                    setError('Failed to fetch courses. Please try again later.')
                }
            } catch (error) {
                if (!isMounted) return
                setError(error.message || 'An unexpected error occurred')
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        fetchCourses()

        return () => {
            isMounted = false
        }
    }, [page, enOrderBy])

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage)
        }
    }

    return {
        courses,
        page,
        setPage: handlePageChange,
        totalPages,
        loading,
        error,
        hasNextPage,
        hasPreviousPage,
    }
}

const CategoryCard = ({ category }) => {
    const getCategoryIcon = (categoryName) => {
        const iconMap = {
            'Programming': FaCode,
            'Design': FaPalette,
            'Business': FaBriefcase,
            'Marketing': FaChartLine,
            'Science': FaFlask,
            'Mathematics': FaCalculator,
            'Languages': FaLanguage,
            'Arts': FaPaintBrush,
            'Other': FaGraduationCap
        };
        return iconMap[categoryName] || FaGraduationCap;
    };

    const getCategoryColor = (categoryName) => {
        const colorMap = {
            'Programming': 'from-blue-500 to-indigo-600',
            'Design': 'from-pink-500 to-rose-600',
            'Business': 'from-green-500 to-teal-600',
            'Marketing': 'from-yellow-500 to-orange-600',
            'Science': 'from-gray-500 to-slate-600',
            'Mathematics': 'from-red-500 to-pink-600',
            'Languages': 'from-indigo-500 to-blue-600',
            'Arts': 'from-orange-500 to-red-600',
            'Other': 'from-gray-500 to-slate-600'
        };
        return colorMap[categoryName] || 'from-gray-500 to-slate-600';
    };

    const IconComponent = getCategoryIcon(category.name);
    const gradientClass = getCategoryColor(category.name);

    return (
        <Link
            to={`/courses?category=${encodeURIComponent(category.name)}`}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6 text-center border border-gray-100"
        >
            <div className={`w-16 h-16 bg-gradient-to-r ${gradientClass} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">
                {category.name}
            </h3>
        </Link>
    );
};

function Home() {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const { gategory, loading: categoryLoading } = useSelector((state) => state.allGategory)
    const [currentSlide, setCurrentSlide] = useState(0)
    const sliderRef = useRef(null)
    const autoPlayRef = useRef(null)

    // Fetch sliders from API
    const [sliders, setSliders] = useState([])
    const [sliderLoading, setSliderLoading] = useState(true)


    useEffect(() => {
        const fetchSliders = async () => {
            setSliderLoading(true)
            try {
                const res = await axios.get(
                    'https://e-learn-v1.runasp.net/api/Slider'
                )
                setSliders(res.data || [])
            } catch (err) {
                setSliders([])
            } finally {
                setSliderLoading(false)
            }
        }
        fetchSliders()
    }, [])

    // Fetch categories
    useEffect(() => {
        dispatch(allGategory())
    }, [dispatch])

    // Auto-play slider
    useEffect(() => {
        if (sliders.length > 1) {
            autoPlayRef.current = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % sliders.length)
            }, 5000) // Change slide every 5 seconds

            return () => {
                if (autoPlayRef.current) {
                    clearInterval(autoPlayRef.current)
                }
            }
        }
    }, [sliders.length])

    // Use the custom hook for each course section with different enOrderBy values
    const popularCourses = useCourseFetch(1, 2) // Popular courses
    const trendingCourses = useCourseFetch(1, 1) // Trending courses

    const isLoading = categoryLoading || sliderLoading || popularCourses.loading || trendingCourses.loading;

    const goToSlide = (index) => {
        setCurrentSlide(index)
        // Reset auto-play timer
        if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current)
        }
        autoPlayRef.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % sliders.length)
        }, 5000)
    }

    const nextSlide = () => {
        goToSlide((currentSlide + 1) % sliders.length)
    }

    const prevSlide = () => {
        goToSlide(currentSlide === 0 ? sliders.length - 1 : currentSlide - 1)
    }

    const CourseSection = ({
        title,
        courses,
        loading,
        error,
        currentPage,
        totalPages,
        onPageChange,
        hasNextPage,
        hasPreviousPage,
    }) => (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 px-2 sm:px-0">
                <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                    <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
                        {title}
                    </h2>
                </div>
                <Link
                    to={`/courses`}
                    className={`${styles.primary} group flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all duration-300 font-semibold`}
                    aria-label={`View all ${title.toLowerCase()}`}
                >
                    {t('View-More')}
                    <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64 sm:h-80">
                    <Loader />
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center h-64 sm:h-80">
                    <p className="text-red-500 text-base sm:text-lg mb-4">
                        {error}
                    </p>
                    <button
                        onClick={() => onPageChange(1)}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 font-semibold"
                        aria-label="Retry loading courses"
                    >
                        Retry
                    </button>
                </div>
            ) : courses.length === 0 ? (
                <div className="flex justify-center items-center h-64 sm:h-80">
                    <p className="text-gray-500 text-base sm:text-lg">
                        {t('No-courses-available')}
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 px-2 sm:px-0 justify-items-center">
                        {courses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <div className="mt-8 sm:mt-12 flex justify-center">
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
    )

    return (
        <>
        {isLoading && <Loader visible={isLoading} />}
        <ContentWrapper $loading={isLoading}>
            <div className="min-h-screen w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-indigo-50 mt-[56px] sm:mt-[75px]">
                <div className="py-8 sm:py-12">
                    {/* Hero Section with Enhanced Slider - Now at the top */}
                    <div className="mb-16">
                        {sliderLoading ? (
                            <div className="flex justify-center items-center h-96">
                                <Loader />
                            </div>
                        ) : sliders.length === 0 ? (
                            <div className="flex justify-center items-center h-96">
                                <p className="text-gray-500 text-lg">
                                    {t('No-sliders-available') || 'No sliders available'}
                                </p>
                            </div>
                        ) : (
                            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                                {/* Slider Container */}
                                <div
                                    ref={sliderRef}
                                    className="flex transition-transform duration-700 ease-out"
                                    style={{
                                        transform: `translateX(-${currentSlide * 100}%)`,
                                    }}
                                    role="region"
                                    aria-label="Featured sliders"
                                >
                                    {sliders.map((slide, index) => (
                                        <div
                                            key={slide.id}
                                            className="flex flex-col lg:flex-row items-center justify-between py-12 lg:py-20 px-8 lg:px-16 min-w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 relative overflow-hidden"
                                        >
                                            {/* Background Pattern */}
                                            <div className="absolute inset-0 opacity-10">
                                                <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-36 -translate-y-36"></div>
                                                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
                                            </div>
                                            
                                            <div className="w-full lg:w-1/2 flex-shrink-0 mb-8 lg:mb-0 relative z-10">
                                                <h2 className="text-3xl lg:text-5xl xl:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
                                                    {slide.content}
                                                </h2>
                                                <p className="text-lg lg:text-xl text-indigo-100 mb-8 leading-relaxed">
                                                    Discover amazing opportunities and enhance your skills with our comprehensive courses.
                                                </p>
                                                <button
                                                    className="group bg-white text-indigo-600 font-bold py-4 px-8 rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                                                    aria-label="Go to slider link"
                                                    onClick={() =>
                                                        window.open(slide.link, '_blank')
                                                    }
                                                >
                                                    <span className="flex items-center">
                                                        {t('Visit-Link') || 'Get Started'}
                                                        <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                                                    </span>
                                                </button>
                                            </div>
                                            <div className="w-full lg:w-2/5 lg:ml-8 rounded-2xl overflow-hidden shadow-2xl flex justify-center border-4 border-white/20 bg-white/10 backdrop-blur-sm">
                                                <img
                                                    src={slide.path || img}
                                                    alt={slide.content}
                                                    className="w-full h-64 lg:h-80 object-cover rounded-xl"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Navigation Arrows */}
                                {sliders.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevSlide}
                                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 z-20"
                                            aria-label="Previous slide"
                                        >
                                            <FaArrowLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={nextSlide}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 z-20"
                                            aria-label="Next slide"
                                        >
                                            <FaArrowRight className="w-5 h-5" />
                                        </button>
                                    </>
                                )}

                                {/* Dots Navigation */}
                                {sliders.length > 1 && (
                                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
                                        {sliders.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => goToSlide(index)}
                                                className={`w-4 h-4 rounded-full border-2 border-white/50 transition-all duration-300 ${
                                                    currentSlide === index
                                                        ? 'bg-white border-white scale-125 shadow-lg'
                                                        : 'bg-white/30 hover:bg-white/50 hover:scale-110'
                                                }`}
                                                role="tab"
                                                aria-selected={currentSlide === index}
                                                aria-label={`Slide ${index + 1}`}
                                            ></button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Categories Section */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                                {t('explore-categories') || 'Explore Categories'}
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                {t('categories-description') || 'Discover courses in your favorite subjects and start your learning journey today'}
                            </p>
                        </div>
                        
                        {categoryLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader />
                            </div>
                        ) : gategory && gategory.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
                                {gategory.slice(0, 8).map((category) => (
                                    <CategoryCard key={category.id} category={category} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex justify-center items-center h-64">
                                <p className="text-gray-500 text-lg">
                                    {t('No-categories-available') || 'No categories available'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Popular Courses Section */}
                    <div className="py-12">
                        <CourseSection
                            title={t('first-courses')}
                            courses={popularCourses.courses}
                            loading={popularCourses.loading}
                            error={popularCourses.error}
                            currentPage={popularCourses.page}
                            totalPages={popularCourses.totalPages}
                            onPageChange={popularCourses.setPage}
                            hasNextPage={popularCourses.hasNextPage}
                            hasPreviousPage={popularCourses.hasPreviousPage}
                        />
                    </div>

                    {/* Trending Courses Section */}
                    <div className="py-12">
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
        </ContentWrapper>
            
        </>
    )
}

export default Home
