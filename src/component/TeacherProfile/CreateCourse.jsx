import React, { useState, useEffect } from 'react';
import { courseService } from '../../services/courseService';
import Loader from '../Loader/Loader';
import "./CreateCourse.css";
import axiosInstance from '../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { t } from 'i18next';
import ContentWrapper from '../ContentWrapper/ContentWrapper'


const CreateCourse = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const teacherId = user?.id;
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

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

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const response = await axiosInstance.get('https://e-learn-v1.runasp.net/api/Category/All');
      console.log('Categories API Response:', response);
      
      if (response.data && response.data.data) {
        setCategories(response.data.data);
      } else if (response.data && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.error('Unexpected categories data structure:', response.data);
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    } finally {
      setIsLoadingCategories(false);
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
      
      // Get teacher ID from localStorage
      const teacherId = localStorage.getItem('guestId');
      if (!teacherId) {
        throw new Error(`${t("teacher-id-not-found")}`);
      }

      // Validate and format the data
      const title = formData.get('title')?.trim();
      const description = formData.get('description')?.trim();
      const price = parseFloat(formData.get('price'));
      const categoryId = parseInt(formData.get('categoryId'));
      const level = formData.get('level')?.trim();
      const hours = formData.get('hours')?.trim();
      const image = formData.get('thumbnail');

      // Validate required fields
      const validationErrors = [];
      if (!title) validationErrors.push('Course title is required');
      if (!description) validationErrors.push('Course description is required');
      if (!price || isNaN(price) || price <= 0) validationErrors.push('Valid price is required');
      if (!categoryId || isNaN(categoryId)) validationErrors.push('Valid category is required');
      if (!level) validationErrors.push('Course level is required');
      if (!hours) validationErrors.push('Course hours is required');

      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      // Create course data object with validated fields and proper casing
      const courseData = {
        Title: title,
        Description: description,
        Price: price.toString(), // Convert price to string
        TeacherId: parseInt(teacherId), // Ensure teacherId is a number
        CategoryId: categoryId,
        Level: level,
        Hours: hours,
        Image: image
      };

      // Log the data being sent
      console.log('Sending course data:', courseData);

      const response = await courseService.createCourse(courseData);
      console.log('Course created successfully:', response);
      
      // Reset the form
      e.target.reset();
      
      // Show enhanced success message
      const categoryName = categories.find(cat => cat.id === categoryId)?.name || 'N/A';
      const successMessage = `
        🎉 ${t("course-created-success")}!
        
        ${t("title")}: ${title}
        ${t("category")}: ${categoryName}
        ${t("level")}: ${level}
        ${t("duration")}: ${hours}
        
        ${t("course-created-note")}
      `;
      
      alert(successMessage);
      
      // Navigate to courses page
      navigate('/teacher/courses');
      
    } catch (error) {
      console.error('Error creating course:', error);
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
    const courseToDelete = courses.find(course => course.id === courseId);
    
    if (window.confirm(`
      ${t("confirm-delete-course")}
      
      ${t("course-details")}:
       ${t("title")}: ${courseToDelete?.title}
       ${t("category")}: ${courseToDelete?.category}
       ${t("level")}: ${courseToDelete?.level}
      
      ⚠️ ${t("delete-course-warning")}
    `)) {
      try {
        setIsLoading(true);
        await courseService.deleteCourse(courseId);
        
        // Show success message
        alert(`
          ✅ ${t("course-deleted-success")}
          
          ${t("course-deleted-note")}
        `);
        
        // Update the courses list
        setCourses(courses.filter(course => course.id !== courseId));
      } catch (error) {
        console.error('Error deleting course:', error);
        setError(error.response?.data?.message || error.message || 'Failed to delete course');
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
      if (!formData.get('categoryId')) validationErrors.categoryId = 'Category is required';
      if (!formData.get('level')) validationErrors.level = 'Level is required';
      if (!formData.get('hours')) validationErrors.hours = 'Hours is required';
      
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      onSubmit(e);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-group">
          <label className="required-field"> ${t("title")}</label>
          <input
            type="text"
            name="title"
            required
            defaultValue={course?.title}
            placeholder={t("enter-course-title")}
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label>{t("course-image")}</label>
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
          <label className="required-field">{t("description")}</label>
          <textarea
            name="description"
            required
            defaultValue={course?.description}
            placeholder={t("enter-course-description")}
            rows="4"
            className={errors.description ? 'error' : ''}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label className="required-field">{t("price")}</label>
          <input
            type="number"
            name="price"
            required
            min="0.01"
            step="0.01"
            defaultValue={course?.price}
            placeholder={t("enter-course-price")}
            className={errors.price ? 'error' : ''}
          />
          {errors.price && <span className="error-message">{errors.price}</span>}
        </div>

        <div className="form-group">
          <label className="required-field block text-sm font-medium text-gray-700 mb-2">{t("category")}</label>
          <div className="relative">
            <select
              name="categoryId"
              required
              defaultValue={course?.categoryId}
              className={`
                w-full px-4 py-2.5 rounded-lg border
                ${errors.categoryId ? 'border-red-500' : 'border-gray-300'}
                ${isLoadingCategories ? 'opacity-50 bg-gray-50' : 'bg-white'}
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-all duration-200 ease-in-out
                appearance-none cursor-pointer
                hover:border-blue-400
              `}
              disabled={isLoadingCategories}
            >
              <option value="" className="text-gray-500">{t("select-category")}</option>
              {categories && categories.length > 0 ? (
                categories.map((category) => (
                  <option 
                    key={category.id} 
                    value={category.id}
                    className="py-2 px-4 hover:bg-blue-50"
                  >
                    {category.name}
                  </option>
                ))
              ) : (
                <option value="" disabled className="text-gray-500">{t("no-categories-available")}</option>
              )}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {isLoadingCategories && (
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {t("loading")} {t("Categories")}...
            </div>
          )}
          {!isLoadingCategories && categories.length === 0 && (
            <div className="mt-2 text-sm text-red-500 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t("no-categories-available")}
            </div>
          )}
          {errors.categoryId && (
            <div className="mt-2 text-sm text-red-500 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.categoryId}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="required-field">{t("level")}</label>
          <select
            name="level"
            required
            defaultValue={course?.level}
            className={`
              w-full px-4 py-2.5 rounded-lg border
              ${errors.level ? 'border-red-500' : 'border-gray-300'}
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-200 ease-in-out
              appearance-none cursor-pointer
              hover:border-blue-400
            `}
          >
            <option value="">{t("select-level")}</option>
            <option value="Beginner">{t("level-beginner")}</option>
            <option value="Intermediate">{t("level-intermediate")}</option>
            <option value="Advanced">{t("level-advanced")}</option>
          </select>
          {errors.level && <span className="error-message">{errors.level}</span>}
        </div>

        <div className="form-group">
          <label className="required-field">{t("hours")}</label>
          <input
            type="text"
            name="hours"
            required
            defaultValue={course?.hours}
            placeholder={t("enter-course-duration")}
            className={errors.hours ? 'error' : ''}
          />
          {errors.hours && <span className="error-message">{errors.hours}</span>}
        </div>

        <div className="flex justify-end space-x-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 ease-in-out shadow-sm hover:shadow-md"
            >
              {t('cancel')}
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 text-white bg-gradient-to-r from-[var(--primary-dark)] to-[var(--primary-color)] rounded-lg hover:opacity-90 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg"
          >
            {submitText}
          </button>
        </div>
      </form>
    );
  };

  if (isLoading) {
    return (
      <>
          {isLoading && <Loader visible={isLoading} />}
          <ContentWrapper $isLoading={isLoading}>
              <div className="flex items-center justify-center h-[calc(100vh-300px)]">
                <div className="scale-[2.5]">
                  <Loader />
                </div>
              </div>
          </ContentWrapper></>
      
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
            {t("retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="w-full min-h-screen bg-white p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t("create-new-course")}</h1>
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
            onCancel={() => navigate(-1)}
            submitText="Create Course"
          />
        )}

        <div className="mt-12">
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
                          {course.duration} {t("hours")}
                        </div>
                        <div className="course-level">
                          {course.level}
                        </div>
                      </div>
                  
                      <div className="card-stats">
                        <span>{course.lessons?.length || 0} {t("lessons")}</span>
                        <span>{course.materials?.length || 0} {t("materials")}</span>
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