import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizService } from '../../services/quizService';
import Loader from '../Loader/Loader';
import { FaCheck, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { t } from 'i18next';

const QuizView = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, [lessonId]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await quizService.getLessonQuizzes(lessonId);
      setQuizzes(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load quizzes');
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleQuizSelect = async (quizId) => {
    try {
      setLoading(true);
      const response = await quizService.getQuizById(quizId);
      setSelectedQuiz(response.data);
      setAnswers({});
      setSubmitted(false);
    } catch (err) {
      toast.error('Failed to load quiz details');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const quizData = {
        quizId: selectedQuiz.id,
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId: parseInt(questionId),
          answer
        }))
      };
      
      await quizService.submitQuiz(quizData);
      setSubmitted(true);
      toast.success('Quiz submitted successfully!');
    } catch (err) {
      toast.error('Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
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
          <h2 className="text-2xl font-bold mb-6">{t("available-quizzes")}</h2>
          {quizzes.length === 0 ? (
            <p className="text-gray-500">{t("no-quizzes-available")}</p>
          ) : (
            <div className="grid gap-4">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleQuizSelect(quiz.id)}
                >
                  <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
                  <p className="text-gray-600">{quiz.description}</p>
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <span className="mr-4">{t("questions")}: {quiz.totalQuestions}</span>
                    <span>{t("time")}: {quiz.duration} {t('minutes')}</span>
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
            <h2 className="text-2xl font-bold">{selectedQuiz.title}</h2>
            <button
              onClick={() => setSelectedQuiz(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              {t("back-to-quizzes")}
            </button>
          </div>

          {submitted ? (
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-800 mb-4">{t("quiz-submitted")}</h3>
              <p className="text-green-600">{t("answers-recorded")}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {selectedQuiz.questions?.map((question, index) => (
                <div key={question.id} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-4">
                    {t("question")} {index + 1}: {question.text}
                  </h3>
                  <div className="space-y-3">
                    {question.options?.map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option.id}
                          checked={answers[question.id] === option.id}
                          onChange={() => handleAnswerChange(question.id, option.id)}
                          className="form-radio text-blue-600"
                        />
                        <span>{option.text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? `${t("submitting")}...` : `${t("submit-quiz")}`}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizView; 