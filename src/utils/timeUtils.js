/**
 * Utility functions for time conversion to Egypt timezone
 */

/**
 * Converts UTC time string to Egypt timezone
 * @param {string} utcTime - UTC time string (e.g., "2024-01-15T10:30:00")
 * @param {boolean} hour12 - Whether to use 12-hour format (default: false for 24-hour)
 * @returns {string} Formatted Egypt time string
 */
export const convertToEgyptTime = (utcTime, hour12 = false) => {
  if (!utcTime) return '';
  
  try {
    const date = new Date(utcTime + "Z");
    const egyptTime = date.toLocaleString("en-EG", {
      timeZone: "Africa/Cairo",
      hour12: hour12
    });
    return egyptTime;
  } catch (error) {
    console.error('Error converting time to Egypt timezone:', error);
    return utcTime; // Return original if conversion fails
  }
};

/**
 * Converts UTC time string to Egypt timezone with custom format
 * @param {string} utcTime - UTC time string
 * @param {object} options - Formatting options
 * @returns {string} Formatted Egypt time string
 */
export const formatEgyptTime = (utcTime, options = {}) => {
  if (!utcTime) return '';
  
  const defaultOptions = {
    timeZone: "Africa/Cairo",
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  
  try {
    const date = new Date(utcTime + "Z");
    const egyptTime = date.toLocaleString("en-EG", { ...defaultOptions, ...options });
    return egyptTime;
  } catch (error) {
    console.error('Error formatting time to Egypt timezone:', error);
    return utcTime; // Return original if conversion fails
  }
};

/**
 * Gets current Egypt time
 * @param {boolean} hour12 - Whether to use 12-hour format
 * @returns {string} Current Egypt time string
 */
export const getCurrentEgyptTime = (hour12 = false) => {
  const now = new Date();
  return now.toLocaleString("en-EG", {
    timeZone: "Africa/Cairo",
    hour12: hour12
  });
};

/**
 * Gets current Egypt time as Date object
 * @returns {Date} Current Egypt time as Date object
 */
export const getCurrentEgyptDate = () => {
  const now = new Date();
  const egyptTime = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Cairo" }));
  return egyptTime;
};

/**
 * Converts UTC time string to Egypt Date object
 * @param {string} utcTime - UTC time string
 * @returns {Date} Egypt time as Date object
 */
export const convertToEgyptDate = (utcTime) => {
  if (!utcTime) return null;
  
  try {
    const date = new Date(utcTime + "Z");
    const egyptTime = new Date(date.toLocaleString("en-US", { timeZone: "Africa/Cairo" }));
    return egyptTime;
  } catch (error) {
    console.error('Error converting time to Egypt Date:', error);
    return null;
  }
};

/**
 * Checks if a quiz is currently available (between start and end time)
 * @param {string} startTime - Quiz start time (UTC)
 * @param {string} endTime - Quiz end time (UTC)
 * @returns {object} Quiz availability status
 */
export const getQuizAvailabilityStatus = (startTime, endTime) => {
  if (!startTime || !endTime) {
    return {
      isAvailable: false,
      status: 'no-times',
      message: 'Quiz times not set'
    };
  }

  const now = getCurrentEgyptDate();
  const start = convertToEgyptDate(startTime);
  const end = convertToEgyptDate(endTime);

  if (!start || !end) {
    return {
      isAvailable: false,
      status: 'invalid-times',
      message: 'Invalid quiz times'
    };
  }

  if (now < start) {
    const timeUntilStart = start - now;
    const hours = Math.floor(timeUntilStart / (1000 * 60 * 60));
    const minutes = Math.floor((timeUntilStart % (1000 * 60 * 60)) / (1000 * 60));
    
    return {
      isAvailable: false,
      status: 'not-started',
      message: `Quiz starts in ${hours}h ${minutes}m`,
      timeUntilStart: timeUntilStart
    };
  }

  if (now > end) {
    return {
      isAvailable: false,
      status: 'expired',
      message: 'Quiz has expired'
    };
  }

  const timeRemaining = end - now;
  const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

  return {
    isAvailable: true,
    status: 'available',
    message: `Quiz available - ${hours}h ${minutes}m remaining`,
    timeRemaining: timeRemaining
  };
};

/**
 * Formats time remaining in a human-readable format
 * @param {number} milliseconds - Time in milliseconds
 * @returns {string} Formatted time string
 */
export const formatTimeRemaining = (milliseconds) => {
  if (milliseconds <= 0) return 'Time expired';
  
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

/**
 * Checks if a quiz should be automatically closed
 * @param {string} endTime - Quiz end time (UTC)
 * @returns {boolean} True if quiz should be closed
 */
export const shouldCloseQuiz = (endTime) => {
  if (!endTime) return false;
  
  const now = getCurrentEgyptDate();
  const end = convertToEgyptDate(endTime);
  
  if (!end) return false;
  
  return now > end;
}; 