import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentAnswers = () => {
  const [answers, setAnswers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [grading, setGrading] = useState(false);
  const [grades, setGrades] = useState({});
  const navigate = useNavigate();
  const { answerId } = useParams();

  useEffect(() => {
    if (answerId) {
      fetchStudentAnswers(answerId);
    }
  }, [answerId]);

  const fetchStudentAnswers = async (id) => {
    try {
      setLoading(true);
      console.log('Fetching answers for ID:', id);
      const response = await axios.get(`https://e-learn-v1.runasp.net/api/Quize/StudentAnswers`, {
        params: {
          studentQuizAnswerId: id
        }
      });
      console.log('Response:', response.data);
      
      if (response.data.succeeded) {
        setAnswers(response.data.data);
        // Initialize grades object
        const initialGrades = {};
        response.data.data.que.forEach(question => {
          initialGrades[question.questionId] = false;
        });
        setGrades(initialGrades);
      } else {
        toast.error('Failed to fetch student answers');
      }
    } catch (error) {
      console.error('Error fetching student answers:', error);
      toast.error('Error fetching student answers');
    } finally {
      setLoading(false);
    }
  };

  const handleGradeChange = (questionId, isCorrect) => {
    setGrades(prev => ({
      ...prev,
      [questionId]: isCorrect
    }));
  };

  const handleSubmitGrades = async () => {
    try {
      setGrading(true);
      const gradesArray = Object.entries(grades).map(([answerId, isCorrect]) => ({
        answerId: parseInt(answerId),
        isCorrect
      }));

      console.log('Request Body:', gradesArray);

      const response = await axios.post('https://e-learn-v1.runasp.net/api/Quize/CorrectAnswer', gradesArray, {
        params: {
          quizeAnserId: answerId
        },
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      });

      console.log('API Response:', {
        status: response.status,
        data: response.data,
        message: response.data.massage,
        succeeded: response.data.succeeded
      });

      if (response.data.succeeded) {
        toast.success('Quiz has been graded successfully!', {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          style: {
            fontSize: '16px',
            padding: '16px',
            marginBottom: '20px'
          }
        });
        setTimeout(() => {
          window.history.back();
        }, 2000);
      } else {
        toast.error(response.data.massage || 'Failed to submit grades', {
          position: "bottom-center",
          theme: "colored"
        });
      }
    } catch (error) {
      console.error('Error submitting grades:', {
        message: error.message,
        response: error.response?.data
      });
      toast.error(error.response?.data?.massage || 'Error submitting grades', {
        position: "bottom-center",
        theme: "colored"
      });
    } finally {
      setGrading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header Section */}
          <div className="border-b border-gray-200 pb-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Answers Review</h1>
            <p className="text-gray-600">Review and grade student's quiz answers</p>
          </div>

          {/* Quiz Info Section */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Quiz Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Quiz Title</p>
                <p className="font-medium text-gray-800">{answers?.quizTitle}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Student Name</p>
                <p className="font-medium text-gray-800">{answers?.studentName}</p>
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="space-y-8">
            {answers?.que && answers.que.map((question, index) => (
              <div key={question.questionId} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Question {index + 1}
                    </h3>
                    <p className="text-gray-700 mb-4">{question.questionText}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      question.isCorrect === true 
                        ? 'bg-green-100 text-green-800' 
                        : question.isCorrect === false 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {question.isCorrect === true 
                        ? 'Correct' 
                        : question.isCorrect === false 
                        ? 'Incorrect'
                        : 'Not Graded'}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-2">Student's Answer:</p>
                  <p className="text-gray-800">{question.questionTextAnswer}</p>
                </div>

                {question.questionType === 1 && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-600 mb-2">Correct Answer:</p>
                    <p className="text-gray-800">{question.correctAnswerText}</p>
                  </div>
                )}

                <div className="flex items-center space-x-4 mt-4">
                  <button
                    onClick={() => handleGradeChange(question.questionId, true)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      grades[question.questionId] === true
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-green-50'
                    }`}
                  >
                    Mark Correct
                  </button>
                  <button
                    onClick={() => handleGradeChange(question.questionId, false)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      grades[question.questionId] === false
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-red-50'
                    }`}
                  >
                    Mark Incorrect
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Back to List
            </button>
            <button
              onClick={handleSubmitGrades}
              disabled={grading}
              className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                grading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {grading ? 'Submitting...' : 'Submit Grades'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAnswers; 