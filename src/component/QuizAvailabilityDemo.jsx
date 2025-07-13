import React, { useState } from 'react';
import { useQuizAvailability } from '../hooks/useQuizAvailability';
import { getQuizAvailabilityStatus, formatTimeRemaining } from '../utils/timeUtils';

const QuizAvailabilityDemo = () => {
  const [currentTime] = useState(new Date());
  
  // Demo quiz times (adjust these for testing)
  const demoQuizzes = [
    {
      id: 1,
      title: 'Quiz Available Now',
      startTime: new Date(currentTime.getTime() - 60 * 60 * 1000).toISOString(), // 1 hour ago
      endTime: new Date(currentTime.getTime() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
    },
    {
      id: 2,
      title: 'Quiz Starting Soon',
      startTime: new Date(currentTime.getTime() + 5 * 60 * 1000).toISOString(), // 5 minutes from now
      endTime: new Date(currentTime.getTime() + 65 * 60 * 1000).toISOString(), // 1 hour 5 minutes from now
    },
    {
      id: 3,
      title: 'Quiz Expired',
      startTime: new Date(currentTime.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      endTime: new Date(currentTime.getTime() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Quiz Availability System Demo</h1>
      <p className="text-gray-600 mb-8">
        This demo shows how the quiz availability system works with real-time updates.
        Current time: {currentTime.toLocaleString()}
      </p>

      <div className="grid gap-6">
        {demoQuizzes.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} />
        ))}
      </div>
    </div>
  );
};

const QuizCard = ({ quiz }) => {
  const availability = useQuizAvailability(quiz.startTime, quiz.endTime, 1000);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h3 className="text-xl font-semibold mb-4">{quiz.title}</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="font-medium">Start Time:</span>
          <br />
          <span className="text-gray-600">{new Date(quiz.startTime).toLocaleString()}</span>
        </div>
        <div>
          <span className="font-medium">End Time:</span>
          <br />
          <span className="text-gray-600">{new Date(quiz.endTime).toLocaleString()}</span>
        </div>
      </div>

      <div className="mb-4">
        <span className="font-medium">Status: </span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          availability.status === 'available' 
            ? 'bg-green-100 text-green-800' 
            : availability.status === 'not-started'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {availability.message}
        </span>
      </div>

      {availability.status === 'available' && availability.timeRemaining && (
        <div className="mb-4">
          <span className="font-medium">Time Remaining: </span>
          <span className="text-blue-600 font-mono">
            {formatTimeRemaining(availability.timeRemaining)}
          </span>
        </div>
      )}

      {availability.status === 'not-started' && availability.timeUntilStart && (
        <div className="mb-4">
          <span className="font-medium">Time Until Start: </span>
          <span className="text-orange-600 font-mono">
            {formatTimeRemaining(availability.timeUntilStart)}
          </span>
        </div>
      )}

      <div className="flex gap-2">
        {availability.status === 'available' ? (
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
            Take Quiz
          </button>
        ) : availability.status === 'not-started' ? (
          <button className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed" disabled>
            Not Started Yet
          </button>
        ) : (
          <button className="bg-red-400 text-white px-4 py-2 rounded cursor-not-allowed" disabled>
            Expired
          </button>
        )}
        
        <button 
          onClick={availability.refresh}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default QuizAvailabilityDemo; 