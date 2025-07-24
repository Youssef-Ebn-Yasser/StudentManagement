import axiosInstance from './axiosInstance';
import axios from 'axios';
import { API_URL } from '../config';

export const courseService = {
  // Get teacher details
  getTeacherDetails: async (teacherId) => {
    try {
      const response = await axiosInstance.get(`/api/Teacher?id=${teacherId}`);
      console.log('Raw teacher response:', JSON.stringify(response.data, null, 2));
      return response.data; // Return the full response data
    } catch (error) {
      console.error('Error in getTeacherDetails:', error);
      throw error;
    }
  },
  // Create a new course
  createCourse: async (courseData) => {
    try {
      // Create FormData object
      const formData = new FormData();
      
      // Add all required fields with proper validation
      if (!courseData.Title?.trim()) {
        throw new Error('Course title is required');
      }
      formData.append('Title', courseData.Title.trim());

      if (!courseData.Description?.trim()) {
        throw new Error('Course description is required');
      }
      formData.append('Description', courseData.Description.trim());

      // Validate and format price
      const price = parseFloat(courseData.Price);
      if (isNaN(price) || price <= 0) {
        throw new Error('Valid course price is required');
      }
      formData.append('Price', price.toString());

      // Validate and format teacher ID
      const teacherId = parseInt(courseData.TeacherId);
      if (isNaN(teacherId) || teacherId <= 0) {
        throw new Error('Valid teacher ID is required');
      }
      formData.append('TeacherId', teacherId.toString());

      // Validate and format category ID
      const categoryId = parseInt(courseData.CategoryId);
      if (isNaN(categoryId) || categoryId <= 0) {
        throw new Error('Valid category ID is required');
      }
      formData.append('CategoryId', categoryId.toString());

      if (!courseData.Level?.trim()) {
        throw new Error('Course level is required');
      }
      formData.append('Level', courseData.Level.trim());

      if (!courseData.Hours?.trim()) {
        throw new Error('Course hours is required');
      }
      formData.append('Hours', courseData.Hours.trim());
      
      // Add image if provided
      if (courseData.Image) {
        formData.append('Image', courseData.Image);
      }

      // Log the form data for debugging
      console.log('Course form data:', {
        Title: courseData.Title,
        Description: courseData.Description,
        Price: price.toString(),
        TeacherId: teacherId.toString(),
        CategoryId: categoryId.toString(),
        Level: courseData.Level,
        Hours: courseData.Hours,
        HasImage: !!courseData.Image
      });

      // Add retry logic for the request
      const maxRetries = 3;
      let retryCount = 0;
      let lastError = null;

      while (retryCount < maxRetries) {
        try {
          const response = await axiosInstance.post('/api/Course', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            timeout: 30000, // 30 seconds timeout
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              console.log(`Upload progress: ${percentCompleted}%`);
            }
          });

          if (!response.data) {
            throw new Error('No data received from server');
          }

          return response.data;
        } catch (error) {
          lastError = error;
          
          // Handle specific error cases
          if (error.response) {
            const status = error.response.status;
            const data = error.response.data;
            
            if (status === 400) {
              const errorMessage = data?.message || data?.error || 'Invalid request data';
              console.error('Server validation error:', data);
              if (data?.errors) {
                const validationErrors = Object.entries(data.errors)
                  .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                  .join('\n');
                throw new Error(`Validation failed:\n${validationErrors}`);
              }
              throw new Error(`Invalid request: ${errorMessage}`);
            } else if (status === 401) {
              throw new Error('Unauthorized: Please log in again');
            } else if (status === 403) {
              throw new Error('Access denied: You do not have permission to create courses');
            } else if (status === 413) {
              throw new Error('File too large: Please reduce the image size');
            } else if (status === 500) {
              throw new Error('Server error: Please try again later');
            }
          } else if (error.request) {
            if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
              retryCount++;
              if (retryCount < maxRetries) {
                console.log(`Retry attempt ${retryCount} of ${maxRetries}`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                continue;
              }
              throw new Error('Request timed out. Please check your internet connection and try again.');
            }
            throw new Error('No response from server. Please check your internet connection.');
          }
          
          throw new Error(`Failed to create course: ${error.message}`);
        }
      }

      throw lastError;
    } catch (error) {
      // Log the error for debugging
      console.error('Course creation error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });

      // Rethrow the error with a user-friendly message
      throw error;
    }
  },

  // Get all courses
  getAllCourses: async () => {
    try {
      const response = await axiosInstance.get('/api/Course/All');
      return response.data;
    } catch (error) {
      console.error('Error in getAllCourses:', error);
      throw error;
    }
  },

  // Get teacher's courses
  getTeacherCourses: async (teacherId) => {
    try {
      const response = await axiosInstance.get(`https://e-learn-v1.runasp.net/api/Course/GetAllCoursesOfTeacher?teacherId=${teacherId}`);
      return response.data;
    } catch (error) {
      console.error('Error in getTeacherCourses:', error);
      throw error;
    }
  },

  // Get paginated courses for home page
  getPaginatedCourses: async (page = 1, pageSize = 10) => {
    try {
      const response = await axiosInstance.get(`/api/Course/HomeCourses/GetPaginated?pageNumber=${page}&PageSize=${pageSize}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get course details
  getCourseDetails: async (courseId) => {
    try {
      const response = await axiosInstance.get(`https://e-learn-v1.runasp.net/api/Course?id=${courseId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update a course
  updateCourse: async (courseId, courseData) => {
    try {
      // Validate required fields
      if (!courseId || courseId <= 0) throw new Error('Course ID is required');
      if (!courseData.title?.trim()) throw new Error('Course title is required');
      if (!courseData.price || courseData.price <= 0) throw new Error('Course price must be greater than 0');
      if (!courseData.teacherId || courseData.teacherId <= 0) throw new Error('Valid teacher ID is required');
      if (!courseData.categoryId || courseData.categoryId <= 0) throw new Error('Valid category ID is required');
      if (!courseData.level?.trim()) throw new Error('Course level is required');
      if (!courseData.hours?.trim()) throw new Error('Course hours is required');

      const token = localStorage.getItem('token') || localStorage.getItem('JWTToken');
      const response = await axiosInstance.put(
        `/api/Course?Id=${courseId}&Title=${encodeURIComponent(courseData.title)}&Description=${encodeURIComponent(courseData.description || '')}&Price=${courseData.price}&TeacherId=${courseData.teacherId}&CategoryId=${courseData.categoryId}&Level=${encodeURIComponent(courseData.level)}&Hours=${encodeURIComponent(courseData.hours)}`,
        // Send image as form data if it exists
        courseData.image ? {
          file: courseData.image
        } : null,
        {
          headers: {
            'Content-Type': courseData.image ? 'multipart/form-data' : 'application/json',
            Authorization: `Bearer ${token}`
          },
          timeout: 30000
        }
      );

      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Server Error Response:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      }
      throw error;
    }
  },

  // Delete a course
  deleteCourse: async (courseId) => {
    try {
      const response = await axiosInstance.delete(`/api/Course?id=${courseId}`);
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
      const response = await axiosInstance.post('/api/Lesson', lessonData);
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
      const response = await axiosInstance.delete(`/api/Lesson?lessonId=${lessonId}`);
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
      const response = await axiosInstance.get(`https://e-learn-v1.runasp.net/api/Material?lessonId=${lessonId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lesson materials:', error);
      throw error;
    }
  },

  // Get student assignments for a lesson
  getStudentAssignments: async (lessonId) => {
    try {
      const response = await axiosInstance.get(`/api/Assignment/GetStudentAssignmentForLessonId?lessonId=${lessonId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student assignments:', error);
      throw error;
    }
  },

  // Create material
  createMaterial: async (materialData) => {
    try {
      const response = await axiosInstance.post('/api/Material', materialData, {
       
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update material
  updateMaterial: async (materialId, materialData) => {
    try {
      const formData = new FormData();
      formData.append('Id', materialId);
      formData.append('Title', materialData.title);
      formData.append('Content', materialData.content);
      formData.append('LessonId', materialData.lessonId);
      formData.append('Type', materialData.type || 1);
      
      if (materialData.file) {
        formData.append('Data', materialData.file);
      }

      const response = await axiosInstance.put('/api/Material', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error updating material:', error);
      throw error;
    }
  },

  // Delete material
  deleteMaterial: async (materialId) => {
    try {
      const response = await axiosInstance.delete(`/api/Material?materialId=${materialId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get teacher stats
  getTeacherStats: async (teacherId) => {
    try {
      const response = await axiosInstance.get(`/api/Course/GetAllCoursesOfTeacher?teacherId=${teacherId}`);
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
      const response = await axiosInstance.get('https://e-learn-v1.runasp.net/api/Category/All');
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

  // Upload lesson material
  uploadLessonMaterial: async (formData) => {
    try {
      const response = await axiosInstance.post('/api/Material/CreateMaterial/CreateMaterial', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading material:', error);
      throw error;
    }
  },

  // Update teacher profile
  updateTeacher: async (teacherData) => {
    try {
      // Validate required fields
      if (!teacherData.Id) throw new Error('Teacher ID is required');
      if (!teacherData.Name?.trim()) throw new Error('Name is required');

      // Create query parameters like the working example
      const params = new URLSearchParams();
      params.append('Id', teacherData.Id);
      params.append('Name', teacherData.Name.trim());
      if (teacherData.Age !== null && teacherData.Age !== undefined) {
        params.append('Age', teacherData.Age.toString());
      }
      if (teacherData.Specialization) {
        params.append('Specialization', teacherData.Specialization);
      }
      if (teacherData.Phone) {
        params.append('Phone', teacherData.Phone);
      }
      if (teacherData.Education) {
        params.append('Education', teacherData.Education);
      }
      if (teacherData.AdditionalInfo) {
        params.append('AdditionalInfo', teacherData.AdditionalInfo);
      }

      // Log data being sent for debugging
      console.log('Sending teacher update data:', {
        Id: teacherData.Id,
        Name: teacherData.Name.trim(),
        Age: teacherData.Age,
        Education: teacherData.Education,
        AdditionalInfo: teacherData.AdditionalInfo
      });

      const response = await axiosInstance.put(`/api/Teacher?${params.toString()}`);
      
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Update failed:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
          message: error.response.data?.message,
          errors: error.response.data?.errors
        });
        
        // Don't throw authentication errors that might cause logout
        if (error.response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        
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