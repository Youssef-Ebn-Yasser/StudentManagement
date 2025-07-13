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