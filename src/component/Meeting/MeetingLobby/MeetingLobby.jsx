// src/components/MeetingLobby/MeetingLobby.jsx
import { fetchActiveMeetings } from '../../../api/meetingService'; // Ensure correct relative path to the NON-MOCKED service
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

function MeetingLobby({ userName, setUserName, onJoinMeeting, onCreateMeeting, isLoadingToken }) {
    const [activeMeetings, setActiveMeeting] = useState([]);
    const [joinMeetingIdInput, setJoinMeetingIdInput]= useState(''); // State for manual join ID

    useEffect(()=>{
        async function getActiveMeetings() {
            try{
                const meetings = await fetchActiveMeetings();
                setActiveMeeting(meetings);
            }catch(error){
                console.error("Failed to fetch active meetings:", error);
                toast.error("Failed to load active meetings.");
            }
        }
        getActiveMeetings();
    },[]); // Run once on component mount

    const handleCreateMeeting = ()=>{
        if (!userName.trim()) {
            toast.error("Please enter your name to create a meeting.");
            return;
        }
        onCreateMeeting('teacher'); // Indicate that this action is from a teacher
    };

    const handleJoinMeeting=(meetingId, role)=>{
        if(!userName.trim()){
            toast.error("Please enter your name to join a meeting.");
            return;
        }
        onJoinMeeting(meetingId, role);
    };

    return(
        <>
            <div style={{
                padding: '30px',
                textAlign: 'center',
                backgroundColor: '#e6eefc',
                borderRadius: '12px',
                maxWidth: '600px',
                margin: '50px auto',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                fontFamily: 'Inter, sans-serif'
            }}>
                <h2 style={{ color: '#0056b3', marginBottom: '25px' }}>Welcome to the E-Learning Meeting!</h2>

                <div style={{ marginBottom: '25px' }}>
                    <label htmlFor="userName" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                        Your Display Name:
                    </label>
                    <input
                        id="userName"
                        type="text"
                        placeholder="e.g., John Doe"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        disabled={isLoadingToken}
                        style={{
                            padding: '12px 15px',
                            fontSize: '1.1em',
                            borderRadius: '8px',
                            border: '1px solid #a0c2ff',
                            width: 'calc(100% - 30px)',
                            maxWidth: '300px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                {isLoadingToken ? (
                    <p style={{ color: '#007bff', fontSize: '1.2em' }}>Loading meeting token...</p>
                ) : (
                    <>
                        {/* Teacher Action */}
                        <div style={{ marginBottom: '30px', borderBottom: '1px dashed #a0c2ff', paddingBottom: '30px' }}>
                            <h3 style={{ color: '#007bff', marginBottom: '15px' }}>Teacher Actions</h3>
                            <button
                                onClick={handleCreateMeeting}
                                disabled={!userName.trim()}
                                style={{
                                    padding: '12px 25px',
                                    fontSize: '1.2em',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                }}
                            >
                                Create New Meeting
                            </button>
                        </div>

                        {/* Student Actions */}
                        <div style={{ marginBottom: '30px', borderBottom: '1px dashed #a0c2ff', paddingBottom: '30px' }}>
                            <h3 style={{ color: '#6c757d', marginBottom: '15px' }}>Student Actions</h3>
                            {activeMeetings.length > 0 ? (
                                <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                                    {activeMeetings.map((meeting) => (
                                        <li key={meeting.id} style={{
                                            marginBottom: '10px',
                                            display: 'flex',
                                            flexDirection: 'column', // Stack topic and button vertically
                                            alignItems: 'center',
                                            backgroundColor: '#f0f8ff',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: '1px solid #d0e0ff'
                                        }}>
                                            <p style={{ margin: '0 0 10px', fontWeight: 'bold', color: '#444' }}>
                                                {meeting.topic} <span style={{ fontSize: '0.9em', color: '#777' }}>by {meeting.teacher}</span>
                                            </p>
                                            <button
                                                onClick={() => handleJoinMeeting(meeting.id, 'student')}
                                                disabled={!userName.trim()}
                                                style={{
                                                    padding: '10px 20px',
                                                    fontSize: '1em',
                                                    cursor: 'pointer',
                                                    borderRadius: '5px',
                                                    border: 'none',
                                                    backgroundColor: '#007bff',
                                                    color: 'white'
                                                }}
                                            >
                                                Join Live Session
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p style={{ color: '#888' }}>No active meetings available right now.</p>
                            )}
                        </div>

                        {/* Manual Join by ID (useful for testing or specific invite scenarios) */}
                        <div>
                            <h3 style={{ color: '#6c757d', marginBottom: '15px' }}>Join Meeting by ID</h3>
                            <input
                                type="text"
                                placeholder="Enter Meeting ID"
                                value={joinMeetingIdInput}
                                onChange={(e) => setJoinMeetingIdInput(e.target.value)}
                                style={{
                                    padding: '12px 15px',
                                    fontSize: '1.1em',
                                    borderRadius: '8px',
                                    border: '1px solid #a0c2ff',
                                    width: 'calc(100% - 30px)',
                                    maxWidth: '250px',
                                    marginRight: '10px',
                                    boxSizing: 'border-box'
                                }}
                            />
                            <button
                                onClick={() => handleJoinMeeting(joinMeetingIdInput, 'student')}
                                disabled={!userName.trim() || !joinMeetingIdInput.trim()}
                                style={{
                                    padding: '12px 20px',
                                    fontSize: '1.1em',
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: '#17a2b8',
                                    color: 'white',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                }}
                            >
                                Join
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default MeetingLobby;