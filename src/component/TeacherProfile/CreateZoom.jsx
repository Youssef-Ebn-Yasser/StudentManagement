import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

const API_BASE_URL = 'https://e-learn-v1.runasp.net/api/zoom';

function CreateZoom() {
  // Get courseId from route param or query string
  const { courseId: paramCourseId } = useParams();
  const location = useLocation();
  const queryCourseId = new URLSearchParams(location.search).get('courseId');
  const courseId = paramCourseId || queryCourseId || 27; // fallback to 27 for demo

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Meeting creation form state
  const [formData, setFormData] = useState({
    topic: 'My Awesome Meeting',
    duration: 30,
    meetingType: '1', // 1: Instant, 2: Scheduled, 8: Recurring
    startTime: '',
    enablePassword: false,
    password: '',
    muteParticipants: false,
    enableAutoRecording: false,
    recordingLocation: 'cloud',
    recurrenceType: '1', // 1: Daily, 2: Weekly, 3: Monthly
    repeatInterval: 1,
    endCondition: 'endTimes',
    endTimes: 5,
    endDate: '',
    weeklyDays: [],
    monthlyRepeatBy: 'dayOfMonth',
    monthlyDay: 1,
    monthlyWeek: 1,
    monthlyWeekDay: 1
  });

  // UI state
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [createdMeeting, setCreatedMeeting] = useState(null);
  const [savedMeetings, setSavedMeetings] = useState([]);

  // Helper functions
  const showMessage = (msg) => {
    setMessage(msg);
    setError('');
  };

  const showError = (err) => {
    setError(err);
    setMessage('');
  };

  const hideMessages = () => {
    setMessage('');
    setError('');
  };

  const getDayName = (dayNum) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNum - 1]; // Zoom uses 1-7 for Sun-Sat
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle radio button changes
  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle checkbox group changes (weekly days)
  const handleWeeklyDayChange = (dayValue) => {
    setFormData(prev => {
      const newWeeklyDays = prev.weeklyDays.includes(dayValue)
        ? prev.weeklyDays.filter(day => day !== dayValue)
        : [...prev.weeklyDays, dayValue];
      return { ...prev, weeklyDays: newWeeklyDays };
    });
  };

  // Connect to Zoom
  const connectWithZoom = () => {
    window.location.href = `${API_BASE_URL}/authorize`;
  };

  // Create meeting
  const createMeeting = async (e) => {
    e.preventDefault();
    hideMessages();
    setCreatedMeeting(null);

    if (!isAuthenticated) {
      showError('Please connect with Zoom first.');
      return;
    }

    // Prepare payload with correct types and only required fields
    const payload = {
      topic: formData.topic,
      type: Number(formData.meetingType),
      courseId: Number(courseId),
      muteParticipantsUponEntry: !!formData.muteParticipants,
    };

    // Scheduled or recurring meetings require startTime and duration
    if (payload.type === 2 || payload.type === 8) {
      if (!formData.startTime) {
        showError('Start time is required for scheduled or recurring meetings.');
        return;
      }
      payload.startTime = new Date(formData.startTime).toISOString();
      payload.duration = Number(formData.duration);
    }

    // Password
    if (formData.enablePassword && formData.password) {
      payload.password = formData.password;
    }

    // Auto recording
    if (formData.enableAutoRecording && formData.recordingLocation) {
      payload.autoRecording = formData.recordingLocation;
    }

    // Recurrence for recurring meetings
    if (payload.type === 8) {
      const recurrence = {
        type: Number(formData.recurrenceType),
        repeatInterval: Number(formData.repeatInterval),
        endTimes: formData.endCondition === 'endTimes' ? Number(formData.endTimes) : undefined,
        endDate: formData.endCondition === 'endDate' ? formData.endDate : undefined,
        weeklyDays: formData.recurrenceType === '2'
          ? formData.weeklyDays.map(Number)
          : undefined,
        monthlyDay: formData.recurrenceType === '3' && formData.monthlyRepeatBy === 'dayOfMonth'
          ? Number(formData.monthlyDay)
          : undefined,
        monthlyWeek: formData.recurrenceType === '3' && formData.monthlyRepeatBy === 'weekOfMonth'
          ? Number(formData.monthlyWeek)
          : undefined,
        monthlyWeekDay: formData.recurrenceType === '3' && formData.monthlyRepeatBy === 'weekOfMonth'
          ? Number(formData.monthlyWeekDay)
          : undefined,
      };
      // Remove undefined fields
      Object.keys(recurrence).forEach(key => recurrence[key] === undefined && delete recurrence[key]);
      payload.recurrence = recurrence;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/create-meeting`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.succeeded) {
        throw new Error(data.error || data.message || data.massage || 'Failed to create meeting');
      }

      setCreatedMeeting(data.data || data);
      showMessage('Meeting created successfully!');
      fetchSavedMeetings();

    } catch (err) {
      console.error('Error creating meeting:', err);
      showError(err.message || 'An unexpected error occurred.');
    }
  };

  // Fetch saved meetings
  const fetchSavedMeetings = async () => {
    try {
      const url = courseId
        ? `${API_BASE_URL}/meetings?courseId=${courseId}`
        : `${API_BASE_URL}/meetings`;
      const response = await fetch(url);
      const result = await response.json();
      if (result.succeeded && Array.isArray(result.data)) {
        setSavedMeetings(result.data);
      } else if (Array.isArray(result)) {
        setSavedMeetings(result);
      } else {
        setSavedMeetings([]);
      }
    } catch (err) {
      console.error('Failed to fetch saved meetings:', err);
      showError('Failed to load saved meetings.');
    }
  };

  // Check authentication status on component mount and handle OAuth callback
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/check-auth`);
        const data = await response.json();
        setIsAuthenticated(data.succeeded ? data.data === true : !!data.is_authenticated);

        // Handle the redirect after Zoom authorization
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        if (code) {
          // Call backend callback
          await fetch(`${API_BASE_URL}/callback?code=${code}`);
          setIsAuthenticated(true);
          showMessage('Successfully connected with Zoom!');
          // Remove code param from URL
          window.history.replaceState({}, document.title, window.location.pathname + window.location.search.replace(/(\?|&)code=[^&]+/, ''));
        }
      } catch (err) {
        console.error('Failed to check auth status:', err);
        showError('Could not connect to backend to check Zoom auth status.');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
    fetchSavedMeetings();
    // eslint-disable-next-line
  }, [courseId]);

  if (isLoading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-8">
          Zoom Meeting Integrator
        </h1>

        <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200 flex items-center justify-between">
          <span className="text-lg font-semibold text-indigo-800">
            Zoom Status: {isAuthenticated ? 'Connected' : 'Not Connected'}
          </span>
          {!isAuthenticated && (
            <button
              onClick={connectWithZoom}
              className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-full shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Connect with Zoom
            </button>
          )}
        </div>

        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md border border-green-200">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={createMeeting} className="space-y-6">
          <h2 className="text-2xl font-bold text-indigo-600 mb-4">Create New Meeting</h2>

          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
              Meeting Topic
            </label>
            <input
              type="text"
              id="topic"
              name="topic"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.topic}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.duration}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Type</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-indigo-600"
                  name="meetingType"
                  value="1"
                  checked={formData.meetingType === '1'}
                  onChange={handleRadioChange}
                />
                <span className="ml-2 text-gray-800">Instant Meeting</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-indigo-600"
                  name="meetingType"
                  value="2"
                  checked={formData.meetingType === '2'}
                  onChange={handleRadioChange}
                />
                <span className="ml-2 text-gray-800">Scheduled Meeting</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-indigo-600"
                  name="meetingType"
                  value="8"
                  checked={formData.meetingType === '8'}
                  onChange={handleRadioChange}
                />
                <span className="ml-2 text-gray-800">Recurring Meeting (Fixed Time)</span>
              </label>
            </div>
          </div>

          {(formData.meetingType === '2' || formData.meetingType === '8') && (
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                id="startTime"
                name="startTime"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.startTime}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          {formData.meetingType === '8' && (
            <div className="p-4 border border-indigo-300 rounded-md bg-indigo-50 space-y-4">
              <h3 className="text-lg font-semibold text-indigo-700">Recurrence Details</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recurrence Type</label>
                <select
                  id="recurrenceType"
                  name="recurrenceType"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.recurrenceType}
                  onChange={handleInputChange}
                >
                  <option value="1">Daily</option>
                  <option value="2">Weekly</option>
                  <option value="3">Monthly</option>
                </select>
              </div>

              <div>
                <label htmlFor="repeatInterval" className="block text-sm font-medium text-gray-700 mb-1">
                  Repeat Interval
                </label>
                <input
                  type="number"
                  id="repeatInterval"
                  name="repeatInterval"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.repeatInterval}
                  onChange={handleInputChange}
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Condition</label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-indigo-600"
                      name="endCondition"
                      value="endTimes"
                      checked={formData.endCondition === 'endTimes'}
                      onChange={handleRadioChange}
                    />
                    <span className="ml-2 text-gray-800">After</span>
                    <input
                      type="number"
                      id="endTimes"
                      name="endTimes"
                      className="ml-2 p-2 border border-gray-300 rounded-md w-20"
                      value={formData.endTimes}
                      onChange={handleInputChange}
                      min="1"
                      disabled={formData.endCondition !== 'endTimes'}
                    />
                    <span className="ml-2 text-gray-800">occurrences</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-indigo-600"
                      name="endCondition"
                      value="endDate"
                      checked={formData.endCondition === 'endDate'}
                      onChange={handleRadioChange}
                    />
                    <span className="ml-2 text-gray-800">On date</span>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      className="ml-2 p-2 border border-gray-300 rounded-md"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      disabled={formData.endCondition !== 'endDate'}
                    />
                  </label>
                </div>
              </div>

              {formData.recurrenceType === '2' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Repeat On</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7].map(day => (
                      <label key={day} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox text-indigo-600"
                          checked={formData.weeklyDays.includes(day.toString())}
                          onChange={() => handleWeeklyDayChange(day.toString())}
                        />
                        <span className="ml-2 text-gray-800">{getDayName(day)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {formData.recurrenceType === '3' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Repeat By</label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-indigo-600"
                        name="monthlyRepeatBy"
                        value="dayOfMonth"
                        checked={formData.monthlyRepeatBy === 'dayOfMonth'}
                        onChange={handleRadioChange}
                      />
                      <span className="ml-2 text-gray-800">Day of month</span>
                      <input
                        type="number"
                        id="monthlyDay"
                        name="monthlyDay"
                        className="ml-2 p-2 border border-gray-300 rounded-md w-20"
                        value={formData.monthlyDay}
                        onChange={handleInputChange}
                        min="1"
                        max="31"
                        disabled={formData.monthlyRepeatBy !== 'dayOfMonth'}
                      />
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-indigo-600"
                        name="monthlyRepeatBy"
                        value="weekOfMonth"
                        checked={formData.monthlyRepeatBy === 'weekOfMonth'}
                        onChange={handleRadioChange}
                      />
                      <span className="ml-2 text-gray-800">Week of month</span>
                      <select
                        id="monthlyWeek"
                        name="monthlyWeek"
                        className="ml-2 p-2 border border-gray-300 rounded-md"
                        value={formData.monthlyWeek}
                        onChange={handleInputChange}
                        disabled={formData.monthlyRepeatBy !== 'weekOfMonth'}
                      >
                        <option value="1">First</option>
                        <option value="2">Second</option>
                        <option value="3">Third</option>
                        <option value="4">Fourth</option>
                        <option value="5">Last</option>
                      </select>
                      <select
                        id="monthlyWeekDay"
                        name="monthlyWeekDay"
                        className="ml-2 p-2 border border-gray-300 rounded-md"
                        value={formData.monthlyWeekDay}
                        onChange={handleInputChange}
                        disabled={formData.monthlyRepeatBy !== 'weekOfMonth'}
                      >
                        <option value="1">Sunday</option>
                        <option value="2">Monday</option>
                        <option value="3">Tuesday</option>
                        <option value="4">Wednesday</option>
                        <option value="5">Thursday</option>
                        <option value="6">Friday</option>
                        <option value="7">Saturday</option>
                      </select>
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="p-4 border border-gray-300 rounded-md bg-gray-50 space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Meeting Options</h3>

            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  id="enablePassword"
                  name="enablePassword"
                  className="form-checkbox text-indigo-600"
                  checked={formData.enablePassword}
                  onChange={handleInputChange}
                />
                <span className="ml-2 text-gray-800">Require Meeting Password</span>
              </label>
              {formData.enablePassword && (
                <input
                  type="text"
                  id="password"
                  name="password"
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              )}
            </div>

            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  id="muteParticipants"
                  name="muteParticipants"
                  className="form-checkbox text-indigo-600"
                  checked={formData.muteParticipants}
                  onChange={handleInputChange}
                />
                <span className="ml-2 text-gray-800">Mute Participants Upon Entry</span>
              </label>
            </div>

            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  id="enableAutoRecording"
                  name="enableAutoRecording"
                  className="form-checkbox text-indigo-600"
                  checked={formData.enableAutoRecording}
                  onChange={handleInputChange}
                />
                <span className="ml-2 text-gray-800">Enable Auto Recording</span>
              </label>
              {formData.enableAutoRecording && (
                <div className="flex space-x-4 mt-2 ml-6">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-indigo-600"
                      name="recordingLocation"
                      value="local"
                      checked={formData.recordingLocation === 'local'}
                      onChange={handleRadioChange}
                    />
                    <span className="ml-2 text-gray-800">Local Computer</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-indigo-600"
                      name="recordingLocation"
                      value="cloud"
                      checked={formData.recordingLocation === 'cloud'}
                      onChange={handleRadioChange}
                    />
                    <span className="ml-2 text-gray-800">Zoom Cloud</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-green-600 text-white font-bold rounded-full shadow-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isAuthenticated}
          >
            Create Zoom Meeting
          </button>
        </form>

        {createdMeeting && (
          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Meeting Created!</h2>
            <p className="text-lg mb-2"><span className="font-semibold">Topic:</span> {createdMeeting.topic || createdMeeting.Topic}</p>
            <p className="text-lg mb-2"><span className="font-semibold">Meeting ID:</span> {createdMeeting.meetingId || createdMeeting.MeetingId}</p>
            {(createdMeeting.password || createdMeeting.Password) && (
              <p className="text-lg mb-2"><span className="font-semibold">Password:</span> {createdMeeting.password || createdMeeting.Password}</p>
            )}
            {(createdMeeting.startTime || createdMeeting.StartTime) && (
              <p className="text-lg mb-2"><span className="font-semibold">Start Time:</span> {createdMeeting.startTime || createdMeeting.StartTime}</p>
            )}
            <p className="text-lg mb-2"><span className="font-semibold">Duration:</span> {createdMeeting.duration || createdMeeting.Duration} minutes</p>
            <p className="text-lg mb-2"><span className="font-semibold">Type:</span>
              {(createdMeeting.type || createdMeeting.Type) === 1 ? 'Instant' :
                (createdMeeting.type || createdMeeting.Type) === 2 ? 'Scheduled' : 'Recurring'}
            </p>
            {(createdMeeting.isRecurring || createdMeeting.IsRecurring) && (createdMeeting.daysThatRepeat || createdMeeting.DaysThatRepeat) && (
              <p className="text-lg mb-2">
                <span className="font-semibold">Recurrence:</span>
                {createdMeeting.daysThatRepeat || createdMeeting.DaysThatRepeat}
                {(createdMeeting.occurrences || createdMeeting.Occurrences) ? ` (${createdMeeting.occurrences || createdMeeting.Occurrences} occurrences)` : ''}
              </p>
            )}
            <p className="text-lg mb-2">
              <span className="font-semibold">Mute Participants:</span>
              {(createdMeeting.muteParticipantsUponEntry || createdMeeting.MuteParticipantsUponEntry) ? 'Yes' : 'No'}
            </p>
            <p className="text-lg mb-2">
              <span className="font-semibold">Auto Recording:</span>
              {(createdMeeting.autoRecording || createdMeeting.AutoRecording)
                ? (createdMeeting.autoRecording || createdMeeting.AutoRecording).charAt(0).toUpperCase() +
                  (createdMeeting.autoRecording || createdMeeting.AutoRecording).slice(1)
                : 'No'}
            </p>
            <div className="mt-4">
              <a
                href={createdMeeting.joinUrl || createdMeeting.JoinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-bold rounded-full shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Join Meeting
              </a>
            </div>
          </div>
        )}

        {savedMeetings.length > 0 && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Your Saved Meetings</h2>
            <div className="space-y-4">
              {savedMeetings.map(meeting => (
                <div key={meeting.zoomMeetingId || meeting.meetingId} className="p-4 border border-gray-300 rounded-md bg-white shadow-sm">
                  <p className="text-lg font-semibold">{meeting.topic}</p>
                  <p className="text-sm text-gray-600">ID: {meeting.zoomMeetingId || meeting.meetingId}</p>
                  {meeting.password && <p className="text-sm text-gray-600">Password: {meeting.password}</p>}
                  {meeting.startTime && (
                    <p className="text-sm text-gray-600">
                      Start: {new Date(meeting.startTime).toLocaleString()}
                    </p>
                  )}
                  {meeting.type === 8 && meeting.daysThatRepeat && (
                    <p className="text-sm text-gray-600">
                      Recurrence: {meeting.daysThatRepeat}
                      {meeting.occurrences ? ` (${meeting.occurrences} occurrences)` : ''}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    Mute Participants: {meeting.muteParticipantsUponEntry ? 'Yes' : 'No'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Auto Recording: {meeting.autoRecording
                      ? meeting.autoRecording.charAt(0).toUpperCase() + meeting.autoRecording.slice(1)
                      : 'No'}
                  </p>
                  <div className="mt-2">
                    <a
                      href={meeting.joinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline text-sm"
                    >
                      Join Meeting
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

export default CreateZoom;