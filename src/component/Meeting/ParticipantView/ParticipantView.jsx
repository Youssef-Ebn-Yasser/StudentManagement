// src/components/ParticipantView/ParticipantView.jsx
import { useParticipant } from '@videosdk.live/react-sdk'; // Import ACTUAL useParticipant hook
import React, { useEffect, useRef } from 'react'; // Removed useState, useCallback as they are not used in this component's local logic

function ParticipantView({ participantId }) {
    // Destructure participant properties from useParticipant hook
    const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } = useParticipant(participantId);

    const videoPlayerRef = useRef();
    const audioPlayerRef = useRef(); // Ref for the audio element

    // Effect to handle webcam stream
    useEffect(() => {

      console.log(`[${displayName}] Webcam Stream Status:`);
      console.log(`  webcamOn: ${webcamOn}`);
      console.log(`  webcamStream:`, webcamStream);
      console.log(`  webcamStream.track:`, webcamStream?.track);

        if (webcamStream && webcamStream.track && videoPlayerRef.current) {
          console.log(`[${displayName}] Attempting to display webcam stream.`);


            const mediaStream = new MediaStream();
            mediaStream.addTrack(webcamStream.track);
            videoPlayerRef.current.srcObject = mediaStream;
            videoPlayerRef.current.play().catch(error => {
                console.error(`[${displayName}] Error playing video:`, error);
                if (error.name === 'NotAllowedError') {
                  console.warn(`[${displayName}] User denied camera access or autoplay is blocked.`);
                } else if (error.name === 'AbortError') {
                  console.warn(`[${displayName}] Autoplay prevented or media removed.`);
                } else {
                  console.warn(`[${displayName}] Unexpected video playback error:`, error.message);
                }
            });
        } else if (videoPlayerRef.current) {
            console.log(`[${displayName}] Clearing video srcObject (webcamStream or track not available).`);
            videoPlayerRef.current.srcObject = null;
        }
    }, [webcamStream, webcamOn, displayName]);

    // Effect to handle mic stream (for remote participants)
    useEffect(() => {
        // Only play remote audio if mic is on and it's not the local participant
        if (micOn && !isLocal && micStream && micStream.track) {
            // Create a new audio element if it doesn't exist in the ref
            if (!audioPlayerRef.current) {
                audioPlayerRef.current = document.createElement('audio');
                audioPlayerRef.current.style.display = 'none'; // Keep it hidden
                document.body.appendChild(audioPlayerRef.current); // Append to body
            }

            audioPlayerRef.current.autoplay = true;
            audioPlayerRef.current.playsInline = true;
            const micMediaStream = new MediaStream();
            micMediaStream.addTrack(micStream.track);
            audioPlayerRef.current.srcObject = micMediaStream;

            audioPlayerRef.current.play().catch(error => {
                console.error("Error playing audio for", displayName, ":", error);
                if (error.name === 'NotAllowedError') {
                    console.warn("User denied microphone access or autoplay is blocked for audio.");
                } else if (error.name === 'AbortError') {
                    console.warn("Autoplay of audio was prevented or media was removed from the document.");
                } else {
                    console.warn("An unexpected error occurred during audio playback:", error.message);
                }
            });
        } else if (audioPlayerRef.current) {
            // If mic turns off or stream becomes null, pause and clear the audio
            audioPlayerRef.current.pause();
            audioPlayerRef.current.srcObject = null;
            // Remove the audio element from the DOM on cleanup if you added it dynamically
            if (audioPlayerRef.current.parentNode) {
                audioPlayerRef.current.parentNode.removeChild(audioPlayerRef.current);
            }
            audioPlayerRef.current = null;
        }
        return () => {
            if (audioPlayerRef.current) {
                audioPlayerRef.current.pause();
                audioPlayerRef.current.srcObject = null;
                if (audioPlayerRef.current.parentNode) {
                    audioPlayerRef.current.parentNode.removeChild(audioPlayerRef.current);
                }
                audioPlayerRef.current = null;
            }
        };
    }, [micStream, isLocal, micOn, displayName]);

    return (
        <>
            <div
                key={participantId}
                style={{
                    margin: '10px',
                    border: isLocal ? '3px solid #1a73e8' : '1px solid #dadce0', // Blue border for local, subtle gray for others
                    borderRadius: '12px', // More rounded corners
                    overflow: 'hidden',
                    padding: '8px', // Increased padding
                    backgroundColor: '#ffffff', // White background
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', // More prominent shadow
                    width: '280px', // Fixed width for consistency
                    height: '250px', // Fixed height
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between', // Space out content
                    fontFamily: 'Inter, sans-serif'
                }}
            >
                <p style={{ margin: '5px 0 10px', fontWeight: '600', color: '#202124', fontSize: '1.1em' }}>
                    {displayName} {isLocal ? "(You)" : ""}
                </p>
                <div style={{
                    position: 'relative',
                    width: '100%',
                    flexGrow: 1, // Allow video container to take available space
                    backgroundColor: 'black',
                    borderRadius: '8px', // Rounded video corners
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {webcamOn && webcamStream ? (
                        <video
                            ref={videoPlayerRef}
                            autoPlay
                            playsInline
                            muted={isLocal} // Mute your own audio to prevent echo/feedback
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: 'white',
                            fontSize: '1.3em',
                            backgroundColor: '#3c4043' // Darker background for no video
                        }}>
                            No Video
                        </div>
                    )}
                    <div style={{
                        position: 'absolute',
                        bottom: '8px',
                        right: '8px',
                        backgroundColor: 'rgba(0,0,0,0.7)', // Darker overlay
                        color: 'white',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '0.9em',
                        fontWeight: '500'
                    }}>
                        Mic: {micOn ? "On" : "Off"}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ParticipantView;