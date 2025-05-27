import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateQuiz() {
  const navigate = useNavigate();
  const [lessonId, setLessonId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        questionTypeId: 1,
        points: '',
        correctAnswer: '',
        options: [{ key: '', value: false }, { key: '', value: false }],
      },
    ]);
  };

  const handleQuestionChange = (idx, field, value) => {
    const updated = [...questions];
    updated[idx][field] = value;
    // Reset options if type changes to Text
    if (field === 'questionTypeId' && value === 2) {
      updated[idx].options = [];
    }
    if (field === 'questionTypeId' && value === 1 && updated[idx].options.length === 0) {
      updated[idx].options = [{ key: '', value: false }, { key: '', value: false }];
    }
    setQuestions(updated);
  };

  const handleOptionChange = (qIdx, oIdx, field, value) => {
    const updated = [...questions];
    updated[qIdx].options[oIdx][field] = value;
    setQuestions(updated);
  };

  const addOption = (qIdx) => {
    const updated = [...questions];
    updated[qIdx].options.push({ key: '', value: false });
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const questionListDtos = questions.map((q) => {
      let options = null;
      if (q.questionTypeId === 1) {
        options = {};
        q.options.forEach((opt) => {
          if (opt.key) options[opt.key] = opt.value;
        });
      }
      return {
        questionText: q.questionText,
        questionTypeId: Number(q.questionTypeId),
        points: Number(q.points),
        correctAnswer: q.correctAnswer,
        options,
      };
    });

    const quizDto = {
      lessonId: Number(lessonId),
      title,
      description,
      startsAt,
      durationMinutes: Number(durationMinutes),
      questionListDtos,
    };

    try {
      const res = await fetch('https://e-learn-v1.runasp.net/api/Quize/Create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizDto),
      });
      if (!res.ok) throw new Error('Failed to submit quiz');
      await res.text(); // <-- Use text() instead of json()
      alert('Quiz created successfully!');
      // Optionally reset form here
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow mt-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/teacher/profile')}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Profile
        </button>
        <h2 className="text-2xl font-bold">Create a Quiz</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <label className="block mt-2">Lesson ID</label>
        <input
          type="number"
          className="border rounded p-2 w-full"
          value={lessonId}
          onChange={(e) => setLessonId(e.target.value)}
          required
        />

        <label className="block mt-2">Title</label>
        <input
          type="text"
          className="border rounded p-2 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label className="block mt-2">Description</label>
        <textarea
          className="border rounded p-2 w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label className="block mt-2">Start Time</label>
        <input
          type="datetime-local"
          className="border rounded p-2 w-full"
          value={startsAt}
          onChange={(e) => setStartsAt(e.target.value)}
          required
        />

        <label className="block mt-2">Duration (minutes)</label>
        <input
          type="number"
          className="border rounded p-2 w-full"
          value={durationMinutes}
          onChange={(e) => setDurationMinutes(e.target.value)}
          required
        />

        <h3 className="text-lg font-semibold mt-6 mb-2">Questions</h3>
        {questions.map((q, idx) => (
          <div key={idx} className="p-4 border rounded mb-4 bg-gray-50">
            <label>Question Text</label>
            <textarea
              className="border rounded p-2 w-full"
              value={q.questionText}
              onChange={(e) => handleQuestionChange(idx, 'questionText', e.target.value)}
              required
            />

            <label>Question Type</label>
            <select
              className="border rounded p-2 w-full"
              value={q.questionTypeId}
              onChange={(e) => handleQuestionChange(idx, 'questionTypeId', Number(e.target.value))}
            >
              <option value={1}>MCQ</option>
              <option value={2}>Text</option>
            </select>

            <label>Points</label>
            <input
              type="number"
              className="border rounded p-2 w-full"
              value={q.points}
              onChange={(e) => handleQuestionChange(idx, 'points', e.target.value)}
              required
            />

            <label>Correct Answer</label>
            <input
              type="text"
              className="border rounded p-2 w-full"
              value={q.correctAnswer}
              onChange={(e) => handleQuestionChange(idx, 'correctAnswer', e.target.value)}
              required
            />

            {q.questionTypeId === 1 && (
              <div className="mt-2">
                <label>Options</label>
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className="flex gap-2 mt-1">
                    <input
                      type="text"
                      className="border rounded p-2 flex-1"
                      placeholder="Option text"
                      value={opt.key}
                      onChange={(e) => handleOptionChange(idx, oIdx, 'key', e.target.value)}
                      required
                    />
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={opt.value}
                        onChange={(e) => handleOptionChange(idx, oIdx, 'value', e.target.checked)}
                      />
                      Is Correct
                    </label>
                  </div>
                ))}
                <button
                  type="button"
                  className="mt-2 px-3 py-1 bg-blue-100 rounded text-blue-700"
                  onClick={() => addOption(idx)}
                >
                  Add Option
                </button>
              </div>
            )}
          </div>
        ))}
        <button
          type="button"
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
          onClick={addQuestion}
        >
          ➕ Add Question
        </button>

        <hr className="my-6" />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded text-lg"
        >
          📤 Submit Quiz
        </button>
      </form>
    </div>
  );
}