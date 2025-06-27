import axiosInstance from './axiosInstance';

const reportService = {
  getSummary: async () => {
    const response = await axiosInstance.get('/api/Report/summary');
    return response.data;
  },
  getAverageStudentScores: async () => {
    const response = await axiosInstance.get('/api/Report/average-student-scores');
    return response.data;
  },
  getCourseEnrollments: async () => {
    const response = await axiosInstance.get('/api/Report/course-enrollments');
    return response.data;
  },
  getWeeklyNewStudents: async () => {
    const response = await axiosInstance.get('/api/Report/weekly-new-students');
    return response.data;
  },
  getCourseRevenues: async () => {
    const response = await axiosInstance.get('/api/Report/course-revenues');
    return response.data;
  },
};

export default reportService; 