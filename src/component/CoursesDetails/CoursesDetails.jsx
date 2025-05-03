// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { courseService } from '../../services/courseService';
// import { FaStar, FaUsers, FaClock, FaGraduationCap, FaBook, FaClipboardList, FaTrash } from 'react-icons/fa';

// const CoursesDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('overview');

//   // Fixed course details
//   const fixedCourses = {
//     1: {
//       id: 1,
//       title: "Complete Web Development Course",
//       category: "Programming",
//       description: "Learn web development from scratch to advanced. This comprehensive course covers HTML, CSS, JavaScript, React, Node.js, and more. Perfect for beginners and intermediate developers looking to expand their skills.",
//       imagePath: "https://img-c.udemycdn.com/course/750x422/1430746_2f43_10.jpg",
//       price: 49.99,
//       rating: 4.8,
//       duration: 42,
//       level: "All Levels",
//       students: Array(125).fill(null),
//       lessons: [
//         {
//           id: 1,
//           title: "Introduction to Web Development",
//           description: "Overview of web development basics and course structure",
//           duration: 45,
//           type: "video"
//         },
//         {
//           id: 2,
//           title: "HTML Fundamentals",
//           description: "Learn the building blocks of web pages",
//           duration: 60,
//           type: "video"
//         },
//         {
//           id: 3,
//           title: "CSS Styling",
//           description: "Master website styling and responsive design",
//           duration: 90,
//           type: "video"
//         }
//       ],
//       materials: [
//         {
//           id: 1,
//           title: "Course Slides",
//           description: "Comprehensive slides for all lectures",
//           type: "pdf"
//         },
//         {
//           id: 2,
//           title: "Source Code",
//           description: "Complete project source code",
//           type: "zip"
//         }
//       ],
//       assignments: [
//         {
//           id: 1,
//           title: "Portfolio Project",
//           description: "Build your personal portfolio website",
//           dueDate: "2024-04-01",
//           points: 100
//         }
//       ]
//     },
//     2: {
//       id: 2,
//       title: "UI/UX Design Masterclass",
//       category: "Design",
//       description: "Master the art of user interface and user experience design. Learn design principles, wireframing, prototyping, and user research. Create beautiful and functional designs using industry-standard tools.",
//       imagePath: "https://img-c.udemycdn.com/course/750x422/1650610_2673_5.jpg",
//       price: 39.99,
//       rating: 4.9,
//       duration: 35,
//       level: "Intermediate",
//       students: Array(98).fill(null),
//       lessons: [
//         {
//           id: 1,
//           title: "Design Principles",
//           description: "Understanding core design principles and theory",
//           duration: 60,
//           type: "video"
//         },
//         {
//           id: 2,
//           title: "Wireframing Basics",
//           description: "Create effective wireframes for your designs",
//           duration: 75,
//           type: "video"
//         },
//         {
//           id: 3,
//           title: "Prototyping in Figma",
//           description: "Build interactive prototypes",
//           duration: 90,
//           type: "video"
//         }
//       ],
//       materials: [
//         {
//           id: 1,
//           title: "Design Assets",
//           description: "UI kit and design resources",
//           type: "zip"
//         },
//         {
//           id: 2,
//           title: "Case Studies",
//           description: "Real-world design case studies",
//           type: "pdf"
//         }
//       ],
//       assignments: [
//         {
//           id: 1,
//           title: "Mobile App Design",
//           description: "Design a complete mobile application",
//           dueDate: "2024-04-15",
//           points: 100
//         }
//       ]
//     },
//     3: {
//       id: 3,
//       title: "Digital Marketing Essentials",
//       category: "Marketing",
//       description: "Learn digital marketing strategies and techniques. Master social media marketing, SEO, content marketing, and paid advertising. Start growing your online presence today.",
//       imagePath: "https://img-c.udemycdn.com/course/750x422/903744_8eb2.jpg",
//       price: 44.99,
//       rating: 4.7,
//       duration: 38,
//       level: "Beginner",
//       students: Array(156).fill(null),
//       lessons: [
//         {
//           id: 1,
//           title: "Digital Marketing Overview",
//           description: "Introduction to digital marketing channels",
//           duration: 45,
//           type: "video"
//         },
//         {
//           id: 2,
//           title: "Social Media Strategy",
//           description: "Create effective social media campaigns",
//           duration: 60,
//           type: "video"
//         },
//         {
//           id: 3,
//           title: "SEO Fundamentals",
//           description: "Learn search engine optimization basics",
//           duration: 75,
//           type: "video"
//         }
//       ],
//       materials: [
//         {
//           id: 1,
//           title: "Marketing Templates",
//           description: "Ready-to-use marketing templates",
//           type: "pdf"
//         },
//         {
//           id: 2,
//           title: "Analytics Guide",
//           description: "Guide to marketing analytics",
//           type: "pdf"
//         }
//       ],
//       assignments: [
//         {
//           id: 1,
//           title: "Marketing Campaign",
//           description: "Plan and execute a digital marketing campaign",
//           dueDate: "2024-04-30",
//           points: 100
//         }
//       ]
//     }
//   };

//   useEffect(() => {
//     const fetchCourseDetails = async () => {
//       try {
//         setLoading(true);
//         // Check if it's one of our fixed courses
//         if (fixedCourses[id]) {
//           setCourse(fixedCourses[id]);
//         } else {
//           // Fallback to API call for other courses
//           const response = await courseService.getCourseDetails(id);
//           setCourse(response?.data || response);
//         }
//       } catch (err) {
//         setError(err.message || 'Failed to load course details');
//         console.error('Error fetching course details:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourseDetails();
//   }, [id]);

//   const handleDelete = async () => {
//     if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
//       try {
//         setLoading(true);
//         setError(null); // Clear any previous errors
//         const response = await courseService.deleteCourse(id);
        
//         if (response && response.succeeded) {
//           navigate('/courses', { 
//             state: { message: 'Course deleted successfully' }
//           });
//         } else {
//           throw new Error(response?.messages?.[0] || 'Failed to delete course');
//         }
//       } catch (err) {
//         console.error('Error deleting course:', err);
//         if (err.message === 'Network Error') {
//           setError('Unable to connect to the server. Please check your internet connection and try again.');
//         } else {
//           setError(err.response?.data?.messages?.[0] || err.message || 'Failed to delete course');
//         }
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C63FF]"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center">
//         <div className="text-red-600 mb-4">{error}</div>
//         <button
//           onClick={() => navigate(-1)}
//           className="text-[#6C63FF] hover:text-[#5952ff] font-semibold"
//         >
//           ← Go Back
//         </button>
//       </div>
//     );
//   }

//   if (!course) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center">
//         <div className="text-gray-600 mb-4">Course not found</div>
//         <button
//           onClick={() => navigate(-1)}
//           className="text-[#6C63FF] hover:text-[#5952ff] font-semibold"
//         >
//           ← Go Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen w-screen bg-white">
//       {/* Back Button and Delete Button */}
//       <div className="border-b px-8 flex justify-between items-center">
//         <button
//           onClick={() => navigate(-1)}
//           className="text-[#6C63FF] hover:text-[#5952ff] font-semibold flex items-center text-xl py-4"
//         >
//           <span className="mr-2">←</span> Back to Courses
//         </button>
//         <button
//           onClick={handleDelete}
//           className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition duration-300"
//         >
//           <FaTrash /> Delete Course
//         </button>
//       </div>

//       {/* Course Info */}
//       <div className="border-b py-6 px-8">
//         <div className="flex flex-wrap items-center gap-12">
//           <div className="flex items-center">
//             <FaStar className="text-[#ffc107] text-2xl mr-3" />
//             <span className="text-xl">{course.rating}</span>
//           </div>
//           <div className="flex items-center">
//             <FaUsers className="text-gray-400 text-2xl mr-3" />
//             <span className="text-xl">{course.students?.length || 0} students</span>
//           </div>
//           <div className="flex items-center">
//             <FaClock className="text-gray-400 text-2xl mr-3" />
//             <span className="text-xl">{course.duration} hours</span>
//           </div>
//           <div className="flex items-center">
//             <FaGraduationCap className="text-gray-400 text-2xl mr-3" />
//             <span className="text-xl capitalize">{course.level || 'All Levels'}</span>
//           </div>
//         </div>
//       </div>

//       {/* Navigation */}
//       <div className="border-b sticky top-0 z-10 bg-white px-8">
//         <nav className="flex">
//           <button
//             className={`px-8 py-6 text-lg font-medium border-b-2 ${
//               activeTab === 'overview'
//                 ? 'border-[#6C63FF] text-[#6C63FF]'
//                 : 'border-transparent text-gray-500 hover:text-[#6C63FF] hover:border-gray-300'
//             }`}
//             onClick={() => setActiveTab('overview')}
//           >
//             Overview
//           </button>
//           <button
//             className={`px-8 py-6 text-lg font-medium border-b-2 ${
//               activeTab === 'lessons'
//                 ? 'border-[#6C63FF] text-[#6C63FF]'
//                 : 'border-transparent text-gray-500 hover:text-[#6C63FF] hover:border-gray-300'
//             }`}
//             onClick={() => setActiveTab('lessons')}
//           >
//             Lessons
//           </button>
//           <button
//             className={`px-8 py-6 text-lg font-medium border-b-2 ${
//               activeTab === 'materials'
//                 ? 'border-[#6C63FF] text-[#6C63FF]'
//                 : 'border-transparent text-gray-500 hover:text-[#6C63FF] hover:border-gray-300'
//             }`}
//             onClick={() => setActiveTab('materials')}
//           >
//             Materials
//           </button>
//           <button
//             className={`px-8 py-6 text-lg font-medium border-b-2 ${
//               activeTab === 'assignments'
//                 ? 'border-[#6C63FF] text-[#6C63FF]'
//                 : 'border-transparent text-gray-500 hover:text-[#6C63FF] hover:border-gray-300'
//             }`}
//             onClick={() => setActiveTab('assignments')}
//           >
//             Assignments
//           </button>
//         </nav>
//       </div>

//       {/* Content Area */}
//       <div className="bg-gray-50 min-h-[calc(100vh-200px)] px-8 py-8">
//         {activeTab === 'overview' && (
//           <div>
//             <h2 className="text-3xl font-bold mb-6">Course Overview</h2>
//             <p className="text-gray-600 text-xl mb-10 leading-relaxed">{course.description}</p>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
//                 <div className="flex items-center gap-4 mb-4">
//                   <FaBook className="text-[#6C63FF] text-3xl" />
//                   <span className="font-semibold text-2xl">Total Lessons</span>
//                 </div>
//                 <p className="text-5xl font-bold text-gray-900">{course.lessons?.length || 0}</p>
//               </div>
//               <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
//                 <div className="flex items-center gap-4 mb-4">
//                   <FaClipboardList className="text-[#6C63FF] text-3xl" />
//                   <span className="font-semibold text-2xl">Materials</span>
//                 </div>
//                 <p className="text-5xl font-bold text-gray-900">{course.materials?.length || 0}</p>
//               </div>
//               <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
//                 <div className="flex items-center gap-4 mb-4">
//                   <FaUsers className="text-[#6C63FF] text-3xl" />
//                   <span className="font-semibold text-2xl">Enrolled Students</span>
//                 </div>
//                 <p className="text-5xl font-bold text-gray-900">{course.students?.length || 0}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === 'lessons' && (
//           <div>
//             <h2 className="text-3xl font-bold mb-6">Course Lessons</h2>
//             {course.lessons?.length > 0 ? (
//               <div className="space-y-6">
//                 {course.lessons.map((lesson, index) => (
//                   <div key={lesson.id} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h3 className="text-2xl font-semibold mb-4">
//                           {index + 1}. {lesson.title}
//                         </h3>
//                         <p className="text-gray-600 text-lg leading-relaxed">{lesson.description}</p>
//                       </div>
//                       <span className="text-lg text-gray-500 bg-gray-50 px-6 py-2 rounded-full">
//                         {lesson.duration} min
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-600 text-xl">No lessons available yet.</p>
//             )}
//           </div>
//         )}

//         {activeTab === 'materials' && (
//           <div>
//             <h2 className="text-3xl font-bold mb-6">Course Materials</h2>
//             {course.materials?.length > 0 ? (
//               <div className="space-y-6">
//                 {course.materials.map((material) => (
//                   <div key={material.id} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h3 className="text-2xl font-semibold mb-4">{material.title}</h3>
//                         <p className="text-gray-600 text-lg leading-relaxed">{material.description}</p>
//                       </div>
//                       <span className="text-lg text-[#6C63FF] bg-[#6C63FF]/10 px-6 py-2 rounded-full uppercase">
//                         {material.type}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-600 text-xl">No materials available yet.</p>
//             )}
//           </div>
//         )}

//         {activeTab === 'assignments' && (
//           <div>
//             <h2 className="text-3xl font-bold mb-6">Course Assignments</h2>
//             {course.assignments?.length > 0 ? (
//               <div className="space-y-6">
//                 {course.assignments.map((assignment) => (
//                   <div key={assignment.id} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h3 className="text-2xl font-semibold mb-4">{assignment.title}</h3>
//                         <p className="text-gray-600 text-lg leading-relaxed mb-6">{assignment.description}</p>
//                         <div className="flex gap-6">
//                           <span className="text-lg text-gray-500 bg-gray-50 px-6 py-2 rounded-full">
//                             Due: {new Date(assignment.dueDate).toLocaleDateString()}
//                           </span>
//                           <span className="text-lg text-gray-500 bg-gray-50 px-6 py-2 rounded-full">
//                             Points: {assignment.points}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-600 text-xl">No assignments available yet.</p>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CoursesDetails;
import React from 'react'

export default function CoursesDetails() {
  return (
    <div>CoursesDetails</div>
  )
}
