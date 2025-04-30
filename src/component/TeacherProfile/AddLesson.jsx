import React, { useState, useEffect } from 'react';
import { courseService } from '../../services/courseService';
import "./CreateCourse.css";

const AddLesson = () => {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [editingLesson, setEditingLesson] = useState(null);
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const lessonTypes = {
    LECTURE: 'lecture',
    PRACTICE: 'practice',
    QUIZ: 'quiz',
    ASSIGNMENT: 'assignment'
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await courseService.getAllCourses();
        setCourses(response?.data || []);
      } catch (error) {
        setError(error.message || 'Failed to load courses');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (editingCourseId) {
      const loadLessons = async () => {
        try {
          setIsLoading(true);
          const response = await courseService.getCourseDetails(editingCourseId);
          setLessons(response.data?.lessons || []);
        } catch (error) {
          setError(error.message || 'Failed to load lessons');
        } finally {
          setIsLoading(false);
        }
      };
      loadLessons();
    }
  }, [editingCourseId]);

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
        const updatedCourse = await courseService.getCourseDetails(editingCourseId);
        setLessons(updatedCourse.data?.lessons || []);
        e.target.reset();
      } else {
        throw new Error(response.messages?.[0] || 'Failed to create lesson');
      }
    } catch (error) {
      setError(error.message || 'Failed to create lesson');
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
      setError(error.message || 'Failed to update lesson');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      try {
        setIsLoading(true);
        await courseService.deleteLesson(editingCourseId, lessonId);
        setLessons(lessons.filter(lesson => lesson.id !== lessonId));
      } catch (error) {
        setError(error.message || 'Failed to delete lesson');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingLesson(null);
    setEditingLessonId(null);
  };

  const LessonForm = ({ lesson, onSubmit, onCancel, submitText }) => {
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const validationErrors = {};
      
      if (!formData.get('title')) validationErrors.title = 'Title is required';
      if (!formData.get('description')) validationErrors.description = 'Description is required';
      if (!formData.get('type')) validationErrors.type = 'Type is required';
      if (!formData.get('content')) validationErrors.content = 'Content is required';
      if (!formData.get('duration')) validationErrors.duration = 'Duration is required';
      if (isNaN(parseInt(formData.get('duration')))) validationErrors.duration = 'Duration must be a number';
      if (!formData.get('order')) validationErrors.order = 'Order is required';
      if (isNaN(parseInt(formData.get('order')))) validationErrors.order = 'Order must be a number';
      
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

  return (
    <div className="form-container">
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
          {editingLesson ? (
            <>
              <h2>Edit Lesson</h2>
              <LessonForm
                lesson={editingLesson}
                onSubmit={handleUpdateLesson}
                onCancel={handleCancelEdit}
                submitText="Update Lesson"
              />
            </>
          ) : (
            <>
              <LessonForm
                onSubmit={handleCreateLesson}
                submitText="Create Lesson"
              />
            </>
          )}

          <div className="items-list">
            <h3>Course Lessons</h3>
            {isLoading ? (
              <div className="loading">Loading lessons...</div>
            ) : lessons.length > 0 ? (
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
        </>
      )}
    </div>
  );
};

export default AddLesson; 