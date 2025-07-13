import { useState, useEffect, useCallback } from 'react';
import { 
  getQuizAvailabilityStatus, 
  formatTimeRemaining, 
  shouldCloseQuiz 
} from '../utils/timeUtils';

/**
 * Custom hook to manage quiz availability with real-time updates
 * @param {string} startTime - Quiz start time (UTC)
 * @param {string} endTime - Quiz end time (UTC)
 * @param {number} refreshInterval - Refresh interval in milliseconds (default: 1000ms)
 * @returns {object} Quiz availability state and functions
 */
export const useQuizAvailability = (startTime, endTime, refreshInterval = 1000) => {
  const [availability, setAvailability] = useState({
    isAvailable: false,
    status: 'loading',
    message: 'Loading...',
    timeRemaining: null,
    timeUntilStart: null
  });

  const [isActive, setIsActive] = useState(true);

  // Function to update availability status
  const updateAvailability = useCallback(() => {
    if (!startTime || !endTime) {
      setAvailability({
        isAvailable: false,
        status: 'no-times',
        message: 'Quiz times not set',
        timeRemaining: null,
        timeUntilStart: null
      });
      return;
    }

    const status = getQuizAvailabilityStatus(startTime, endTime);
    setAvailability(status);
  }, [startTime, endTime]);

  // Initial update
  useEffect(() => {
    updateAvailability();
  }, [updateAvailability]);

  // Set up real-time updates
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      updateAvailability();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [updateAvailability, refreshInterval, isActive]);

  // Auto-submit when time expires (if quiz is active)
  useEffect(() => {
    if (availability.status === 'expired' && availability.isActive) {
      // Trigger auto-submit callback if provided
      if (typeof onTimeExpired === 'function') {
        onTimeExpired();
      }
    }
  }, [availability.status]);

  // Pause updates when component is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsActive(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Manual refresh function
  const refresh = useCallback(() => {
    updateAvailability();
  }, [updateAvailability]);

  // Check if quiz should be closed
  const isExpired = shouldCloseQuiz(endTime);

  // Get formatted time remaining
  const formattedTimeRemaining = availability.timeRemaining 
    ? formatTimeRemaining(availability.timeRemaining)
    : null;

  // Get formatted time until start
  const formattedTimeUntilStart = availability.timeUntilStart
    ? formatTimeRemaining(availability.timeUntilStart)
    : null;

  return {
    ...availability,
    isExpired,
    formattedTimeRemaining,
    formattedTimeUntilStart,
    refresh,
    pause: () => setIsActive(false),
    resume: () => setIsActive(true)
  };
};

/**
 * Hook for managing multiple quizzes availability
 * @param {Array} quizzes - Array of quiz objects with startTime and endTime
 * @param {number} refreshInterval - Refresh interval in milliseconds
 * @returns {object} Multiple quizzes availability state
 */
export const useMultipleQuizzesAvailability = (quizzes = [], refreshInterval = 1000) => {
  const [quizzesStatus, setQuizzesStatus] = useState({});

  useEffect(() => {
    const updateAllQuizzes = () => {
      const newStatus = {};
      quizzes.forEach((quiz, index) => {
        if (quiz.startTime && quiz.endTime) {
          newStatus[index] = getQuizAvailabilityStatus(quiz.startTime, quiz.endTime);
        }
      });
      setQuizzesStatus(newStatus);
    };

    updateAllQuizzes();

    const interval = setInterval(updateAllQuizzes, refreshInterval);
    return () => clearInterval(interval);
  }, [quizzes, refreshInterval]);

  return quizzesStatus;
}; 