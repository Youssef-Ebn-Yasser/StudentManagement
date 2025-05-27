// src/components/MeetingControls/MeetingControls.jsx
import React from 'react';
// No need to import useMeeting here, all necessary props are passed from MeetingView
// import { useMeeting } from '@videosdk.live/react-sdk'; // No longer imported, as props are passed

function MeetingControls({ role, toggleMic, toggleWebcam, leave, micOn, webcamOn, endMeeting, startRecording, stopRecording, toggleScreenShare, isRecording, localScreenShareOn }) {
    // All functions (toggleMic, toggleWebcam, leave, etc.) are received as props
    // from MeetingView, which gets them from the actual useMeeting hook.
    // No need to call useMeeting() directly in this component.

    const handleStartRecording = () => {
        console.log("Attempting to start recording.");
        startRecording();
    };

    const handleStopRecording = () => {
        console.log("Attempting to stop recording.");
        stopRecording();
    };

    const handleEndMeeting = () => {
        console.log("Attempting to end meeting for all.");
        endMeeting();
    };

    return (
        <>
            <div style={{
                marginTop: '20px',
                padding: '15px',
                backgroundColor: '#e9ecef',
                borderRadius: '10px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                justifyContent: 'center',
                fontFamily: 'Inter, sans-serif'
            }}>
                <button
                    onClick={toggleMic}
                    style={{
                        backgroundColor: micOn ? '#28a745' : '#6c757d', // Green for on, gray for off
                        color: 'white',
                        padding: '10px 15px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '500',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                        transition: 'background-color 0.3s ease'
                    }}
                >
                    Mic {micOn ? 'On' : 'Off'}
                </button>
                <button
                    onClick={toggleWebcam}
                    style={{
                        backgroundColor: webcamOn ? '#28a745' : '#6c757d', // Green for on, gray for off
                        color: 'white',
                        padding: '10px 15px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '500',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                        transition: 'background-color 0.3s ease'
                    }}
                >
                    Webcam {webcamOn ? 'On' : 'Off'}
                </button>
                <button
                    onClick={leave}
                    style={{
                        backgroundColor: '#dc3545', // Red for leave
                        color: 'white',
                        padding: '10px 15px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '500',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                        transition: 'background-color 0.3s ease'
                    }}
                >
                    Leave Meeting
                </button>

                {/* Screen Share Button */}
                <button
                    onClick={toggleScreenShare}
                    style={{
                        padding: '10px 20px',
                        fontSize: '1em',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: localScreenShareOn ? '#ffc107' : '#007bff', // Orange when sharing, blue otherwise
                        color: localScreenShareOn ? '#343a40' : 'white',
                        fontWeight: '500',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                        transition: 'background-color 0.3s ease'
                    }}
                >
                    {localScreenShareOn ? "Stop Screen Share" : "Start Screen Share"}
                </button>

                {/* Recording Controls (Teacher-specific) */}
                {role === 'teacher' && (
                    <>
                        {isRecording ? (
                            <button
                                onClick={handleStopRecording}
                                style={{
                                    padding: '10px 20px',
                                    fontSize: '1em',
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: '#dc3545', // Red for stop recording
                                    color: 'white',
                                    fontWeight: '500',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                    transition: 'background-color 0.3s ease'
                                }}
                            >
                                Stop Recording
                            </button>
                        ) : (
                            <button
                                onClick={handleStartRecording}
                                style={{
                                    padding: '10px 20px',
                                    fontSize: '1em',
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: '#007bff', // Blue for start recording
                                    color: 'white',
                                    fontWeight: '500',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                    transition: 'background-color 0.3s ease'
                                }}
                            >
                                Start Recording
                            </button>
                        )}
                    </>
                )}

                {/* Teacher-specific: End Meeting for All */}
                {role === 'teacher' && (
                    <button
                        onClick={handleEndMeeting}
                        style={{
                            padding: '10px 20px',
                            fontSize: '1em',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#ffc107', // Orange for end meeting
                            color: '#343a40',
                            fontWeight: '500',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                            transition: 'background-color 0.3s ease'
                        }}
                    >
                        End Meeting for All
                    </button>
                )}
            </div>
        </>
    );
}

export default MeetingControls;