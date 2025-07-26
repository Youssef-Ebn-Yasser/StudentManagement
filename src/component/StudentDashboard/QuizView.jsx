import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizService } from '../../services/quizService';
import Loader from '../Loader/Loader';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { convertToEgyptTime, getQuizAvailabilityStatus } from '../../utils/timeUtils';
import { useQuizAvailability } from '../../hooks/useQuizAvailability';

const QuizView = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submittedQuizIds, setSubmittedQuizIds] = useState([]);
  const [quizResults, setQuizResults] = useState({});
  const [autoSubmitTimer, setAutoSubmitTimer] = useState(null);

  // Use the quiz availability hook for the selected quiz
  const selectedQuizAvailability = useQuizAvailability(
    selectedQuiz?.startsAt || selectedQuiz?.createdAt,
    selectedQuiz?.endAt,
    1000 // Update every second
  );

  useEffect(() => {
    fetchQuizzes();
  }, [lessonId]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoSubmitTimer) {
        clearTimeout(autoSubmitTimer);
      }
    };
  }, [autoSubmitTimer]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await quizService.getLessonQuizzes(lessonId);
      console.log('Quizzes response:', response); // Debug log
      if (response.succeeded) {
        setQuizzes(response.data || []);
      } else {
        throw new Error(response.messages?.[0] || 'Failed to load quizzes');
      }
    } catch (err) {
      setError(err.message || 'Failed to load quizzes');
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleQuizSelect = async (quiz) => {
    try {
      setLoading(true);
      console.log('Selected quiz:', quiz); // Debug log
      const response = await quizService.getQuizById(quiz.quizId);
      console.log('Quiz details response:', response); // Debug log
      console.log('Quiz ID from details response:', response.data?.quizId || response.data?.id); // NEW DEBUG LOG
      
      if (response.succeeded && response.data) {
        // Process quiz questions to add optionId for multiple choice questions
        const processedQuiz = {
          ...response.data,
          quizId: response.data.id || response.data.quizId, // Ensure quizId is correctly picked from response.data (prefer 'id' if available)
          sendQuizeQuestions: response.data.sendQuizeQuestions.map(q => {
            if (q.questionTypeId === 1 && q.options) {
              const optionsArray = Object.entries(q.options).map(([optionText, isCorrect], index) => ({
                optionId: index + 1, // Generate a simple sequential ID
                optionText: optionText,
                isCorrect: isCorrect
              }));
              return { ...q, options: optionsArray }; // Replace original options object with the array
            }
            return q;
          })
        };
        setSelectedQuiz(processedQuiz);
        setAnswers({});
        setSubmitted(false);
        
        // Set up auto-submit timer if quiz has end time
        if (processedQuiz.endAt) {
          const endTime = new Date(processedQuiz.endAt);
          const now = new Date();
          const timeUntilEnd = endTime - now;
          
          if (timeUntilEnd > 0) {
            const timer = setTimeout(() => {
              handleAutoSubmit();
            }, timeUntilEnd);
            setAutoSubmitTimer(timer);
          }
        }
      } else {
        throw new Error(response.messages?.[0] || 'Failed to load quiz details');
      }
    } catch (err) {
      toast.error('Failed to load quiz details');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      console.log('Selected quiz at handleSubmit:', selectedQuiz); // NEW DEBUG LOG
      const quizData = {
        studentId: parseInt(user.id) || 0,
        quizId: parseInt(selectedQuiz.id) || 0,
        answers: Object.entries(answers).map(([questionIndex, answer]) => {
          const question = selectedQuiz.sendQuizeQuestions[parseInt(questionIndex)];
          console.log('Processing question:', { question, answer }); // Debug log
          
          if (question.questionTypeId === 1) {
            const selectedOption = question.options.find(opt => opt.optionId === parseInt(answer));
            return {
              questionId: question.questionId,
              studentAnswerText: selectedOption?.optionText,
              selectedOptionIds: [parseInt(answer) || 0]
            };
          } else if (question.questionTypeId === 2 || question.questionTypeId === 3) { // Handle both 2 and 3 as short answer
            console.log('Processing short answer:', answer); // Debug log
          return {
              questionId: question.questionId,
              studentAnswerText: answer,
              selectedOptionIds: []
            };
          }
          return null;
        }).filter(answer => answer !== null)
      };
      console.log('Submitting quiz data:', quizData); // Debug log
      
      const response = await quizService.submitQuiz(quizData);
      if (response.succeeded) {
        setSubmitted(true);
        setSubmittedQuizIds(prev => [...prev, selectedQuiz.id]);
        setQuizResults(prev => ({ ...prev, [selectedQuiz.id]: response.data }));
        toast.success('Quiz submitted successfully!');
        
        // Clear auto-submit timer
        if (autoSubmitTimer) {
          clearTimeout(autoSubmitTimer);
          setAutoSubmitTimer(null);
        }
      } else {
        throw new Error(response.messages?.[0] || 'Failed to submit quiz');
      }
    } catch (err) {
      console.error('Error submitting quiz:', err);
      // Check if the error is due to the quiz already being submitted
      if (err.response?.data?.massage === 'Quiz already submitted' || err.message === 'Quiz already submitted') {
        setSubmitted(true);
        setSubmittedQuizIds(prev => [...prev, selectedQuiz.id]);
        setQuizResults(prev => ({ ...prev, [selectedQuiz.id]: err.response?.data || { succeeded: false, messages: ['Quiz already submitted'] } }));
        toast.success('This quiz has already been submitted.');
      } else {
        toast.error(err.message || 'Failed to submit quiz');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSubmit = async () => {
    if (submitted || !selectedQuiz) return;
    
    toast.info('Time is up! Auto-submitting quiz...');
    await handleSubmit();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {loading && <Loader visible={loading} />}
        <ContentWrapper $loading={loading}>
            <Loader />
        </ContentWrapper>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {!selectedQuiz ? (
        // Quiz List View
        <div>
          <h2 className="text-2xl font-bold mb-6">Available Quizzes</h2>
          {quizzes.length === 0 ? (
            <p className="text-gray-500">No quizzes available for this lesson.</p>
          ) : (
            <div className="grid gap-4">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.quizId}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleQuizSelect(quiz)}
                >
                  <h3 className="text-xl font-semibold mb-2">{quiz.quizName}</h3>
                  
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4 text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {quiz.totalQuestions || 0} questions
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {quiz.totalPoints || 0} points
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Starts: {convertToEgyptTime(quiz.createdAt)}
                      </span>
                    </div>
                    {/* Quiz availability status */}
                    {(() => {
                      const availability = getQuizAvailabilityStatus(quiz.startsAt || quiz.createdAt, quiz.endAt);
                      if (availability.status === 'expired') {
                        return <span className="text-red-500 font-semibold">Expired</span>;
                      } else if (availability.status === 'not-started') {
                        return <span className="text-yellow-500 font-semibold">Not Started</span>;
                      } else if (availability.status === 'available') {
                        return <span className="text-green-500 font-semibold">Available</span>;
                      }
                      return null;
                    })()}
                    {submittedQuizIds.includes(quiz.quizId) && (
                      <span className="text-blue-500 font-semibold">Submitted</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Quiz Taking View
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">{selectedQuiz.title}</h2>
              <p className="text-gray-600 mt-1">{selectedQuiz.description}</p>
              
              {/* Quiz Availability Status */}
              <div className="mt-3 p-3 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {selectedQuiz.durationMinutes} minutes
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {selectedQuiz.sendQuizeQuestions?.reduce((sum, q) => sum + q.points, 0) || 0} points
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Ends at: {convertToEgyptTime(selectedQuiz.endAt)}
                    </span>
                  </div>
                  
                  {/* Real-time status */}
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedQuizAvailability.status === 'available' 
                      ? 'bg-green-100 text-green-800' 
                      : selectedQuizAvailability.status === 'not-started'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedQuizAvailability.status === 'available' && (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {selectedQuizAvailability.formattedTimeRemaining}
                      </span>
                    )}
                    {selectedQuizAvailability.status === 'not-started' && (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        {selectedQuizAvailability.formattedTimeUntilStart}
                      </span>
                    )}
                    {selectedQuizAvailability.status === 'expired' && (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Expired
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedQuiz(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              Back to Quizzes
            </button>
          </div>

          {selectedQuizAvailability.status === 'expired' ? (
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-red-800 mb-4">Quiz Has Expired</h3>
              <p className="text-red-600">This quiz is no longer available for submission.</p>
            </div>
          ) : selectedQuizAvailability.status === 'not-started' ? (
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-yellow-800 mb-4">Quiz Not Started Yet</h3>
              <p className="text-yellow-600">This quiz will be available in {selectedQuizAvailability.formattedTimeUntilStart}</p>
            </div>
          ) : submittedQuizIds.includes(selectedQuiz.id) ? (
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">Quiz Results</h3>
              {quizResults[selectedQuiz.id] && (
                <div className="text-blue-600">
                  <p>Status: {quizResults[selectedQuiz.id].succeeded ? 'Submitted Successfully' : 'Submission Failed'}</p>
                  <p>Message: {quizResults[selectedQuiz.id].messages?.[0] || 'No detailed message'}</p>
                </div>
              )}
              <button
                onClick={() => setSelectedQuiz(null)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Quizzes
              </button>
            </div>
          ) : selectedQuizAvailability.status === 'available' ? (
            <div className="space-y-6">
              {/* Time warning */}
              {selectedQuizAvailability.timeRemaining && selectedQuizAvailability.timeRemaining < 5 * 60 * 1000 && (
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-orange-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-orange-800 font-medium">
                      Warning: Quiz will auto-submit in {selectedQuizAvailability.formattedTimeRemaining}
                    </span>
                  </div>
                </div>
              )}
              
              {selectedQuiz.sendQuizeQuestions?.map((question, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold">
                      Question {index + 1}: {question.questionText}
                    </h3>
                    <span className="text-sm text-gray-500">Points: {question.points}</span>
                  </div>
                  <div className="space-y-3">
                    {question.questionTypeId === 1 ? (
                      // Multiple choice questions
                      <div className="grid gap-3">
                        {question.options.map((option) => (
                          <label
                            key={option.optionId}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-200"
                          >
                            <input
                              type="radio"
                              name={`question-${index}`}
                              value={option.optionId}
                              checked={answers[index] === option.optionId}
                              onChange={() => handleAnswerChange(index, option.optionId)}
                              className="form-radio text-blue-600 h-4 w-4"
                            />
                            <span className="text-gray-700">{option.optionText}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      // Text input for other question types
                      <input
                        type="text"
                        value={answers[index] || ''}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        placeholder="Enter your answer"
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    )}
                  </div>
                </div>
              ))}

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Quiz'}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default QuizView; 