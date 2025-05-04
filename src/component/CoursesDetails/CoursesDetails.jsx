import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaUsers, FaClock, FaGraduationCap, FaBook, FaRegHeart, FaShareAlt } from 'react-icons/fa';
import Loader from '../Loader/Loader';
import styles from '../Courses/Courses.module.css';

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

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://e-learn-v1.runasp.net/Course/Get/${id}`);
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
        const res = await axios.get('http://e-learn-v1.runasp.net/Course/GetAll');
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
  const price = 49;
  const lessonsCount = course.lessonInfo?.length || 0;
  const gallery = [course.imagePath, ...mockGallery];

  return (
    <div className="min-h-screen bg-[#f5f8ff] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4">
          <Link to="/">Home</Link> / <Link to="/courses">Design</Link> / <span className="text-black font-medium">{course.categoryName || 'Course'}</span>
        </nav>

        {/* Title, rating, teacher, actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{course.description}</h1>
            <div className="flex items-center gap-2 text-gray-600 text-base">
              <FaStar className="text-yellow-400" />
              <span className="font-semibold">{rating}</span>
              <span>({reviewCount} reviews)</span>
              <span className="mx-2">|</span>
              <span className="text-blue-600 font-medium cursor-pointer">{teacherName}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm font-medium"><FaShareAlt /> Share</button>
            <button className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm font-medium"><FaRegHeart /> Save</button>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2">
            <img src={gallery[0]} alt="Course" className="w-full h-72 object-cover rounded-lg" />
          </div>
          <div className="flex flex-col gap-4">
            {gallery.slice(1, 3).map((img, idx) => (
              <img key={idx} src={img} alt="Gallery" className="w-full h-32 object-cover rounded-lg" />
            ))}
          </div>
        </div>

        {/* Main content and sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6 flex gap-8">
              <button onClick={() => setActiveTab('description')} className={`pb-2 border-b-2 text-base font-medium ${activeTab === 'description' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}>Class description</button>
              <button onClick={() => setActiveTab('benefits')} className={`pb-2 border-b-2 text-base font-medium ${activeTab === 'benefits' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}>Benefits</button>
              <button onClick={() => setActiveTab('reviews')} className={`pb-2 border-b-2 text-base font-medium ${activeTab === 'reviews' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}>Reviews ({reviewCount})</button>
              <button onClick={() => setActiveTab('related')} className={`pb-2 border-b-2 text-base font-medium ${activeTab === 'related' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}>Related courses</button>
            </div>

            {/* Tab content */}
            {activeTab === 'description' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Class description</h2>
                <p className="text-gray-700 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem lorem aliquam sed lacinia quis. Nibh dictumst vulputate odio pellentesque sit quis ac, sit ipsum. Sit rhoncus velit in sed massa arcu et su. Vitae et vitae eget lorem non dui. Sollicitudin ut mi adipiscing duis.</p>
                <p className="text-gray-700">Convallis in semper laoreet nibh leo. Vivamus malesuada ipsum pulvinar non rutrum risus dui, risus. Purus massa velit iaculis tincidunt tortor, risus, scelerisque risus. In at lorem pellentesque orci aenean dictum dignissim in sit. Aenean pulvinar diam interdum ullamcorper. Vel urna, tortor, massa metus purus metus. Maecenas mollis in velit auctor cursus scelerisque eget. Nibh faucibus purus elementum ultrices elementum, urna.</p>
              </div>
            )}
            {activeTab === 'benefits' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Benefits</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {mockBenefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-gray-700">
                      <span className="text-blue-600 text-lg">{benefit.icon}</span>
                      <span>{benefit.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Reviews</h2>
                <div className="space-y-4">
                  {mockReviews.map((review, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FaStar className="text-yellow-400" />
                        <span className="font-semibold">{review.rating}</span>
                        <span className="text-gray-600">{review.name}</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'related' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Related courses</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {relatedCourses.length > 0 ? relatedCourses.map((course) => (
                    <Link key={course.id} to={`/courses/course/${course.id}`}>
                      <div className={`w-72 border border-gray-300 rounded-lg overflow-hidden shadow-md font-sans group h-[330px] flex flex-col ${styles.card}`}>
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
                    <div className="col-span-full text-gray-500">No related courses found.</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 bg-white rounded-lg shadow-md p-6 flex flex-col gap-6 hover:bg-[#f5f8ff] cursor-pointer transition-colors duration-200">
            <div className="flex items-center gap-4">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Teacher" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <div className="font-semibold">{teacherName}</div>
                <div className="text-xs text-purple-600">Top teacher</div>
              </div>
              <button className="ml-auto px-3 py-1 bg-gray-100 rounded text-blue-600 text-sm font-medium">Follow</button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">UX: Design with a User...</span>
                <span className="flex items-center gap-1 text-yellow-500 font-semibold"><FaStar /> {rating}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600 text-sm">
                <span>Course ({lessonsCount} lessons)</span>
                <span>${price}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600 text-sm">
                <span>Document</span>
                <span className="text-blue-600 font-semibold">Free</span>
              </div>
              <div className="flex items-center justify-between font-bold text-lg mt-2">
                <span>Total</span>
                <span>${price}</span>
              </div>
              <button className="w-full mt-4 bg-[#6C63FF] hover:bg-[#5952ff] text-white font-semibold rounded-xl py-4 text-lg transition">Buy now</button>
              <button className="w-full mt-3 border-2 border-[#6C63FF] text-[#6C63FF] font-semibold rounded-xl py-4 text-lg bg-white transition hover:bg-[#f5f8ff]">Add to cart</button>
            </div>
          </div>
        </div>
      </div>
      {/* New sections below main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Benefits Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Benefits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {mockBenefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-3 text-gray-700 text-lg">
                <span className="text-blue-600 text-2xl">{benefit.icon}</span>
                <span>{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Reviews Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Reviews</h2>
            <div className="flex items-center gap-2 text-base text-gray-600">
              <FaStar className="text-yellow-400" />
              <span className="font-semibold">{rating}</span>
              <span>({reviewCount} reviews)</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            {/* Example reviews, you can map real data here */}
            <div className="flex gap-4">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Jay Rutherford" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <div className="font-semibold">Jay Rutherford</div>
                <div className="text-xs text-gray-400 mb-1">Rated 5 12:00 PM</div>
                <div className="text-gray-700">Veniam mollit et veniam ea officia nisi minim fugiat minim consequat dolor pariatur</div>
              </div>
            </div>
            <div className="flex gap-4">
              <img src="https://randomuser.me/api/portraits/men/33.jpg" alt="Jevon Raynor" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <div className="font-semibold">Jevon Raynor</div>
                <div className="text-xs text-gray-400 mb-1">Rated 5 12:00 PM</div>
                <div className="text-gray-700">Deserunt minim incididunt cillum nostrud do voluptate excepteur excepteur minim ex minim est</div>
              </div>
            </div>
            <div className="flex gap-4">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Annie Haley" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <div className="font-semibold">Annie Haley</div>
                <div className="text-xs text-gray-400 mb-1">Rated 4.5 12:00 PM</div>
                <div className="text-gray-700">Nostrud excepteur magna id est quis in aliqua consequat. Exercitation enim eiusmod elit sint laborum</div>
              </div>
            </div>
            <div className="flex gap-4">
              <img src="https://randomuser.me/api/portraits/women/45.jpg" alt="Emily Rowey" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <div className="font-semibold">Emily Rowey</div>
                <div className="text-xs text-gray-400 mb-1">Rated 5 12:00 PM</div>
                <div className="text-gray-700">Deserunt minim incididunt cillum nostrud do voluptate excepteur</div>
              </div>
            </div>
          </div>
          <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition">Show all reviews</button>
        </div>
        {/* Related Courses Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Related courses</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {relatedCourses.length > 0 ? relatedCourses.map((course) => (
              <Link key={course.id} to={`/courses/course/${course.id}`}>
                <div className={`w-72 border border-gray-300 rounded-lg overflow-hidden shadow-md font-sans group h-[330px] flex flex-col ${styles.card}`}>
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
              <div className="col-span-full text-gray-500">No related courses found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
