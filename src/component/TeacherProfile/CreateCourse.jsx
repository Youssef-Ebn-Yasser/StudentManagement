import React, { useState, useEffect } from 'react';
import { courseService } from '../../services/courseService';
import AddLesson from './AddLesson';
import AddMaterial from './AddMaterial';
import AddAssignment from './AddAssignment';
import Sidebar from './Sidebar';
import "./CearteCourse.css";

const CreateCourse = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

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

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(e.target);
      if (formData.get('thumbnail') && formData.get('thumbnail').size > 0) {
        await courseService.createCourse(formData, true);
      } else {
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
      const coursesData = await courseService.getAllCourses();
      setCourses(coursesData);
    } catch (error) {
      setError(error.message || 'Failed to create course');
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
      setError(error.message || 'Failed to update course');
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
        setError(error.message || 'Failed to delete course');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingCourse(null);
    setEditingCourseId(null);
  };

  const CourseForm = ({ course, onSubmit, onCancel, submitText }) => {
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const validationErrors = {};
      
      if (!formData.get('title')) validationErrors.title = 'Title is required';
      if (!formData.get('description')) validationErrors.description = 'Description is required';
      if (!formData.get('category')) validationErrors.category = 'Category is required';
      if (!formData.get('price')) validationErrors.price = 'Price is required';
      if (isNaN(parseFloat(formData.get('price')))) validationErrors.price = 'Price must be a number';
      if (!formData.get('duration')) validationErrors.duration = 'Duration is required';
      if (isNaN(parseInt(formData.get('duration')))) validationErrors.duration = 'Duration must be a number';
      if (!formData.get('level')) validationErrors.level = 'Level is required';
      
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

  const renderContent = () => {
    switch (activeTab) {
      case 'courses':
        return (
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
        );
      case 'lessons':
        return <AddLesson />;
      case 'materials':
        return <AddMaterial />;
      case 'assignments':
        return <AddAssignment />;
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main-content">
        {error && (
          <div className="error-message" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', zIndex: 2000, background: '#fee2e2', color: '#b91c1c', padding: '16px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <p style={{ margin: 0 }}>{error}</p>
            <button onClick={() => setError(null)} style={{ marginLeft: 16, background: '#b91c1c', color: 'white', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer' }}>Dismiss</button>
          </div>
        )}

        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}

        {renderContent()}
      </main>
    </div>
  );
};

export default CreateCourse; 