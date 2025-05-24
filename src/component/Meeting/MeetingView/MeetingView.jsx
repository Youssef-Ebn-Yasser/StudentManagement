//│   ├── MeetingView.jsx               // Orchestrates the display of meeting participants and controls
import { useMeeting } from '@videosdk.live/react-sdk'
import React, { useEffect } from 'react'

function MeetingView({meetingId , onMeetingLeave, role}) {
    const{
        join,             // Function to join the meeting
        leave,            // Function to leave the meeting
        toggleMic,        // Function to toggle microphone
        toggleWebcam,     // Function to toggle webcam
        participants,     // Map of all participants in the meeting
        // You can also get local participant's micOn, webcamOn status here if needed
        micOn, webcamOn,
    }= useMeeting({
        // Configuration options for the local participant when joining
        // These are default states, can be toggled by controls
        micEnabled: true,
        webcamEnabled: true,
        name: role === 'teacher' ? `Teacher ${role}` : `Student ${role}`, // Set initial display name
        // You can add more config like enable_recording, enable_streaming here if not set by token
    
          // --- Meeting Event Callbacks ---
            onParticipantJoined: (participant) => {
                console.log(`Participant ${participant.displayName} joined!`);
                toast.info(`${participant.displayName} joined the meeting.`, { autoClose: 3000 });
            },
            onParticipantLeft: (participant) => {
                console.log(`Participant ${participant.displayName} left!`);
                toast.warn(`${participant.displayName} left the meeting.`, { autoClose: 3000 });
            },
            onMeetingJoined: () => {
                console.log("Meeting Joined successfully!");
                toast.success("You have joined the meeting!", { autoClose: 2000 });
                // Automatically join mic and webcam after successful meeting join
                toggleMic();
                toggleWebcam();
            },
            onMeetingLeft: () => {
                console.log("Meeting Left.");
                toast.info("You have left the meeting.", { autoClose: 2000 });
                onMeetingLeave(); // Call parent's callback to reset meeting state
            },
            onError: (error) => {
                console.error("Meeting error:", error);
                toast.error(`Meeting error: ${error.message}`, { autoClose: 5000 });
            },
            // Add other callbacks as needed, e.g., onSpeakerChanged, onMicRequested, onWebcamRequested
            // For data messages / chat, we handled it directly in MeetingChat, but you could process here too
  
         });

        // Effect to automatically join the meeting when component mounts and meetingId is available

        useEffect(()=>{
            if(meetingId&&join){
                console.log(`Attempting to join meeting: ${meetingId}`);
                join();
            }
            // Clean up when component unmounts (e.g., if user navigates away)
            return () => {
                // You might want to leave the meeting automatically here if meetingId exists
                if (meetingId && leave) {
                leave();
                }
        };
        },[meetingId,join,leave])

        // Convert the participants Map to an array for easier rendering
        // The 'values()' method of Map returns an iterator, so we spread it into an array.
        const participantsArr = [...participants.values()];


    return <>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            gap: '20px',
            backgroundColor: '#f8f9fa',
            minHeight: '100vh',
            boxSizing: 'border-box'
            }}>
            <h2 style={{ color: '#343a40', margin: '0' }}>Active Meeting: <span style={{ color: '#007bff' }}>{meetingId}</span></h2>
            <p style={{ color: '#6c757d', fontSize: '1.1em' }}>Your Role: <strong style={{ textTransform: 'capitalize' }}>{role}</strong></p>

            {/* Display all participants */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '20px',
                width: '100%'
            }}>
                {participantsArr.length > 0 ? (
                participantsArr.map((participant) => (
                    <ParticipantView key={participant.id} participantId={participant.id} />
                ))
                ) : (
                <p style={{ color: '#6c757d', fontSize: '1.2em' }}>Waiting for participants to join...</p>
                )}
            </div>

            {/* Meeting Controls */}
            <MeetingControls role={role} /> {/* Pass the role down */}

            {/* Meeting Chat */}
            <MeetingChat />
            </div>
    </>
}

export default MeetingView
