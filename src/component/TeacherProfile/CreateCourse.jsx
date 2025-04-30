import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import "./CreateCourse.css"
import axios from 'axios';

const CreateCourse = () => {
  // ====================== Navigation and State Hooks ======================
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('courses');
  const fileInputRef = useRef(null);
  
  // ====================== Constants and Enums ======================
  const courseCategories = {
    PROGRAMMING: 'Programming',
    DESIGN: 'Design',
    BUSINESS: 'Business',
    MARKETING: 'Marketing',
    SCIENCE: 'Science',
    MATHEMATICS: 'Mathematics',
    LANGUAGES: 'Languages',
    ARTS: 'Arts',
    OTHER: 'Other'
  };

  const contentTypes = {
    VIDEO: 'video',
    DOCUMENT: 'document',
    QUIZ: 'quiz',
    ASSIGNMENT: 'assignment',
    URL: 'url'
  };

  const materialTypes = {
    FILE: 'file',
    VIDEO: 'video',
    URL: 'url'
  };

  const lessonTypes = {
    LECTURE: 'lecture',
    PRACTICE: 'practice',
    QUIZ: 'quiz',
    ASSIGNMENT: 'assignment'
  };

  // ====================== State Management ======================
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [viewingMaterials, setViewingMaterials] = useState(null);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [editingMaterialId, setEditingMaterialId] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [editingAssignmentId, setEditingAssignmentId] = useState(null);

  // ====================== Loading States ======================
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ====================== Data Initialization ======================
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await courseService.getAllCourses();
        const coursesData = response?.data || [];
        setCourses(Array.isArray(coursesData) ? coursesData : []);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError(error.message || 'Failed to load courses');
        setCourses([]); // Ensure courses is an empty array on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Add this after the initial useEffect
  useEffect(() => {
    if (editingCourseId && activeTab === 'lessons') {
      const loadLessons = async () => {
        try {
          setIsLoading(true);
          const response = await courseService.getCourseDetails(editingCourseId);
          setLessons(response.data?.lessons || []);
        } catch (error) {
          handleApiError(error);
        } finally {
          setIsLoading(false);
        }
      };
      loadLessons();
    }
  }, [editingCourseId, activeTab]);

  // ====================== Helper Functions ======================
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCourseMaterials = async (courseId) => {
    try {
      const courseDetails = await courseService.getCourseDetails(courseId);
      return courseDetails.materials || [];
    } catch (error) {
      handleApiError(error);
      return [];
    }
  };

  const getCourseAssignments = async (courseId) => {
    try {
      const courseDetails = await courseService.getCourseDetails(courseId);
      return courseDetails.assignments || [];
    } catch (error) {
      handleApiError(error);
      return [];
    }
  };

  const getCourseLessons = async (courseId) => {
    try {
      const courseDetails = await courseService.getCourseDetails(courseId);
      return courseDetails.lessons || [];
    } catch (error) {
      handleApiError(error);
      return [];
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      [courseCategories.PROGRAMMING]: '#6366F1',
      [courseCategories.DESIGN]: '#EC4899',
      [courseCategories.BUSINESS]: '#14B8A6',
      [courseCategories.MARKETING]: '#F59E0B',
      [courseCategories.SCIENCE]: '#10B981',
      [courseCategories.MATHEMATICS]: '#3B82F6',
      [courseCategories.LANGUAGES]: '#8B5CF6',
      [courseCategories.ARTS]: '#EF4444',
      [courseCategories.OTHER]: '#6B7280'
    };
    return colors[category] || colors[courseCategories.OTHER];
  };

  const getCoursesByCategory = () => {
    const grouped = {};
    if (!Array.isArray(courses)) {
      // If courses is not an array, initialize all categories with empty arrays
    Object.values(courseCategories).forEach(category => {
        grouped[category] = [];
      });
      return grouped;
    }
    
    Object.values(courseCategories).forEach(category => {
      grouped[category] = courses.filter(course => course && course.category === category) || [];
    });
    return grouped;
  };

  // ====================== Error Handling ======================
  const handleApiError = (error) => {
    console.error('API Error:', error);
    setError(error.response?.data?.message || error.message || 'An error occurred');
  };

  // ====================== API Configuration ======================
  const API_BASE_URL = '/api';
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add authentication token
      // 'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  };

  // ====================== API Response Handlers ======================
  const handleApiResponse = async (response) => {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }
    return response.json();
  };

  // ====================== Course Search API ======================
  const searchCourses = async (query) => {
    try {
      setIsLoading(true);
      const courses = await courseService.getAllCourses();
      return courses.filter(course => 
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.description.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      handleApiError(error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // ====================== Course Enrollment API ======================
  const handleEnrollStudent = async (courseId, studentId) => {
    try {
      setIsLoading(true);
      const course = await courseService.getCourseDetails(courseId);
      if (course) {
        setCourses(courses.map(course => {
          if (course.id === courseId) {
            return {
              ...course,
              students: [...course.students, studentId]
            };
          }
          return course;
        }));
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // ====================== Course Progress API ======================
  const updateCourseProgress = async (courseId, progress) => {
    try {
      setIsLoading(true);
      const course = await courseService.getCourseDetails(courseId);
      if (course) {
        await courseService.updateCourse(courseId, { ...course, progress });
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // ====================== Material Download API ======================
  const downloadMaterial = async (materialId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/Course/Material/${materialId}/download`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `material-${materialId}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // ====================== Assignment Submission API ======================
  const submitAssignment = async (assignmentId, submission) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('submission', submission.file);
      formData.append('data', JSON.stringify(submission));
      
      const response = await axios.post(`/api/Course/Assignment/${assignmentId}/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // ====================== Course Analytics API ======================
  // const getCourseAnalytics = async (courseId) => {
  //   // ...delete this function if not in Swagger
  // };

  // ====================== Form Validation ======================
  const validateCourseForm = (formData) => {
    const errors = {};
    if (!formData.get('title')) errors.title = 'Title is required';
    if (!formData.get('description')) errors.description = 'Description is required';
    if (!formData.get('category')) errors.category = 'Category is required';
    if (!formData.get('price')) errors.price = 'Price is required';
    if (isNaN(parseFloat(formData.get('price')))) errors.price = 'Price must be a number';
    if (!formData.get('duration')) errors.duration = 'Duration is required';
    if (isNaN(parseInt(formData.get('duration')))) errors.duration = 'Duration must be a number';
    if (!formData.get('level')) errors.level = 'Level is required';
    return errors;
  };

  const validateLessonForm = (formData) => {
    const errors = {};
    if (!formData.get('title')) errors.title = 'Title is required';
    if (!formData.get('description')) errors.description = 'Description is required';
    if (!formData.get('type')) errors.type = 'Type is required';
    if (!formData.get('content')) errors.content = 'Content is required';
    if (!formData.get('duration')) errors.duration = 'Duration is required';
    if (isNaN(parseInt(formData.get('duration')))) errors.duration = 'Duration must be a number';
    if (!formData.get('order')) errors.order = 'Order is required';
    if (isNaN(parseInt(formData.get('order')))) errors.order = 'Order must be a number';
    return errors;
  };

  const validateMaterialForm = (formData) => {
    const errors = {};
    if (!formData.get('title')) errors.title = 'Title is required';
    if (!formData.get('description')) errors.description = 'Description is required';
    if (!formData.get('type')) errors.type = 'Type is required';
    if (!formData.get('file') && formData.get('type') !== 'url') errors.file = 'File is required';
    return errors;
  };

  const validateAssignmentForm = (formData) => {
    const errors = {};
    if (!formData.get('title')) errors.title = 'Title is required';
    if (!formData.get('description')) errors.description = 'Description is required';
    if (!formData.get('dueDate')) errors.dueDate = 'Due date is required';
    if (!formData.get('points')) errors.points = 'Points is required';
    if (isNaN(parseInt(formData.get('points')))) errors.points = 'Points must be a number';
    if (!formData.get('instructions')) errors.instructions = 'Instructions is required';
    return errors;
  };

  // ====================== Course Form Component ======================
  const CourseForm = ({ course, onSubmit, onCancel, submitText }) => {
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
      const validationErrors = validateCourseForm(formData);
      
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      onSubmit(e);
    };

    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="required-field">Title</label>
          <input
            type="text"
            name="title"
            required
            defaultValue={course?.title}
            placeholder="Enter course title"
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label>Course Image</label>
          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            className="image-input"
          />
          {course?.thumbnail && (
            <div className="image-preview">
              <img src={course.thumbnail} alt="Course preview" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="required-field">Category</label>
          <select 
            name="category" 
            required 
            className={`category-select ${errors.category ? 'error' : ''}`}
            defaultValue={course?.category}
          >
            <option value="">Select a category</option>
            {Object.entries(courseCategories).map(([key, value]) => (
              <option key={key} value={value}>{value}</option>
            ))}
          </select>
          {errors.category && <span className="error-message">{errors.category}</span>}
        </div>

        <div className="form-group">
          <label className="required-field">Description</label>
          <textarea
            name="description"
            required
            defaultValue={course?.description}
            placeholder="Enter course description"
            rows="4"
            className={errors.description ? 'error' : ''}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label className="required-field">Price</label>
          <input
            type="number"
            name="price"
            required
            min="0"
            step="0.01"
            defaultValue={course?.price}
            placeholder="Enter course price"
            className={errors.price ? 'error' : ''}
          />
          {errors.price && <span className="error-message">{errors.price}</span>}
        </div>

        <div className="form-group">
          <label className="required-field">Duration (hours)</label>
          <input
            type="number"
            name="duration"
            required
            min="1"
            defaultValue={course?.duration}
            placeholder="Enter course duration"
            className={errors.duration ? 'error' : ''}
          />
          {errors.duration && <span className="error-message">{errors.duration}</span>}
        </div>

        <div className="form-group">
          <label className="required-field">Level</label>
          <select 
            name="level" 
            required 
            className={`category-select ${errors.level ? 'error' : ''}`}
            defaultValue={course?.level}
          >
            <option value="">Select level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          {errors.level && <span className="error-message">{errors.level}</span>}
        </div>

        <div className="form-actions">
          {onCancel && (
            <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
          )}
          <button type="submit" className="save-button">{submitText}</button>
        </div>
      </form>
    );
  };

  // ====================== Lesson Form Component ======================
  const LessonForm = ({ lesson, onSubmit, onCancel, submitText }) => {
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const validationErrors = validateLessonForm(formData);
      
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      onSubmit(e);
    };

    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="required-field">Title</label>
          <input
            type="text"
            name="title"
            required
            defaultValue={lesson?.title}
            placeholder="Enter lesson title"
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label className="required-field">Type</label>
          <select 
            name="type" 
            required 
            className={`category-select ${errors.type ? 'error' : ''}`}
            defaultValue={lesson?.type}
          >
            <option value="">Select type</option>
            {Object.entries(lessonTypes).map(([key, value]) => (
              <option key={key} value={value}>{value}</option>
            ))}
          </select>
          {errors.type && <span className="error-message">{errors.type}</span>}
        </div>

        <div className="form-group">
          <label className="required-field">Content</label>
          <textarea
            name="content"
            required
            defaultValue={lesson?.content}
            placeholder="Enter lesson content"
            rows="4"
            className={errors.content ? 'error' : ''}
          />
          {errors.content && <span className="error-message">{errors.content}</span>}
        </div>

        <div className="form-group">
          <label className="required-field">Duration (minutes)</label>
          <input
            type="number"
            name="duration"
            required
            min="1"
            defaultValue={lesson?.duration}
            placeholder="Enter lesson duration"
            className={errors.duration ? 'error' : ''}
          />
          {errors.duration && <span className="error-message">{errors.duration}</span>}
        </div>

        <div className="form-group">
          <label className="required-field">Order</label>
          <input
            type="number"
            name="order"
            required
            min="1"
            defaultValue={lesson?.order}
            placeholder="Enter lesson order"
            className={errors.order ? 'error' : ''}
          />
          {errors.order && <span className="error-message">{errors.order}</span>}
        </div>

        <div className="form-group">
          <label className="required-field">Description</label>
          <textarea
            name="description"
            required
            defaultValue={lesson?.description}
            placeholder="Enter lesson description"
            rows="3"
            className={errors.description ? 'error' : ''}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="form-actions">
          {onCancel && (
            <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
          )}
          <button type="submit" className="save-button">{submitText}</button>
        </div>
      </form>
    );
  };

  // ====================== Material Form Component ======================
  const MaterialForm = ({ material, onSubmit, onCancel, submitText }) => {
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const validationErrors = validateMaterialForm(formData);
      
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      onSubmit(e);
    };

    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="required-field">Title</label>
          <input
            type="text"
            name="title"
            required
            defaultValue={material?.title}
            placeholder="Enter material title"
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label className="required-field">Type</label>
          <select 
            name="type" 
            required 
            className={`category-select ${errors.type ? 'error' : ''}`}
            defaultValue={material?.type}
          >
            <option value="">Select type</option>
            {Object.entries(materialTypes).map(([key, value]) => (
              <option key={key} value={value}>{value}</option>
            ))}
          </select>
          {errors.type && <span className="error-message">{errors.type}</span>}
        </div>

        <div className="form-group file-input">
          <label className="required-field">File</label>
          <input
            type="file"
            name="file"
            ref={fileInputRef}
            accept=".pdf,.doc,.docx,.txt,video/*"
            className={errors.file ? 'error' : ''}
          />
          {errors.file && <span className="error-message">{errors.file}</span>}
          <p className="help-text">Supported formats: PDF, DOC, DOCX, TXT, and video files</p>
        </div>

        <div className="form-group">
          <label className="required-field">Description</label>
          <textarea
            name="description"
            required
            defaultValue={material?.description}
            placeholder="Enter material description"
            rows="3"
            className={errors.description ? 'error' : ''}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="form-actions">
          {onCancel && (
            <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
          )}
          <button type="submit" className="save-button">{submitText}</button>
        </div>
      </form>
    );
  };

  // ====================== Assignment Form Component ======================
  const AssignmentForm = ({ assignment, onSubmit, onCancel, submitText }) => {
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const validationErrors = validateAssignmentForm(formData);
      
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      onSubmit(e);
    };

    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="required-field">Title</label>
          <input
            type="text"
            name="title"
            required
            defaultValue={assignment?.title}
            placeholder="Enter assignment title"
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label className="required-field">Description</label>
          <textarea
            name="description"
            required
            defaultValue={assignment?.description}
            placeholder="Enter assignment description"
            rows="4"
            className={errors.description ? 'error' : ''}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label className="required-field">Due Date</label>
          <input
            type="datetime-local"
            name="dueDate"
            required
            defaultValue={assignment?.dueDate}
            className={errors.dueDate ? 'error' : ''}
          />
          {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
        </div>

        <div className="form-group">
          <label className="required-field">Points</label>
          <input
            type="number"
            name="points"
            required
            min="1"
            defaultValue={assignment?.points}
            placeholder="Enter maximum points"
            className={errors.points ? 'error' : ''}
          />
          {errors.points && <span className="error-message">{errors.points}</span>}
        </div>

        <div className="form-group">
          <label className="required-field">Instructions</label>
          <textarea
            name="instructions"
            required
            defaultValue={assignment?.instructions}
            placeholder="Enter assignment instructions"
            rows="4"
            className={errors.instructions ? 'error' : ''}
          />
          {errors.instructions && <span className="error-message">{errors.instructions}</span>}
        </div>

        <div className="form-actions">
          {onCancel && (
            <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
          )}
          <button type="submit" className="save-button">{submitText}</button>
        </div>
      </form>
    );
  };

  // ====================== Course Management Functions ======================
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(e.target);
      // Only append the file if it exists
      if (formData.get('thumbnail') && formData.get('thumbnail').size > 0) {
        // Use FormData for file upload
        await courseService.createCourse(formData, true);
      } else {
        // Send as JSON if no file
        const courseData = {
          title: formData.get('title'),
          description: formData.get('description'),
          category: formData.get('category'),
          price: parseFloat(formData.get('price')),
          duration: parseInt(formData.get('duration')),
          level: formData.get('level'),
        };
        await courseService.createCourse(courseData, false);
      }
      // Refresh courses list
      const coursesData = await courseService.getAllCourses();
      setCourses(coursesData);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setEditingCourseId(course.id);
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(e.target);
      const courseData = {
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category'),
        price: parseFloat(formData.get('price')),
        duration: parseInt(formData.get('duration')),
        level: formData.get('level'),
        thumbnail: formData.get('thumbnail'),
      };

      const updatedCourse = await courseService.updateCourse(editingCourseId, courseData);
      setCourses(courses.map(course =>
        course.id === editingCourseId ? updatedCourse : course
      ));
      setEditingCourse(null);
      setEditingCourseId(null);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course? This will also delete all associated materials and assignments.')) {
      try {
        setIsLoading(true);
        await courseService.deleteCourse(courseId);
        setCourses(courses.filter(course => course.id !== courseId));
      } catch (error) {
        handleApiError(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // ====================== Lesson Management Functions ======================
  const handleCreateLesson = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(e.target);
      const lessonData = {
        title: formData.get('title'),
        description: formData.get('description'),
        type: formData.get('type'),
        content: formData.get('content'),
        duration: parseInt(formData.get('duration')),
        order: parseInt(formData.get('order')),
        courseId: editingCourseId
      };

      const response = await courseService.addLesson(lessonData);
      if (response.succeeded) {
        // Refresh lessons list
        const updatedCourse = await courseService.getCourseDetails(editingCourseId);
        setLessons(updatedCourse.data?.lessons || []);
      e.target.reset();
      } else {
        throw new Error(response.messages?.[0] || 'Failed to create lesson');
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditLesson = (lesson) => {
    setEditingLesson(lesson);
    setEditingLessonId(lesson.id);
  };

  const handleUpdateLesson = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(e.target);
      const lessonData = {
        title: formData.get('title'),
        description: formData.get('description'),
        type: formData.get('type'),
        content: formData.get('content'),
        duration: parseInt(formData.get('duration')),
        order: parseInt(formData.get('order')),
      };

      const updatedLesson = await courseService.updateLesson(editingCourseId, editingLessonId, lessonData);
      setLessons(lessons.map(lesson =>
        lesson.id === editingLessonId ? updatedLesson : lesson
      ));
      setEditingLesson(null);
      setEditingLessonId(null);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId, courseId) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      try {
        setIsLoading(true);
        await courseService.deleteLesson(courseId, lessonId);
        setLessons(lessons.filter(lesson => lesson.id !== lessonId));
      } catch (error) {
        handleApiError(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // ====================== Material Management Functions ======================
  const handleUploadMaterial = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(e.target);
      const materialData = {
        title: formData.get('title'),
        description: formData.get('description'),
        type: formData.get('type'),
        file: formData.get('file'),
      };

      const newMaterial = await courseService.uploadMaterial(editingCourseId, materialData);
      setMaterials([...materials, newMaterial]);
      e.target.reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMaterial = (material) => {
    setEditingMaterial(material);
    setEditingMaterialId(material.id);
  };

  const handleUpdateMaterial = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(e.target);
      const materialData = {
        title: formData.get('title'),
        description: formData.get('description'),
        type: formData.get('type'),
        file: formData.get('file'),
      };

      const updatedMaterial = await courseService.updateMaterial(editingCourseId, editingMaterialId, materialData);
      setMaterials(materials.map(material =>
        material.id === editingMaterialId ? updatedMaterial : material
      ));
      setEditingMaterial(null);
      setEditingMaterialId(null);
      e.target.reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMaterial = async (materialId, courseId) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        setIsLoading(true);
        await courseService.deleteMaterial(courseId, materialId);
        setMaterials(materials.filter(material => material.id !== materialId));
      } catch (error) {
        handleApiError(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // ====================== Assignment Management Functions ======================
  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(e.target);
      const assignmentData = {
        title: formData.get('title'),
        description: formData.get('description'),
        dueDate: formData.get('dueDate'),
        points: parseInt(formData.get('points')),
        instructions: formData.get('instructions'),
      };

      const newAssignment = await courseService.createAssignment(editingCourseId, assignmentData);
      setAssignments([...assignments, newAssignment]);
      e.target.reset();
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAssignment = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(e.target);
      const assignmentData = {
        title: formData.get('title'),
        description: formData.get('description'),
        dueDate: formData.get('dueDate'),
        points: parseInt(formData.get('points')),
        instructions: formData.get('instructions'),
      };

      const updatedAssignment = await courseService.updateAssignment(editingCourseId, editingAssignmentId, assignmentData);
      setAssignments(assignments.map(assignment =>
        assignment.id === editingAssignmentId ? updatedAssignment : assignment
      ));
      setEditingAssignment(null);
      setEditingAssignmentId(null);
      e.target.reset();
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId, courseId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        setIsLoading(true);
        await courseService.deleteAssignment(courseId, assignmentId);
        setAssignments(assignments.filter(assignment => assignment.id !== assignmentId));
      } catch (error) {
        handleApiError(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // ====================== View Materials Handler ======================
  const handleViewMaterials = async (courseId) => {
    try {
      setIsLoading(true);
      const courseDetails = await courseService.getCourseDetails(courseId);
      setMaterials(courseDetails.materials || []);
      setViewingMaterials(courseId);
      setActiveTab('materials');
      
      const courseSelect = document.querySelector('select[name="courseId"]');
      if (courseSelect) {
        courseSelect.value = courseId;
        const event = new Event('change', { bubbles: true });
        courseSelect.dispatchEvent(event);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // ====================== Cancel Handlers ======================
  const handleCancelEdit = () => {
    setEditingCourse(null);
    setEditingCourseId(null);
  };

  const handleCancelLessonEdit = () => {
    setEditingLesson(null);
    setEditingLessonId(null);
  };

  const handleCancelMaterialEdit = () => {
    setEditingMaterial(null);
    setEditingMaterialId(null);
  };

  const handleCancelAssignmentEdit = () => {
    setEditingAssignment(null);
    setEditingAssignmentId(null);
  };

  // ====================== Main Render ======================
  return (
    <div className="app-container">
      {/* Error message at the very top */}
      {error && (
        <div className="error-message" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', zIndex: 2000, background: '#fee2e2', color: '#b91c1c', padding: '16px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <p style={{ margin: 0 }}>{error}</p>
          <button onClick={() => setError(null)} style={{ marginLeft: 16, background: '#b91c1c', color: 'white', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer' }}>Dismiss</button>
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      {/* Sidebar and main content */}
      <nav className="sidebar">
        <div className="logo-gradient">
          <svg xmlns="http://www.w3.org/2000/svg" className="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="sidebar-text">E-Learning</span>
        </div>
        <ul>
          <li 
            className={`sidebar-item ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="sidebar-text">Create Course</span>
          </li>
          <li
            className={`sidebar-item ${activeTab === 'lessons' ? 'active' : ''}`}
            onClick={() => setActiveTab('lessons')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="sidebar-text">Add Lesson</span>
          </li>
          <li 
            className={`sidebar-item ${activeTab === 'materials' ? 'active' : ''}`}
            onClick={() => setActiveTab('materials')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="sidebar-text">Upload Material</span>
          </li>
          <li 
            className={`sidebar-item ${activeTab === 'assignments' ? 'active' : ''}`}
            onClick={() => setActiveTab('assignments')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="sidebar-text">Create Assignment</span>
          </li>
        </ul>
      </nav>

      <main className="main-content">
        {activeTab === 'courses' && (
          <div className="form-container">
            {editingCourse ? (
              <>
                <h2>Edit Course</h2>
                <CourseForm
                  course={editingCourse}
                  onSubmit={handleUpdateCourse}
                  onCancel={handleCancelEdit}
                  submitText="Update Course"
                />
              </>
            ) : (
              <>
                <h2>Create New Course</h2>
                <CourseForm
                  onSubmit={handleCreateCourse}
                  submitText="Create Course"
                />
                <div className="items-list">
                  <h3>Created Courses</h3>
                  {Object.entries(getCoursesByCategory()).map(([category, categoryCourses]) => (
                    categoryCourses.length > 0 && (
                      <div key={category} className="category-section">
                        <h4 className="category-title" style={{ color: getCategoryColor(category) }}>
                          {category}
                        </h4>
                        <div className="category-courses">
                          {categoryCourses.map(course => (
                            <div key={course.id} className="course-card">
                              <div className="card-header">
                                <h4>{course.title}</h4>
                                <div className="card-actions">
                                  <button
                                    className="edit-btn"
                                    onClick={() => handleEditCourse(course)}
                                    title="Edit Course"
                                  >
                                    ✎
                                  </button>
                                  <button
                                    className="delete-btn"
                                    onClick={() => handleDeleteCourse(course.id)}
                                    title="Delete Course"
                                  >
                                    ×
                                  </button>
                                </div>
                              </div>

                              {course.thumbnail && (
                                <div className="course-image">
                                  <img src={course.thumbnail} alt={course.title} />
                                </div>
                              )}

                              <span 
                                className="category-badge"
                                style={{ 
                                  backgroundColor: getCategoryColor(course.category),
                                  color: 'white'
                                }}
                              >
                                {course.category}
                              </span>

                              <p>{course.description}</p>

                              <div className="course-details">
                                <div className="course-price">
                                  ${course.price.toFixed(2)}
                                </div>
                                <div className="course-duration">
                                  {course.duration} hours
                                </div>
                                <div className="course-level">
                                  {course.level}
                                </div>
                              </div>
                          
                              <div className="card-stats">
                                <span>{course.lessons?.length || 0} lessons</span>
                                <span>{course.materials?.length || 0} materials</span>
                                <span>{course.assignments?.length || 0} assignments</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'lessons' && (
          <div className="form-container">
                <h2>Add New Lesson</h2>
                <div className="form-group">
                  <label className="required-field">Select Course</label>
                  <select 
                    name="courseId" 
                    required 
                    className="category-select"
                    value={editingCourseId || ''}
                    onChange={(e) => setEditingCourseId(e.target.value)}
                  >
                    <option value="">Choose a course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
            
                {editingCourseId && (
              <>
                  <LessonForm
                    onSubmit={handleCreateLesson}
                    submitText="Create Lesson"
                  />
                
                {isLoading ? (
                  <div className="loading">Loading lessons...</div>
                ) : (
                <div className="items-list">
                  <h3>Course Lessons</h3>
                    {lessons.length > 0 ? (
                      lessons.map(lesson => (
                          <div key={lesson.id} className="lesson-card">
                            <div className="card-header">
                              <h5>{lesson.title}</h5>
                              <span className="lesson-type">{lesson.type}</span>
                            </div>
                            <p>{lesson.description}</p>
                            <div className="lesson-content">
                              {lesson.content}
                            </div>
                            <div className="card-stats">
                              <span>Duration: {lesson.duration} minutes</span>
                              <span>Order: {lesson.order}</span>
                            </div>
                            <div className="card-actions">
                              <button
                                className="edit-btn"
                                onClick={() => handleEditLesson(lesson)}
                                title="Edit Lesson"
                              >
                                ✎
                              </button>
                              <button
                                className="delete-btn"
                              onClick={() => handleDeleteLesson(lesson.id)}
                                title="Delete Lesson"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                      ))
                    ) : (
                      <p>No lessons available for this course.</p>
                    )}
                      </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="form-container">
            {editingMaterial ? (
              <>
                <h2>Edit Material</h2>
                <MaterialForm
                  material={editingMaterial}
                  onSubmit={handleUpdateMaterial}
                  onCancel={handleCancelMaterialEdit}
                  submitText="Update Material"
                />
              </>
            ) : (
              <>
                <h2>Upload Material</h2>
                <div className="form-group">
                  <label className="required-field">Select Course</label>
                  <select
                    name="courseId"
                    required
                    className="category-select"
                    value={editingCourseId || ''}
                    onChange={(e) => {
                      setEditingCourseId(e.target.value);
                      if (e.target.value) {
                        getCourseMaterials(e.target.value).then(materials => setMaterials(materials));
                      }
                    }}
                  >
                    <option value="">Choose a course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
                {editingCourseId && (
                  <>
                  <MaterialForm
                    onSubmit={handleUploadMaterial}
                    submitText="Upload Material"
                  />
                <div className="items-list">
                  <h3>Course Materials</h3>
                      {isLoading ? (
                        <div className="loading">Loading materials...</div>
                      ) : materials.length > 0 ? (
                        materials.map(material => (
                          <div key={material.id} className="material-card">
                            <div className="card-header">
                              <h5>{material.title}</h5>
                              <span className="material-type">{material.type}</span>
                            </div>
                            <p>{material.description}</p>
                            {material.file && (
                              <div className="material-file">
                                <a 
                                  href={material.file} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="view-content-btn"
                                >
                                  View Content
                                </a>
                              </div>
                            )}
                            <div className="card-actions">
                              <button
                                className="edit-btn"
                                onClick={() => handleEditMaterial(material)}
                                title="Edit Material"
                              >
                                ✎
                              </button>
                              <button
                                className="delete-btn"
                                onClick={() => handleDeleteMaterial(material.id, editingCourseId)}
                                title="Delete Material"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No materials available for this course.</p>
                      )}
                </div>
                  </>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="form-container">
            {editingAssignment ? (
              <>
                <h2>Edit Assignment</h2>
                <AssignmentForm
                  assignment={editingAssignment}
                  onSubmit={handleUpdateAssignment}
                  onCancel={handleCancelAssignmentEdit}
                  submitText="Update Assignment"
                />
              </>
            ) : (
              <>
                <h2>Create New Assignment</h2>
                <div className="form-group">
                  <label className="required-field">Select Course</label>
                  <select 
                    name="courseId" 
                    required 
                    className="category-select"
                    value={editingCourseId || ''}
                    onChange={(e) => {
                      setEditingCourseId(e.target.value);
                      if (e.target.value) {
                        getCourseAssignments(e.target.value).then(assignments => setAssignments(assignments));
                      }
                    }}
                  >
                    <option value="">Choose a course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
                {editingCourseId && (
                  <>
                  <AssignmentForm
                    onSubmit={handleCreateAssignment}
                    submitText="Create Assignment"
                  />
                <div className="items-list">
                  <h3>Course Assignments</h3>
                      {isLoading ? (
                        <div className="loading">Loading assignments...</div>
                      ) : assignments.length > 0 ? (
                        assignments.map(assignment => (
                          <div key={assignment.id} className="assignment-card">
                            <div className="card-header">
                              <h5>{assignment.title}</h5>
                              <span className="assignment-deadline">
                                Due: {new Date(assignment.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                            <p>{assignment.description}</p>
                            <div className="assignment-details">
                              <span>Points: {assignment.points}</span>
                              <span>Instructions: {assignment.instructions}</span>
                            </div>
                            <div className="card-actions">
                              <button
                                className="edit-btn"
                                onClick={() => {
                                  setEditingAssignment(assignment);
                                  setEditingAssignmentId(assignment.id);
                                }}
                                title="Edit Assignment"
                              >
                                ✎
                              </button>
                              <button
                                className="delete-btn"
                                onClick={() => handleDeleteAssignment(assignment.id, editingCourseId)}
                                title="Delete Assignment"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No assignments available for this course.</p>
                      )}
                </div>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default CreateCourse; 
