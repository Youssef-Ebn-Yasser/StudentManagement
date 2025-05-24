//│   ├── MeetingControls.jsx
// Contains buttons for mic, webcam, leave, (teacher-specific: end, record)
// Step 5: Implement src/components/MeetingControls.jsx
// This component will house the interactive controls for the meeting, such as toggling the microphone, webcam, and leaving the meeting.
import { useMeeting } from '@videosdk.live/react-sdk'
import React from 'react'

function MeetingControls({ role }) {
    const {
        leave,           // Leaves the current meeting
        toggleMic,       // Toggles microphone on/off
        toggleWebcam,    // Toggles webcam on/off
        endMeeting,      // Ends the meeting for all participants (teacher only)
        // You can also get mic/webcam status here if you want to change button text/icon
        startRecording,     // <-- Added
        stopRecording,      // <-- Added
        toggleScreenShare,  // <-- Added
        isRecording,        // <-- Added (boolean: true if recording is active)
        localScreenShareOn, // <-- Added (boolean: true if the local user is screen sharing)
        micOn,              // Added for visual feedback
        webcamOn            // Added for visual feedback
        }= useMeeting()

    
    return <>

        <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#e9ecef',
            borderRadius: '10px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            justifyContent: 'center'
            }}>
            <button
                onClick={() => toggleMic()}
                style={{ padding: '10px 20px', fontSize: '1em', cursor: 'pointer', borderRadius: '5px', border: '1px solid #6c757d', backgroundColor: micOn ? '#28a745' : '#6c757d', color: 'white' }}
            >
                {micOn ? "Mic On" : "Mic Off"}
            </button>
            <button
                onClick={() => toggleWebcam()}
                style={{ padding: '10px 20px', fontSize: '1em', cursor: 'pointer', borderRadius: '5px', border: '1px solid #6c757d', backgroundColor: webcamOn ? '#28a745' : '#6c757d', color: 'white' }}
            >
                {webcamOn ? "Webcam On" : "Webcam Off"}
            </button>
            <button
                onClick={() => leave()}
                style={{ padding: '10px 20px', fontSize: '1em', cursor: 'pointer', borderRadius: '5px', border: '1px solid #dc3545', backgroundColor: '#dc3545', color: 'white' }}
            >
                Leave Meeting
            </button>

            {/* Screen Share Button */}
            {/* Any participant can initiate screen share by default */}
            <button
                onClick={() => toggleScreenShare()}
                style={{ padding: '10px 20px', fontSize: '1em', cursor: 'pointer', borderRadius: '5px', border: '1px solid #28a745', backgroundColor: localScreenShareOn ? '#ffc107' : '#28a745', color: 'white' }}
            >
                {localScreenShareOn ? "Stop Screen Share" : "Start Screen Share"}
            </button>


            {/* Recording Controls (Teacher-specific) */}
            {role === 'teacher' && (
                <>
                {isRecording ? (
                    <button
                    onClick={() => {
                        if (window.confirm("Are you sure you want to stop recording?")) {
                        stopRecording();
                        }
                    }}
                    style={{ padding: '10px 20px', fontSize: '1em', cursor: 'pointer', borderRadius: '5px', border: '1px solid #007bff', backgroundColor: '#dc3545', color: 'white' }}
                    >
                    Stop Recording
                    </button>
                ) : (
                    <button
                    onClick={() => {
                        if (window.confirm("Are you sure you want to start recording?")) {
                        startRecording();
                        }
                    }}
                    style={{ padding: '10px 20px', fontSize: '1em', cursor: 'pointer', borderRadius: '5px', border: '1px solid #007bff', backgroundColor: '#007bff', color: 'white' }}
                    >
                    Start Recording
                    </button>
                )}
                </>
            )}

            {/* Teacher-specific: End Meeting for All */}
            {role === 'teacher' && (
                <button
                onClick={() => {
                    if (window.confirm("Are you sure you want to end the meeting for all participants?")) {
                    endMeeting();
                    }
                }}
                style={{ padding: '10px 20px', fontSize: '1em', cursor: 'pointer', borderRadius: '5px', border: '1px solid #ffc107', backgroundColor: '#ffc107', color: 'black' }}
                >
                End Meeting for All
                </button>
            )}
        </div>

    </>
}

export default MeetingControls
