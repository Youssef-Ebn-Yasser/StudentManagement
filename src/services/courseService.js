import axiosInstance from './axiosInstance';
import axios from 'axios';
import { API_URL } from '../config';

export const courseService = {
  // Create a new course
  createCourse: async (courseData) => {
    try {
      // Create FormData object
      const formData = new FormData();
      
      // Add all required fields
      formData.append('Title', courseData.title?.trim());
      formData.append('Description', courseData.description?.trim() || '');
      formData.append('Price', courseData.price);
      formData.append('TeacherId', courseData.teacherId);
      formData.append('CategoryId', courseData.categoryId);
      formData.append('Level', courseData.level);
      formData.append('Hours', courseData.hours);
      
      // Add image if provided
      if (courseData.image) {
        formData.append('Image', courseData.image);
      }

      // Validate required fields
      if (!courseData.title?.trim()) {
        throw new Error('Course title is required');
      }
      if (!courseData.price || courseData.price <= 0) {
        throw new Error('Course price must be greater than 0');
      }
      if (!courseData.teacherId || courseData.teacherId <= 0) {
        throw new Error('Valid teacher ID is required');
      }
      if (!courseData.categoryId || courseData.categoryId <= 0) {
        throw new Error('Valid category ID is required');
      }
      if (!courseData.level?.trim()) {
        throw new Error('Course level is required');
      }
      if (!courseData.hours?.trim()) {
        throw new Error('Course hours is required');
      }

      // Log the form data for debugging
      console.log('Course form data:', {
        Title: courseData.title,
        Description: courseData.description,
        Price: courseData.price,
        TeacherId: courseData.teacherId,
        CategoryId: courseData.categoryId,
        Level: courseData.level,
        Hours: courseData.hours,
        HasImage: !!courseData.image
      });

      // Add retry logic for the request
      const maxRetries = 3;
      let retryCount = 0;
      let lastError = null;

      while (retryCount < maxRetries) {
        try {
          const response = await axiosInstance.post('/Course/Create', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            timeout: 30000, // 30 seconds timeout
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              console.log(`Upload progress: ${percentCompleted}%`);
            }
          });
          return response.data;
        } catch (error) {
          lastError = error;
          if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            retryCount++;
            if (retryCount < maxRetries) {
              console.log(`Retry attempt ${retryCount} of ${maxRetries}`);
              // Wait for 2 seconds before retrying
              await new Promise(resolve => setTimeout(resolve, 2000));
              continue;
            }
          }
          throw error;
        }
      }

      throw lastError;
    } catch (error) {
      console.error('Course creation error:', error.response?.data || error.message);
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new Error('Request timed out. Please try again. The server might be busy or your internet connection is slow.');
      }
      throw error;
    }
  },

  // Get all courses
  getAllCourses: async () => {
    try {
      const response = await axiosInstance.get('/Course/GetAll');
      return response.data;
    } catch (error) {
      console.error('Error in getAllCourses:', error);
      throw error;
    }
  },

  // Get paginated courses for home page
  getPaginatedCourses: async (page = 1, pageSize = 10) => {
    try {
      const response = await axiosInstance.get(`/HomeCourses/GetPaginated?page=${page}&pageSize=${pageSize}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get course details
  getCourseDetails: async (courseId) => {
    try {
      const response = await axiosInstance.get(`/Course/Get/${courseId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update a course
  updateCourse: async (courseId, courseData) => {
    try {
      const response = await axiosInstance.put(`/Course/Update/${courseId}`, courseData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a course
  deleteCourse: async (courseId) => {
    try {
      const response = await axiosInstance.delete(`/Course/Delete/${courseId}?id=${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting course:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get lesson details
  getLessonDetails: async (lessonId) => {
    try {
      const response = await axiosInstance.get(`/api/Lesson/GetLessonDetails/GetLessonDetails/${lessonId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all lessons
  getAllLessons: async () => {
    try {
      const response = await axiosInstance.get('/api/Lesson/GetLessonDetails/Get/All/Lessons');
      return response.data;
    } catch (error) {
      console.error('Error fetching lessons:', error);
      throw error;
    }
  },

  // Get lessons for a course
  getCourseLessons: async (courseId) => {
    try {
      console.log('Fetching lessons for courseId:', courseId);
      const response = await axiosInstance.get(`/api/Lesson/GetLessonDetails/Get/All/Lessons`);
      console.log('Lessons API response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching course lessons:', error);
      throw error;
    }
  },

  // Add a lesson
  addLesson: async (lessonData) => {
    try {
      const response = await axiosInstance.post('/api/Lesson/CreateLesson/CreateLesson', lessonData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update a lesson
  updateLesson: async (lessonData) => {
    try {
      const response = await axiosInstance.put('/api/Lesson/UpdateLesson/UpdateLesson', lessonData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a lesson
  deleteLesson: async (lessonId) => {
    try {
      // Use /api prefix for Vite proxy
      const response = await axiosInstance.delete(`/api/Lesson/DeleteLesson/DeleteLesson/${lessonId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload course material
  uploadMaterial: async (courseId, formData) => {
    try {
      const response = await axiosInstance.post(`/Course/${courseId}/Material`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get materials by lesson
  getLessonMaterials: async (lessonId) => {
    try {
      const response = await axiosInstance.get(`/api/Material/GetMaterialsByLessonId/GetMaterialsByLessonId/${lessonId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lesson materials:', error);
      throw error;
    }
  },

  // Create material
  createMaterial: async (materialData) => {
    try {
      const response = await axiosInstance.post('/api/Material/CreateMaterial/CreateMaterial', materialData, {
       
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update material
  updateMaterial: async (materialData) => {
    try {
      const response = await axiosInstance.put('/api/Material/UpdateMaterial/UpdateMaterial', materialData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete material
  deleteMaterial: async (materialId) => {
    try {
      const response = await axiosInstance.delete(`/api/Material/DeleteMaterial/DeleteMaterial/${materialId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get teacher stats
  getTeacherStats: async (teacherId) => {
    try {
      const response = await axiosInstance.get(`/api/Teacher/Teacher/ById/${teacherId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Category APIs
  // Get category by ID
  getCategory: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/Category/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    try {
      const response = await axiosInstance.put(`/api/Category/Update/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete category
  deleteCategory: async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/Category/Delete/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create category
  createCategory: async (categoryData) => {
    try {
      const response = await axiosInstance.post('/api/Category/Create', categoryData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all categories
  getAllCategories: async () => {
    try {
      const response = await axiosInstance.get('/api/Category/GetAll');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Fetch all levels
  getAllLevels: async () => {
    try {
      const response = await axiosInstance.get('/api/Level/GetAll');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  uploadLessonMaterial: async (materialData) => {
    try {
      // Validate required fields
      if (!materialData.title?.trim()) throw new Error('Title is required');
      if (!materialData.content?.trim()) throw new Error('Content is required');
      if (!materialData.lessonId) throw new Error('LessonId is required');
      if (!materialData.data) throw new Error('File is required');

      // Create FormData object
      const formData = new FormData();
      formData.append('title', materialData.title.trim());
      formData.append('content', materialData.content.trim());
      formData.append('lessonId', materialData.lessonId);
      formData.append('data', materialData.data);
      formData.append('type', materialData.type);

      console.log('Sending request with FormData:', {
        title: materialData.title.trim(),
        content: materialData.content.trim(),
        lessonId: materialData.lessonId,
        type: materialData.type,
        hasFile: !!materialData.data,
        fileName: materialData.data.name,
        fileType: materialData.data.type
      });

      const response = await axiosInstance.post(
        '/api/Material/CreateMaterial/CreateMaterial',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      return response.data;
    } catch (err) {
      if (err.response) {
        console.error('Upload failed:',
          '\nStatus:', err.response.status,
          '\nMessage:', err.response.data?.message || 'Unknown error',
          '\nValidation Errors:', err.response.data?.errors || 'No validation errors'
        );
      } else {
        console.error('Upload failed:', err.message);
      }
      throw err;
    }
  },

  // Update teacher profile
  updateTeacher: async (teacherData) => {
    try {
      // Validate required fields and their constraints
      if (!teacherData.Id) throw new Error('Teacher ID is required');
      if (!teacherData.Name?.trim()) throw new Error('Name is required');
      if (!teacherData.Email?.trim()) throw new Error('Email is required');
      if (!teacherData.Email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) throw new Error('Invalid email format');
      if (!teacherData.Age || teacherData.Age < 20 || teacherData.Age > 255) throw new Error('Age must be between 20 and 255');
      if (!teacherData.Specialization?.trim()) throw new Error('Specialization is required');
      if (teacherData.Specialization.length > 100) throw new Error('Specialization cannot exceed 100 characters');
      if (teacherData.AdditionalInfo && teacherData.AdditionalInfo.length > 500) throw new Error('Additional Info cannot exceed 500 characters');
      if (!teacherData.PhoneNumber?.trim()) throw new Error('Phone number is required');
      if (!teacherData.PhoneNumber.match(/^\+?[1-9]\d{1,14}$/)) throw new Error('Invalid phone number format');

      // Format request data to match backend DTO exactly
      const params = {
        Id: parseInt(teacherData.Id),
        Name: teacherData.Name.trim(),
        Email: teacherData.Email.trim(),
        Age: parseInt(teacherData.Age),
        AdditionalInfo: teacherData.AdditionalInfo?.trim() || '',
        Specialization: teacherData.Specialization.trim(),
        Phone: teacherData.PhoneNumber.trim(),
        Password: teacherData.Password?.trim() || '',
        Image: teacherData.Image || null
      };

      // Log the exact request data being sent (excluding password for security)
      console.log('Raw teacher data received:', teacherData);
      console.log('Formatted request data:', {
        ...params,
        Password: params.Password ? '[REDACTED]' : ''
      });

      const response = await axiosInstance.put('/api/Teacher/Teacher/Update', null, {
        params: params
      });
      
      // Log the response for debugging
      console.log('Update response:', response);
      
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Update failed:', {
          status: error.response.status,
          data: error.response.data,
          requestData: error.config?.params,
          headers: error.config?.headers
        });
        
        // Extract the error message from the response
        const errorMessage = error.response.data?.message || 
                           error.response.data?.error || 
                           error.response.data?.errors?.join(', ') || 
                           'Failed to update teacher profile';
        
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
};

export const getPaginatedCourses = async (page = 1, enOrderBy = 0) => {
  try {
    // Ensure page is a number and at least 1
    const pageNumber = Math.max(1, parseInt(page));
    
    const response = await axios.get(`${API_URL}/HomeCourses/GetPaginated`, {
      params: {
        pageNumber: pageNumber,
        PageSize: 4,
        enOrderBy: enOrderBy
      }
    });
    
    if (response.data.succeeded) {
      return {
        succeeded: true,
        data: {
          data: response.data.data.data,
          totalPage: response.data.data.totalPage,
          currentPage: response.data.data.currentPage,
          totalCount: response.data.data.totalCount,
          hasNextPage: response.data.data.hasNextPage,
          hasPreviousPage: response.data.data.hasPreviousPage
        }
      };
    } else {
      throw new Error(response.data.message || 'Failed to fetch courses');
    }
  } catch (error) {
    console.error('Error fetching paginated courses:', error);
    throw error;
  }
}; 