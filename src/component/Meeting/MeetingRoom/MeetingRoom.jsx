//│   ├── MeetingRoom.jsx               // Main entry point for the meeting feature
import React from 'react'
import useMeetingLogic from '../hooks/useMeetingLogic'
import MeetingView from '../MeetingView/MeetingView';
import { MeetingProvider } from '@videosdk.live/react-sdk';
import MeetingLobby from '../MeetingLobby/MeetingLobby';

function MeetingRoom() {

    const {token,
        meetingId,
        userName,
        setUserName,
        role,
        isLoadingToken,
        error,
        handleCreateMeeting,
        handleJoinMeeting,
        handleMeetingLeave}= useMeetingLogic()

          // --- Render Logic ---
            if(isLoadingToken){
                return (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      minHeight: 'calc(100vh - 40px)', // Adjust for padding
                      fontSize: '1.5em',
                      color: '#007bff'
                    }}>
                      Loading Meeting Services... Please wait.
                    </div>
                  );
            }

            if(error){
                return (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      minHeight: 'calc(100vh - 40px)',
                      fontSize: '1.2em',
                      color: '#dc3545',
                      textAlign: 'center',
                      padding: '20px'
                    }}>
                      <h2>Error Initializing Meeting</h2>
                      <p>{error}</p>
                      <p>Please check your internet connection or try refreshing the page.</p>
                      <p>For development, ensure your VideoSDK API Key is correctly placed in `src/api/meetingService.js`.</p>
                    </div>
                  );
            }
    return <>
            <div style={{ padding: '20px', textAlign: 'center' }}>
            {!meetingId ? (
                // If no meetingId, show the Lobby to create/join
                <MeetingLobby
                userName={userName}
                setUserName={setUserName}
                onJoinMeeting={handleJoinMeeting}
                onCreateMeeting={handleCreateMeeting}
                isLoadingToken={isLoadingToken} // Pass this down to disable inputs while loading
                />
            ) : (
                // If a meetingId is present, provide it to MeetingProvider and render MeetingView
                <MeetingProvider
                config={{
                    meetingId,
                    micEnabled: true,       // Initial state for mic
                    webcamEnabled: true,    // Initial state for webcam
                    name: userName,         // Display name for the local user
                }}
                token={token} // The authentication token
                // debug={true} // Uncomment for detailed logs from VideoSDK SDK
                >
                <MeetingView
                    meetingId={meetingId}
                    onMeetingLeave={handleMeetingLeave} // Callback to reset state when user leaves
                    role={role} // Pass the user's role to MeetingView
                />
                </MeetingProvider>
            )}
        </div>

    </>
}

export default MeetingRoom
