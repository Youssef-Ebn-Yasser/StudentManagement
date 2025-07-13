import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const StudentQuizStats = () => {
  const [quizStats, setQuizStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { courseId } = useParams();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchQuizStats = async () => {
      if (!user?.id || !courseId) {
        setError('Student ID or Course ID is missing.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const studentId = user.id;
        console.log('Fetching quiz stats with:', { studentId, courseId });

        const response = await axiosInstance.get(`/api/Quize/StudentCourseStats`, {
          params: {
            studentId: studentId,
            courseId: courseId
          }
        });

        console.log('Full API Response:', response);
        console.log('Response Data:', response.data);

        if (response.data) {
          setQuizStats(response.data);
        } else {
          setError('No data received from the server.');
        }
      } catch (err) {
        console.error('Error details:', {
          message: err.message,
          response: err.response,
          request: err.request
        });
        
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          setError(`Server Error: ${err.response.status} - ${err.response.data?.message || 'Unknown error'}`);
        } else if (err.request) {
          // The request was made but no response was received
          setError('No response received from server. Please check your internet connection.');
        } else {
          // Something happened in setting up the request that triggered an Error
          setError(`Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuizStats();
  }, [user?.id, courseId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100">
        <div className="text-center text-indigo-700 text-xl font-semibold">
          Loading quiz statistics...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl relative shadow-md flex items-center max-w-2xl">
          <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
          </svg>
          <div>
            <strong className="font-bold text-xl block mb-2">Error!</strong>
            <span className="block text-lg">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!quizStats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100">
        <div className="bg-white rounded-xl shadow-lg p-10 text-center text-gray-600 border border-gray-200 flex flex-col items-center justify-center">
          <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
          </svg>
          <p className="text-2xl font-medium mb-4">No quiz statistics available for this course.</p>
          <p className="text-gray-500 text-lg">Take some quizzes to see your results here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-indigo-200">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center leading-tight">Your Quiz Results</h1>

        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Overall Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-indigo-50 rounded-lg">
                <p className="text-sm text-indigo-600 font-medium">Student Name</p>
                <p className="text-lg font-semibold">{quizStats.studentName}</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg">
                <p className="text-sm text-indigo-600 font-medium">Number of Quizzes Submitted</p>
                <p className="text-lg font-semibold">{quizStats.numberOfQuizzesSubmitted}</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg">
                <p className="text-sm text-indigo-600 font-medium">Percentage of Submitted</p>
                <p className="text-lg font-semibold">{quizStats.percentageOfSubmitted}%</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg">
                <p className="text-sm text-indigo-600 font-medium">Percentage of Degree</p>
                <p className="text-lg font-semibold">{quizStats.percentageOfDegree}%</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg">
                <p className="text-sm text-indigo-600 font-medium">Percentage of Pass Quiz</p>
                <p className="text-lg font-semibold">{quizStats.percentageOfPassQuiz}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Lesson Statistics</h2>
            {quizStats.lessons.map((lesson, lessonIndex) => (
              <div key={lessonIndex} className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{lesson.lessonName}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <p className="text-sm text-indigo-600 font-medium">Number of Quizzes in Lesson</p>
                    <p className="text-lg font-semibold">{lesson.numberOfQuizzesInLesson}</p>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <p className="text-sm text-indigo-600 font-medium">Percentage of Degree for All Quizzes</p>
                    <p className="text-lg font-semibold">{lesson.percentageOfDegreeForAllQuizzes}%</p>
                  </div>
                </div>
                <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-indigo-100">
                  <table className="min-w-full leading-normal">
                    <thead>
                      <tr>
                        <th className="px-6 py-4 border-b-2 border-gray-200 bg-indigo-50 text-left text-sm font-semibold text-indigo-800 uppercase tracking-wider">
                          Quiz Name
                        </th>
                        <th className="px-6 py-4 border-b-2 border-gray-200 bg-indigo-50 text-left text-sm font-semibold text-indigo-800 uppercase tracking-wider">
                          Student Degree
                        </th>
                        <th className="px-6 py-4 border-b-2 border-gray-200 bg-indigo-50 text-left text-sm font-semibold text-indigo-800 uppercase tracking-wider">
                          Student Percentage
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {lesson.quizzes.map((quiz, quizIndex) => (
                        <tr key={quizIndex} className="hover:bg-indigo-50 transition-colors duration-200">
                          <td className="px-6 py-4 border-b border-gray-200 text-lg text-gray-900">
                            {quiz.quizName}
                          </td>
                          <td className="px-6 py-4 border-b border-gray-200 text-lg text-gray-900">
                            {quiz.studentDegree}
                          </td>
                          <td className="px-6 py-4 border-b border-gray-200 text-lg text-gray-900">
                            {quiz.studentPercentage}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentQuizStats; 