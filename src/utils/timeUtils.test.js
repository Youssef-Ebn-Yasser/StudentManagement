/**
 * Simple test for time conversion utility
 * This can be run in the browser console to verify the function works
 */

import { convertToEgyptTime, formatEgyptTime, getCurrentEgyptTime } from './timeUtils';

// Test cases
const testCases = [
  {
    input: '2024-01-15T10:30:00',
    description: 'Basic UTC time'
  },
  {
    input: '2024-12-25T15:45:30',
    description: 'Christmas time'
  },
  {
    input: '2024-06-15T08:00:00',
    description: 'Summer time'
  }
];

console.log('Testing Egypt time conversion utility...');

testCases.forEach((testCase, index) => {
  console.log(`\nTest ${index + 1}: ${testCase.description}`);
  console.log(`Input: ${testCase.input}`);
  console.log(`Output: ${convertToEgyptTime(testCase.input)}`);
  console.log(`Formatted: ${formatEgyptTime(testCase.input)}`);
});

console.log(`\nCurrent Egypt time: ${getCurrentEgyptTime()}`);
console.log(`Current Egypt time (12-hour): ${getCurrentEgyptTime(true)}`);

// Test error handling
console.log('\nTesting error handling:');
console.log(`Null input: ${convertToEgyptTime(null)}`);
console.log(`Empty string: ${convertToEgyptTime('')}`);
console.log(`Invalid date: ${convertToEgyptTime('invalid-date')}`);

console.log('\nTime conversion utility test completed!'); 