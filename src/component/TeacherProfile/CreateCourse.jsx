import React, { useState, useEffect } from 'react';
import { courseService } from '../../services/courseService';
import AddLesson from './AddLesson';
import AddMaterial from './AddMaterial';
import Loader from '../Loader/Loader';
import "./CreateCourse.css";

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
      setError(null);
      const formData = new FormData(e.target);
      
      // Create course data object with required fields
      const courseData = {
        title: formData.get('title')?.trim(),
        description: formData.get('description')?.trim(),
        price: parseFloat(formData.get('price')),
        teacherId: 36,
        level: formData.get('level'),
        image: formData.get('thumbnail')
      };

      // Log the data being sent
      console.log('Sending course data:', courseData);

      const response = await courseService.createCourse(courseData);
      console.log('Course created successfully:', response);
      
      // Refresh the course list
      const coursesResponse = await courseService.getAllCourses();
      setCourses(coursesResponse.data || []);
      
      // Reset the form
      e.target.reset();
      
      // Show success message or handle success state
      alert('Course created successfully!');
    } catch (error) {
      console.error('Error creating course:', error);
      if (error.response?.data) {
        console.error('Error details:', error.response.data);
      }
      setError(error.response?.data?.message || error.message || 'Failed to create course');
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
      if (!formData.get('price')) validationErrors.price = 'Price is required';
      if (isNaN(parseFloat(formData.get('price')))) validationErrors.price = 'Price must be a number';
      if (parseFloat(formData.get('price')) <= 0) validationErrors.price = 'Price must be greater than 0';
      
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
            min="0.01"
            step="0.01"
            defaultValue={course?.price}
            placeholder="Enter course price"
            className={errors.price ? 'error' : ''}
          />
          {errors.price && <span className="error-message">{errors.price}</span>}
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-300px)]">
        <div className="scale-[2.5]">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-300px)]">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="w-full min-h-screen bg-white p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
        </div>

        {editingCourse ? (
          <CourseForm
            course={editingCourse}
            onSubmit={handleUpdateCourse}
            onCancel={handleCancelEdit}
            submitText="Update Course"
          />
        ) : (
          <CourseForm
            onSubmit={handleCreateCourse}
            submitText="Create Course"
          />
        )}

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Courses</h2>
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
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateCourse; 