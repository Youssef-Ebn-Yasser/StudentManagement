import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function Quiz() {
  const { lessonId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  // Get studentId from localStorage or context
  const studentId = localStorage.getItem('studentId') || 0;

  // Key for localStorage to persist quiz submission
  const submissionKey = `quiz_submitted_${studentId}_${lessonId}`;

  useEffect(() => {
    // Check if quiz was already submitted
    const savedSubmission = localStorage.getItem(submissionKey);
    if (savedSubmission) {
      const parsed = JSON.parse(savedSubmission);
      setSubmitted(true);
      setSubmitResult(parsed.submitResult);
      setAnswers(parsed.answers || {});
    }
    const fetchQuiz = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(
          `https://e-learn-v1.runasp.net/api/Quize/GetQuizeByLessoinId?lessonId=${lessonId}`
        );
        if (Array.isArray(res.data) && res.data.length > 0) {
          setQuiz(res.data[0]);
        } else {
          setQuiz(null);
        }
      } catch (err) {
        setError('Failed to load quiz.');
        setQuiz(null);
      }
      setLoading(false);
    };
    fetchQuiz();
    // eslint-disable-next-line
  }, [lessonId]);

  const handleChange = (qIdx, value) => {
    setAnswers((prev) => ({
      ...prev,
      [qIdx]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quiz || !quiz.sendQuizeQuestions) return;
    setSubmitted(true);

    // Build answers array for API
    const answersArr = quiz.sendQuizeQuestions.map((q, idx) => ({
      questionText: q.questionText,
      questionTypeId: q.questionTypeId,
      studentAnswer: answers[idx] || null,
    }));

    try {
      const res = await axios.post(
        'https://e-learn-v1.runasp.net/api/Quize/SubmitAnswers',
        {
          studentId: Number(studentId),
          quizId: quiz.id,
          answers: answersArr,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setSubmitResult(res.data);
      // Save submission to localStorage
      localStorage.setItem(
        submissionKey,
        JSON.stringify({ submitResult: res.data, answers })
      );
    } catch (err) {
      setError('Failed to submit quiz.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">Quiz</h1>
      {loading ? (
        <div className="text-gray-500 text-center">Loading quiz...</div>
      ) : error ? (
        <div className="text-red-600 text-center">{error}</div>
      ) : !quiz ? (
        <div className="text-gray-500 text-center">No quiz found for this lesson.</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold mb-4 text-center">{quiz.title}</h2>
          <div className="mb-2 text-center text-gray-600">{quiz.description}</div>
          <div className="mb-4 text-center text-gray-500">
            Duration: {quiz.durationMinutes} minutes
          </div>
          {quiz.sendQuizeQuestions && quiz.sendQuizeQuestions.length > 0 ? (
            quiz.sendQuizeQuestions.map((q, idx) => (
              <div key={idx} className="question border rounded-lg p-4 mb-6 bg-gray-50">
                <h3 className="font-semibold mb-2">
                  Q{idx + 1}: {q.questionText}{' '}
                  <span className="text-sm text-gray-500">({q.points} pts)</span>
                </h3>
                {q.questionTypeId === 1 && q.options ? (
                  <div className="options ml-4 mb-2">
                    {Object.entries(q.options).map(([optionText], oIdx) => (
                      <label key={oIdx} className="block mb-1">
                        <input
                          type="radio"
                          name={`question-${idx}`}
                          value={optionText}
                          checked={answers[idx] === optionText}
                          onChange={() => handleChange(idx, optionText)}
                          disabled={submitted}
                          className="mr-2"
                          required
                        />
                        {optionText}
                      </label>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    className="border rounded p-2 w-full"
                    placeholder="Your answer"
                    value={answers[idx] || ''}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    disabled={submitted}
                    required
                  />
                )}
                {/* Show correct answer after submission */}
                {submitted && (
                  <div className="mt-2 text-green-700 font-semibold">
                    Correct Answer: {q.correctAnswer}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center">No questions found for this quiz.</div>
          )}
          <div className="text-center">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
              disabled={submitted}
            >
              {submitted ? 'Submitted' : 'Submit Quiz'}
            </button>
          </div>
          {submitted && submitResult && (
            <div className="mt-6 text-center text-lg text-indigo-700 font-semibold">
              {submitResult.grade !== undefined && (
                <div>Grade: {submitResult.grade}%</div>
              )}
              {submitResult.correctAnswers !== undefined && (
                <div>Correct Answers: {submitResult.correctAnswers}</div>
              )}
              {submitResult.isPassed !== undefined && (
                <div>
                  Status: {submitResult.isPassed ? 'Passed' : 'Not Passed'}
                </div>
              )}
            </div>
          )}
        </form>
      )}
    </div>
  );
}