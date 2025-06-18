import axiosInstance from './axiosInstance';

const API_URL = 'https://e-learn-v1.runasp.net/api';

export const assignmentService = {
  // Get assignments by lesson ID
  getAssignmentsByLessonId: async (lessonId) => {
    try {
      console.log('Fetching assignments for lesson:', lessonId);
      const response = await axiosInstance.get(`${API_URL}/Assignment/GetAssignmentByLessonId`, {
        params: { lessonId }
      });
      console.log('Assignments response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching assignments:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  },

  // Get assignment details for correction
  getAssignmentForCorrection: async (studentAssignmentId) => {
    try {
      console.log('Fetching assignment details for correction with ID:', studentAssignmentId);
      const response = await axiosInstance.get(`${API_URL}/Assignment/GetAssignmentForStudentToCorrect?studentAssignmentId=${studentAssignmentId}`);
      console.log('Assignment details response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching assignment details:', error.response?.data || error.message);
      throw error;
    }
  },

  // Save student degree in assignment
  saveStudentDegreeInAssignment: async (id, degreePercentage) => {
    try {
      console.log('Saving degree for assignment ID:', id, 'with percentage:', degreePercentage);
      const response = await axiosInstance.post(`${API_URL}/Assignment/SaveStudentDegreeInAssignment`, {
        id: id,
        degreePercentage: degreePercentage
      });
      console.log('Save student degree response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error saving student degree:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  }
}; 