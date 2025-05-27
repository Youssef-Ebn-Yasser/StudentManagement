import React, { useState } from 'react';
import VideoCall from '../VideoCall/VideoCall'; // Adjust path if needed

function MeetingRoom() {
  const [role, setRole] = useState(null); // 'teacher', 'student', or null
  const [meetingIdInput, setMeetingIdInput] = useState(''); // For student to enter
  const [activeMeetingId, setActiveMeetingId] = useState(null); // The ID of the active meeting (teacher's ID)

  // Callback for teacher to set the meeting ID
  const handleMeetingCreated = (id) => {
    setActiveMeetingId(id);
    alert(`Meeting Created! Share this ID with students: ${id}`);
    console.log(`Meeting Created with ID: ${id}`);
  };

  // Function to start the student's meeting
  const handleStudentJoin = () => {
    if (meetingIdInput.trim()) {
      setActiveMeetingId(meetingIdInput.trim());
    } else {
      alert('Please enter a Meeting ID to join.');
    }
  };

  // Function to reset the state and go back to role selection
  const resetMeeting = () => {
    setRole(null);
    setMeetingIdInput('');
    setActiveMeetingId(null);
  };

  if (!role) {
    // Role selection screen
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 font-inter">
        <h1 className="text-4xl font-bold mb-8 text-blue-400">Choose Your Role</h1>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setRole('teacher')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50"
          >
            I am a Teacher
          </button>
          <button
            onClick={() => setRole('student')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            I am a Student
          </button>
        </div>
      </div>
    );
  }

  if (role === 'teacher' && !activeMeetingId) {
    // Teacher view: Display ID and start meeting
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 font-inter">
        <h1 className="text-4xl font-bold mb-8 text-blue-400">Teacher: Create Meeting</h1>
        <p className="text-lg mb-4">Your Meeting ID will be generated once you start the call.</p>
        <button
          onClick={() => setActiveMeetingId('generate')} // Trigger VideoCall to generate ID
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
        >
          Start My Meeting
        </button>
        <button
          onClick={resetMeeting}
          className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
        >
          Back to Role Selection
        </button>
      </div>
    );
  }

  if (role === 'student' && !activeMeetingId) {
    // Student view: Enter meeting ID
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 font-inter">
        <h1 className="text-4xl font-bold mb-8 text-blue-400">Student: Join Meeting</h1>
        <div className="flex flex-col gap-4 w-full max-w-md">
          <input
            type="text"
            value={meetingIdInput}
            onChange={(e) => setMeetingIdInput(e.target.value)}
            placeholder="Enter Meeting ID"
            className="bg-gray-800 text-white rounded-md px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleStudentJoin}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
          >
            Join Meeting
          </button>
          <button
            onClick={resetMeeting}
            className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
          >
            Back to Role Selection
          </button>
        </div>
      </div>
    );
  }

  // Render VideoCall component once role and meeting ID are determined
  return (
    <VideoCall
      maxParticipants={10}
      role={role}
      initialPeerId={role === 'student' ? activeMeetingId : null} // Student joins this ID
      onMeetingCreated={handleMeetingCreated} // Teacher receives their generated ID
      onMeetingEnded={resetMeeting} // Callback to reset state when call ends
    />
  );
}

export default MeetingRoom;

// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

