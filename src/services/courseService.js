import axiosInstance from './axiosInstance';
import axios from 'axios';
import { API_URL } from '../config';

export const courseService = {
  // Create a new course
  createCourse: async (courseData) => {
    try {
      const response = await axiosInstance.post('/Course/Create', courseData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all courses
  getAllCourses: async () => {
    try {
      const response = await axiosInstance.get('/Course/GetAll');
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
      const response = await axiosInstance.delete(`/Course/Delete/${courseId}`);
      return response.data;
    } catch (error) {
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

  // Create an assignment
  createAssignment: async (courseId, assignmentData) => {
    try {
      const response = await axiosInstance.post(`/Course/${courseId}/Assignment`, assignmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get materials by lesson
  getMaterialsByLesson: async (lessonId) => {
    try {
      const response = await axiosInstance.get(`/api/Material/GetMaterialsByLessonId/GetMaterialsByLessonId/${lessonId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create material
  createMaterial: async (materialData) => {
    try {
      const response = await axiosInstance.post('/api/Material/CreateMaterial/CreateMaterial', materialData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update material
  updateMaterial: async (materialData) => {
    try {
      const response = await axiosInstance.put('/api/Material/UpdateMaterial/UpdateMaterial', materialData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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

  // Update an assignment
  updateAssignment: async (courseId, assignmentId, assignmentData) => {
    try {
      const response = await axiosInstance.put(`/Course/${courseId}/Assignment/${assignmentId}`, assignmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete an assignment
  deleteAssignment: async (courseId, assignmentId) => {
    try {
      const response = await axiosInstance.delete(`/Course/${courseId}/Assignment/${assignmentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
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