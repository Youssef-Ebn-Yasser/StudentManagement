import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { FaStar, FaUsers, FaClock, FaGraduationCap, FaBook, FaClipboardList, FaTrash, FaEdit, FaChartLine, FaCalendarAlt, FaTag, FaFileAlt } from 'react-icons/fa';
import Loader from '../Loader/Loader';
import { toast } from 'react-toastify';
import axios from 'axios';

const TeacherCourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isDeleting, setIsDeleting] = useState(false);
  const [lessonMaterials, setLessonMaterials] = useState({});
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [materialFile, setMaterialFile] = useState(null);

  // Debug log for id param
  console.log('Course ID from params:', id);

  useEffect(() => {
    console.log('useEffect running, id:', id);
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await courseService.getCourseDetails(id);
        console.log('Response from getCourseDetails:', response);
        if (response.succeeded) {
          setCourse(response.data);
          const courseLessons = response.data.lessons || response.data.lessonInfo || [];
          
          // Fetch materials for each lesson
          const materialsPromises = courseLessons.map(lesson => 
            axios.get(`https://e-learn-v1.runasp.net/api/Material/GetMaterialsByLessonId/GetMaterialsByLessonId/${lesson.id}`)
          );
          
          const materialsResponses = await Promise.all(materialsPromises);
          const materialsMap = {};
          
          materialsResponses.forEach((response, index) => {
            if (response.data.succeeded) {
              materialsMap[courseLessons[index].id] = response.data.data || [];
            }
          });
          
          setLessonMaterials(materialsMap);
        } else {
          throw new Error(response.messages?.[0] || 'Failed to load course details');
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
        setError(error.message || 'Failed to load course details');
        toast.error(error.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const handleDeleteCourse = async () => {
    if (window.confirm(`
      Are you sure you want to delete this course?
      
      Course Details:
      Title: ${course.title}
      Category: ${course.category}
      Level: ${course.level}
      
      ⚠️ Warning: This action will permanently delete:
      - The course itself
      - All lessons in this course
      - All materials and assignments associated with these lessons
      - All uploaded files and resources
      
      This action cannot be undone.
    `)) {
      try {
        setIsDeleting(true);
        console.log('Starting course deletion for ID:', id);
        const response = await courseService.deleteCourse(id);
        console.log('Delete response:', response);
        
        if (response?.succeeded) {
          toast.success('Course and all associated content deleted successfully');
          navigate('/teacher/courses'); // Navigate back to courses list
        } else {
          throw new Error(response?.message || 'Failed to delete course');
        }
      } catch (err) {
        console.error('Error deleting course:', {
          error: err,
          response: err.response,
          message: err.message
        });
        
        let errorMessage = 'Failed to delete course';
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        toast.error(errorMessage);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      try {
        const response = await courseService.deleteLesson(lessonId);
        if (response.succeeded) {
          setCourse(prevCourse => ({
            ...prevCourse,
            lessonInfo: prevCourse.lessonInfo.filter(lesson => lesson.id !== lessonId)
          }));
          toast.success('Lesson deleted successfully');
        } else {
          throw new Error(response.messages?.[0] || 'Failed to delete lesson');
        }
      } catch (error) {
        console.error('Error deleting lesson:', error);
        toast.error(error.message || 'Failed to delete lesson');
      }
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        const response = await axios.delete(`https://e-learn-v1.runasp.net/api/Material/DeleteMaterial/DeleteMaterial/${materialId}`);
        
        if (response.data.succeeded) {
          // Update the materials state by removing the deleted material
          setLessonMaterials(prevMaterials => {
            const updatedMaterials = { ...prevMaterials };
            Object.keys(updatedMaterials).forEach(lessonId => {
              updatedMaterials[lessonId] = updatedMaterials[lessonId].filter(
                material => material.id !== materialId
              );
            });
            return updatedMaterials;
          });
          
          toast.success('Material deleted successfully');
        } else {
          throw new Error(response.data.messages?.[0] || 'Failed to delete material');
        }
      } catch (error) {
        console.error('Error deleting material:', error);
        toast.error(error.response?.data?.message || error.message || 'Failed to delete material');
      }
    }
  };

  const handleUpdateMaterial = async (materialId, updatedData) => {
    try {
      setIsUpdating(true);
      
      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append('Id', materialId);
      formData.append('Title', updatedData.title);
      formData.append('Content', updatedData.content);
      formData.append('LessonId', updatedData.lessonId);
      formData.append('Type', updatedData.type || 1);
      
      // Only append file if a new one is selected
      if (materialFile) {
        formData.append('Data', materialFile);
      }

      const response = await axios.put(
        'https://e-learn-v1.runasp.net/api/Material/UpdateMaterial/UpdateMaterial',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      if (response.data.succeeded) {
        // Update the materials state with the updated material
        setLessonMaterials(prevMaterials => {
          const updatedMaterials = { ...prevMaterials };
          Object.keys(updatedMaterials).forEach(lessonId => {
            updatedMaterials[lessonId] = updatedMaterials[lessonId].map(material => 
              material.id === materialId ? { ...material, ...updatedData } : material
            );
          });
          return updatedMaterials;
        });

        toast.success('Material updated successfully');
        setEditingMaterial(null);
        setMaterialFile(null);
      } else {
        throw new Error(response.data.messages?.[0] || 'Failed to update material');
      }
    } catch (error) {
      console.error('Error updating material:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to update material');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditClick = (material) => {
    setEditingMaterial(material);
    setMaterialFile(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingMaterial) return;

    const updatedData = {
      id: editingMaterial.id,
      title: editingMaterial.title,
      content: editingMaterial.content,
      lessonId: editingMaterial.lessonId,
      type: editingMaterial.type || 1
    };

    await handleUpdateMaterial(editingMaterial.id, updatedData);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMaterialFile(file);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="scale-[2.5]">
        <Loader />
        </div>
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/teacher/courses')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Courses
          </button>
        </div>

        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              <img
                src={course.imagePath}
                alt={course.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="w-full md:w-2/3">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                  <div className="bg-gray-50 p-3 rounded-lg mb-4 inline-block">
                    <p className="text-sm text-gray-500">Course ID</p>
                    <p className="font-semibold">{course.id || 'Not available'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/teacher/course/edit/${course.id}`)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    <FaEdit className="inline-block mr-2" />
                    Edit Course
                  </button>
                  <button
                    onClick={handleDeleteCourse}
                    disabled={isDeleting}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <FaTrash className="inline-block mr-2" />
                        Delete Course
                      </>
                    )}
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{course.description}</p>
              
              {/* Course Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <FaStar className="text-yellow-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Rating</p>
                      <p className="font-semibold">{course.rating || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <FaUsers className="text-blue-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Students</p>
                      <p className="font-semibold">{course.students?.length || 0}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <FaClock className="text-green-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-semibold">{course.hours || 0} hours</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <FaBook className="text-purple-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Lessons</p>
                      <p className="font-semibold">{course.lessonInfo?.length || 0}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <FaTag className="text-indigo-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-semibold">{course.categoryName || 'Uncategorized'}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <FaGraduationCap className="text-orange-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Level</p>
                      <p className="font-semibold">{course.level || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-red-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Created</p>
                      <p className="font-semibold">{new Date(course.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <FaChartLine className="text-green-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-semibold">${course.price || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('lessons')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'lessons'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Lessons
              </button>
            </nav>
          </div>

          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Course Overview</h2>
              <p className="text-gray-600 mb-4">{course.description}</p>
            </div>
          )}

          {activeTab === 'lessons' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Course Lessons</h2>
                  <p className="text-gray-600 mt-1">Total {course.lessonInfo?.length || 0} lessons</p>
                </div>
                <button
                  onClick={() => navigate(`/teacher/course/${course.id}/lesson/new`)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
                >
                  <FaBook className="text-lg" />
                  Add New Lesson
                </button>
              </div>

              {course.lessonInfo?.length > 0 ? (
                <div className="space-y-6">
                  {course.lessonInfo.map((lesson, index) => (
                    <div 
                      key={lesson.id} 
                      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                              {index + 1}
                            </span>
                            <h3 className="text-xl font-semibold text-gray-900">{lesson.title}</h3>
                          </div>
                          <p className="text-gray-600 mb-4 ml-11">{lesson.description}</p>
                          {lesson.duration && (
                            <div className="ml-11 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium inline-block mb-2">
                              {lesson.duration} minutes
                            </div>
                          )}
                          {lesson.difficulty && (
                            <div className="ml-11 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium inline-block mb-2">
                              {lesson.difficulty}
                            </div>
                          )}
                          
                          {/* Materials Section */}
                          <div className="ml-11 mt-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                <FaFileAlt className="text-blue-500" />
                                Materials
                              </h4>
                              <button
                                onClick={() => navigate(`/teacher/course/${course.id}/lesson/${lesson.id}/material/new`)}
                                className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-2"
                              >
                                <FaFileAlt className="text-sm" />
                                Add Material
                              </button>
                            </div>
                            
                            {lessonMaterials[lesson.id]?.length > 0 ? (
                              <div className="space-y-3">
                                {lessonMaterials[lesson.id].map((material) => (
                                  <div 
                                    key={material.id}
                                    className="bg-gray-50 p-3 rounded-lg flex items-center justify-between"
                                  >
                                    {editingMaterial?.id === material.id ? (
                                      <form onSubmit={handleEditSubmit} className="flex-1">
                                        <div className="space-y-3">
                                          <input
                                            type="text"
                                            value={editingMaterial.title}
                                            onChange={(e) => setEditingMaterial(prev => ({ ...prev, title: e.target.value }))}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Material Title"
                                            required
                                          />
                                          <textarea
                                            value={editingMaterial.content}
                                            onChange={(e) => setEditingMaterial(prev => ({ ...prev, content: e.target.value }))}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Material Content"
                                            rows="3"
                                            required
                                          />
                                          <div className="flex items-center gap-2">
                                            <label className="text-sm text-gray-600">Material Type:</label>
                                            <select
                                              value={editingMaterial.type || 1}
                                              onChange={(e) => setEditingMaterial(prev => ({ ...prev, type: parseInt(e.target.value) }))}
                                              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                              <option value={1}>Regular Material</option>
                                              <option value={2}>Assignment</option>
                                            </select>
                                          </div>
                                          <div>
                                            <label className="block text-sm text-gray-600 mb-1">Update File (Optional)</label>
                                            <input
                                              type="file"
                                              onChange={handleFileChange}
                                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                          </div>
                                          <div className="flex justify-end gap-2">
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setEditingMaterial(null);
                                                setMaterialFile(null);
                                              }}
                                              className="px-3 py-1 text-gray-600 hover:text-gray-800"
                                              disabled={isUpdating}
                                            >
                                              Cancel
                                            </button>
                                            <button
                                              type="submit"
                                              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                                              disabled={isUpdating}
                                            >
                                              {isUpdating ? 'Updating...' : 'Save Changes'}
                                            </button>
                                          </div>
                                        </div>
                                      </form>
                                    ) : (
                                      <>
                                        <div className="flex items-center gap-3">
                                          <FaFileAlt className="text-gray-500" />
                                          <div>
                                            <h5 className="font-medium text-gray-800">{material.title}</h5>
                                            <p className="text-sm text-gray-600">{material.content}</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <button
                                            onClick={() => handleEditClick(material)}
                                            className="text-gray-500 hover:text-gray-600"
                                          >
                                            <FaEdit />
                                          </button>
                                          <button
                                            onClick={() => handleDeleteMaterial(material.id)}
                                            className="text-red-500 hover:text-red-600"
                                          >
                                            <FaTrash />
                                          </button>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 text-sm">No materials uploaded yet</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No lessons available</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherCourseDetails;
