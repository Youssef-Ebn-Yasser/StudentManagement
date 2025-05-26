import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaUsers, FaClock, FaGraduationCap, FaBook, FaRegHeart, FaShareAlt } from 'react-icons/fa';
import Loader from '../Loader/Loader';
import styles from '../Courses/Courses.module.css';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('your_publishable_key_here');

const mockBenefits = [
  { icon: <FaClock />, text: '14 hours on-demand video' },
  { icon: <FaUsers />, text: 'Native teacher' },
  { icon: <FaBook />, text: '100% free document' },
  { icon: <FaGraduationCap />, text: 'Full lifetime access' },
  { icon: <FaBook />, text: 'Certificate of complete' },
  { icon: <FaUsers />, text: '24/7 support' },
];

const mockReviews = [
  { name: 'John Doe', rating: 5, comment: 'Great course!' },
  { name: 'Jane Smith', rating: 4, comment: 'Very informative.' },
];

const mockGallery = [
  // Main image will be course.imagePath
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
];

export default function CoursesDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Add handlePayment function
  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Hardcoded student ID for testing
      const studentId = 3;
      
      console.log('Starting payment process with:', {
        studentId,
        courseId: id,
        coursePrice: course?.price
      });

      // Create payment intent with proper data structure
      const paymentData = {
        studentId: studentId,
        courseId: parseInt(id),
        amount: Math.round(course.price * 100), // Convert to cents and round to avoid floating point issues
        currency: 'USD',
        paymentDate: new Date().toISOString()
      };

      console.log('Sending payment request with data:', paymentData);

      // Create payment intent and get Stripe URL
      const response = await axios.post('https://e-learn-v1.runasp.net/api/Payments/create-payment-intent', paymentData);

      console.log('Payment response:', response.data);

      if (response.data && response.data.url) {
        // Add event listener for the back button
        window.addEventListener('popstate', () => {
          navigate(`/courses/course/${id}`);
        });

        // Redirect to Stripe checkout page
        window.location.href = response.data.url;
      } else {
        throw new Error('Invalid payment response: No URL received');
      }
    } catch (error) {
      console.error('Payment error details:', {
        error: error,
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });

      let errorMessage = 'An error occurred during payment processing.';

      if (error.response) {
        const serverError = error.response.data;
        console.log('Server error response:', serverError);
        
        if (typeof serverError === 'object') {
          if (serverError.massage) {
            errorMessage = serverError.massage;
          } else if (serverError.message) {
            errorMessage = serverError.message;
          } else if (serverError.errors) {
            errorMessage = Object.values(serverError.errors).flat().join(', ');
          } else {
            errorMessage = JSON.stringify(serverError);
          }
        } else {
          errorMessage = serverError;
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your internet connection and try again.';
      } else {
        errorMessage = error.message || 'An unexpected error occurred';
      }

      alert(`Error: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/Comment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          content: newComment,
          courseId: course.id,
          studentId: localStorage.getItem('userId'),
          lessonId: course.lessonInfo[0]?.id // Using first lesson as default
        })
      });

      if (response.ok) {
        // Refresh course details to get updated comments
        fetchCourseDetails();
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://e-learn-v1.runasp.net/Course/Get/${id}`);
        if (response.data.succeeded) {
          setCourse(response.data.data);
        } else {
          throw new Error(response.data.massage || 'Failed to load course details');
        }
      } catch (err) {
        setError(err.message || 'Failed to load course details');
        console.error('Error fetching course details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, [id]);

  // Fetch all courses and filter related ones
  useEffect(() => {
    const fetchRelatedCourses = async () => {
      if (!course) return;
      try {
        const res = await axios.get('https://e-learn-v1.runasp.net/Course/GetAll');
        const allCourses = res.data.data || [];
        const filtered = allCourses.filter(c =>
          c.id !== course.id &&
          (c.categoryName === course.categoryName || c.description.toLowerCase().includes(course.description.toLowerCase()))
        );
        setRelatedCourses(filtered.slice(0, 4)); // Show up to 4 related courses
      } catch (err) {
        setRelatedCourses([]);
      }
    };
    fetchRelatedCourses();
  }, [course]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-xl mb-4">Course not found</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Mocked data for demonstration
  const teacherName = course.teacherName || 'Klara Weaver';
  const rating = 4.5;
  const reviewCount = 99;
  const price = course.price || 49;
  const lessonsCount = course.lessonInfo?.length || 0;
  const gallery = [course.imagePath, ...mockGallery];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Course Image */}
            <div className="w-full md:w-1/2">
              <img
                src={course.imagePath}
                alt={course.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            {/* Course Info */}
            <div className="w-full md:w-1/2">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
              <p className="text-gray-600 mb-6">{course.description}</p>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  {rating}
                  <i className="fas fa-star text-yellow-400 pe-3"></i>
                  <span className="ml-1 text-gray-600">{lessonsCount} lessons</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-1 text-gray-600">{course.hours} hours</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                  <span className="ml-1 text-gray-600">
                    Teacher:{' '}
                    <button
                      onClick={() => navigate(`/courses/teacher/${course.teacherName}`)}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {course.teacherName || 'Not specified'}
                    </button>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">${price}</div>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Buy Now'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Course Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`${
                  activeTab === 'description'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('curriculum')}
                className={`${
                  activeTab === 'curriculum'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Curriculum
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-600">{course.description}</p>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div className="space-y-4">
                {course.lessonInfo.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">{lesson.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Courses */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedCourses.map((relatedCourse) => (
              <Link 
                key={relatedCourse.id}
                to={`/courses/course/${relatedCourse.id}`}
              >
                <div
                  className={`w-72 border border-gray-300 rounded-lg overflow-hidden shadow-md font-sans group ${styles.card} h-[330px] flex flex-col`}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={relatedCourse.imagePath}
                      alt={relatedCourse.title}
                      className="block w-full h-[180px] object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className='p-4 flex-1 flex flex-col'>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-500 text-sm">{relatedCourse.title}</span>
                      {relatedCourse.level && (
                        <span className="bg-red-400 text-white py-1 px-2 rounded-xl text-xs">
                          {relatedCourse.level} level
                        </span>
                      )}
                    </div>
                    <h3 className="mt-0 mb-2 text-lg font-semibold text-black line-clamp-2 flex-1">
                      {relatedCourse.description}
                    </h3>
                    <div className="flex justify-between items-center mt-auto">
                      <div className="flex items-center">
                        <i className="fas fa-star text-yellow-500 text-sm"></i>
                        <span className="ml-1 text-sm text-black">4.5</span>
                        <span className="text-gray-500 text-sm ps-1">(1253)</span>
                      </div>
                      <span className="text-xl font-bold text-black">${relatedCourse.price}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
