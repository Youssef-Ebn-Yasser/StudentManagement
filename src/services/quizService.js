import axiosInstance from './axiosInstance';

const API_URL = 'https://e-learn-v1.runasp.net/api';

export const quizService = {
  // Create a quiz for a lesson
  createLessonQuiz: async (quizData) => {
    try {
      console.log('Creating lesson quiz with data:', quizData);
      const response = await axiosInstance.post(`${API_URL}/Quize/CreateQuizWithLesson`, quizData);
      console.log('Quiz creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating lesson quiz:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  },

  // Create a quiz for a course
  createCourseQuiz: async (quizData) => {
    try {
      console.log('Creating course quiz with data:', quizData);
      const response = await axiosInstance.post(`${API_URL}/Quize/CreateQuizWithCourse`, quizData);
      console.log('Quiz creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating course quiz:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  },

  // Get all quizzes for a lesson
  getLessonQuizzes: async (lessonId) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/Quize/GetLessonQuizzes/${lessonId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all quizzes for a course
  getCourseQuizzes: async (courseId) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/Quize/GetQuizzesByCourseId/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course quizzes:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  },

  // Delete a quiz
  deleteQuiz: async (quizId) => {
    try {
      const response = await axiosInstance.delete(`${API_URL}/Quize/${quizId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting quiz:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  },

  // Get a specific quiz by ID
  getQuizById: async (quizId) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/Quize/GetQuizById/${quizId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Submit a quiz
  submitQuiz: async (quizData) => {
    try {
      console.log('Submitting quiz with data:', quizData);
      const response = await axiosInstance.post(`${API_URL}/Quize/SubmitQuiz`, quizData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Quiz submission response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Quiz submission error:', error.response?.data || error);
      throw error;
    }
  },

  // Get quizzes that need to be corrected by the teacher
  getToCorrectQuizzes: async (lessonId) => {
    try {
      console.log('Fetching quizzes to correct for lesson:', lessonId);
      const response = await axiosInstance.get(`${API_URL}/Quize/ToCorrect`, {
        params: { lessonId }
      });
      console.log('Quizzes to correct response:', response.data);
      if (!response.data) {
        throw new Error('No data received from the server');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching quizzes to correct:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  }
}; 