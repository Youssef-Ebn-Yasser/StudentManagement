# Time Conversion Utility

This utility provides functions to convert UTC time to Egypt timezone for the student quiz system.

## Functions

### `convertToEgyptTime(utcTime, hour12 = false)`
Converts a UTC time string to Egypt timezone.

**Parameters:**
- `utcTime` (string): UTC time string (e.g., "2024-01-15T10:30:00")
- `hour12` (boolean): Whether to use 12-hour format (default: false for 24-hour)

**Returns:** Formatted Egypt time string

**Example:**
```javascript
import { convertToEgyptTime } from '../../utils/timeUtils';

// Convert UTC time to Egypt time
const egyptTime = convertToEgyptTime('2024-01-15T10:30:00');
// Output: "1/15/2024, 12:30:00 PM" (Egypt time)
```

### `formatEgyptTime(utcTime, options = {})`
Converts UTC time string to Egypt timezone with custom formatting options.

**Parameters:**
- `utcTime` (string): UTC time string
- `options` (object): Formatting options (optional)

**Returns:** Formatted Egypt time string

### `getCurrentEgyptTime(hour12 = false)`
Gets the current Egypt time.

**Parameters:**
- `hour12` (boolean): Whether to use 12-hour format

**Returns:** Current Egypt time string

## Usage in Components

The time conversion has been implemented in the following components:

1. **QuizView.jsx** - Shows quiz start and end times in Egypt timezone
2. **CourseDashDetailes.jsx** - Shows comment timestamps in Egypt timezone  
3. **CoursesDetails.jsx** - Shows comment timestamps in Egypt timezone

## Implementation Details

- Uses `toLocaleString("en-EG", { timeZone: "Africa/Cairo" })` for conversion
- Handles error cases gracefully by returning the original time if conversion fails
- Supports both 12-hour and 24-hour formats
- Automatically adds "Z" suffix to UTC time strings for proper parsing

## Testing

Run the test file in the browser console to verify the utility works correctly:

```javascript
// Import and run the test
import './timeUtils.test.js';
``` 