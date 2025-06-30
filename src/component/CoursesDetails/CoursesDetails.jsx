import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaUsers, FaClock, FaGraduationCap, FaBook } from 'react-icons/fa';
import Loader from '../Loader/Loader';
import styles from '../Courses/Courses.module.css';
import { loadStripe } from '@stripe/stripe-js';
import { useTranslation } from 'react-i18next';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51RQUrPPvFWprxsdQEzZeC02EVBdbrFpeEeg12WteirJS2O6E4vShxYn6mejMdRsQItdS4p2uQCNwKznka3TKHtoM00OAEt28tT');

const mockBenefits = [
  { icon: <FaClock />, text: '14 hours on-demand video' },
  { icon: <FaUsers />, text: 'Native teacher' },
  { icon: <FaBook />, text: '100% free document' },
  { icon: <FaGraduationCap />, text: 'Full lifetime access' },
  { icon: <FaBook />, text: 'Certificate of complete' },
  { icon: <FaUsers />, text: '24/7 support' },
];

const mockGallery = [
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
];

export default function CoursesDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Helper to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  const handlePaymobPayment = () => {
     navigate('paymob-checkout');
  };

  // Payment handler: open Stripe in the same tab
  const handlePayment = async () => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
      navigate('/auth/login');
      return;
    }
    setIsProcessing(true);
    try {
      const paymentData = {
        amount: Math.round(course.price),
        paymentDate: new Date().toISOString(),
        currency: 'USD',
        studentId: Number(studentId),
        courseId: parseInt(id)
      };
      const response = await axios.post('https://e-learn-v1.runasp.net/api/Payments/create-payment-intent', paymentData);
      if (response.data && response.data.url) {
        // Save info to enroll after redirect
        localStorage.setItem('pendingEnrollCourseId', id);
        // Open Stripe checkout in the same tab
        window.location.href = response.data.url;
      } else {
        throw new Error('Invalid payment response: No URL received');
      }
    } catch (error) {
      let errorMessage = 'An error occurred during payment processing.';
      if (error.response) {
        const serverError = error.response.data;
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

  // Enroll student after successful payment (when redirected back)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('payment') === 'success';
    const pendingCourseId = localStorage.getItem('pendingEnrollCourseId');
    const studentId = localStorage.getItem('studentId');

    if (paymentSuccess && pendingCourseId && studentId) {
      axios.post('https://e-learn-v1.runasp.net/api/Student/EnrollToCourse/EnrollToCourse', {
        studentId: Number(studentId),
        courseId: Number(pendingCourseId)
      })
      .then(res => {
        if (res.data && res.data.succeeded) {
          alert('Enroll Success');
        } else {
          alert('Enroll failed: ' + (res.data?.massage || 'Unknown error'));
        }
      })
      .catch(() => {
        alert('Enroll failed: Network or server error');
      })
      .finally(() => {
        localStorage.removeItem('pendingEnrollCourseId');
      });
    }
  }, []);

  // Fetch course details
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
    // eslint-disable-next-line
  }, [id]);

  // Fetch all courses and filter related ones by same category
  useEffect(() => {
    const fetchRelatedCourses = async () => {
      if (!course) return;
      try {
        const res = await axios.get('https://e-learn-v1.runasp.net/Course/GetAll');
        const allCourses = res.data.data || [];
        // Only show courses with the same category, and not the current course
        const filtered = allCourses.filter(c =>
          c.id !== course.id &&
          c.categoryName === course.categoryName
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

  const teacherName = course.teacherName || 'Klara Weaver';
  const rating = 4.5;
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
                  <FaStar className="text-yellow-400 ml-1" />
                  <span className="ml-2 text-gray-600">{lessonsCount} lessons</span>
                </div>
                <div className="flex items-center">
                  <FaClock className="text-gray-400" />
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

               <div className="flex flex-col gap-4 items-start">
                <div className="text-3xl font-bold text-gray-900">${price}</div>
                <div className="flex gap-3">
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : 'Buy Now'}
                  </button>
                  <button
                    onClick={handlePaymobPayment}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Buy with Paymob
                  </button>
                </div>
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
                Lessons
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


        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('student_comments')}</h2>
          {course.commentInfo && course.commentInfo.length > 0 ? (
            <div className="space-y-6">
              {course.commentInfo.slice(0, 3).map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-start gap-4 bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                      {comment.studentName ? comment.studentName[0].toUpperCase() : 'S'}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-indigo-700">{comment.studentName || t('student')}</span>
                      <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-gray-700 text-base">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">{t('no_comments_yet')}</p>
          )}
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
                        <FaStar className="text-yellow-500 text-sm" />
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