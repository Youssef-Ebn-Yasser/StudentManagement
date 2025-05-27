// src/hooks/useMeetingLogic.js
import { useState, useEffect, useCallback } from 'react';
import { createMeetingId, fetchAuthToken } from '../../../api/meetingService'; // Ensure correct relative path to the NON-MOCKED service

function useMeetingLogic(){
    const [token, setToken] = useState(null);
    const [meetingId, setMeetingId] = useState(null);
    const [userName, setUserName] = useState('');
    const [role, setRole] = useState(''); // 'teacher' or 'student'
    const [isLoadingToken, setIsLoadingToken] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        const getToken= async()=>{
            try{
                setIsLoadingToken(true);
                setError(null);
                const fetchedTokenResult = await fetchAuthToken(); // Call the actual function
                setToken(fetchedTokenResult); // Set the state with the result
            }catch(err){
                console.error("Error in useMeetingLogic fetching token:", err);
                setError(err.message || "Failed to fetch meeting token.");
            } finally {
                setIsLoadingToken(false);
            }
        };
        getToken();
    },[]); // Empty dependency array means this runs once on mount

    // Callback to handle creating a new meeting
    const handleCreateMeeting= useCallback(async(userRole)=>{
        if(!token || !userName.trim()){
            setError("Token not loaded or name is empty.");
            return null;
        }
        try{
            const newMeetingId = await createMeetingId(token); // Call the actual function
            setMeetingId(newMeetingId);
            setRole(userRole);
            setError(null); // Clear any previous errors
            return newMeetingId;
        }
        catch(err){
            console.error("Error creating meeting:", err);
            setError(err.message || "Failed to create meeting.");
            return null;
        }
    },[token, userName]); // Re-create if token or userName changes


    // Callback to handle joining an existing meeting
    const handleJoinMeeting= useCallback((idToJoin, userRole)=>{
        if (!userName.trim()) {
            setError("Please enter your name to join.");
            return;
        }
        setMeetingId(idToJoin);
        setRole(userRole);
        setError(null);
    },[userName]);


    // Callback to reset meeting state when leaving
    const handleMeetingLeave= useCallback(()=>{
        setMeetingId(null);
        setRole('');
        setError(null);
    },[]);

    return {
        token,
        meetingId,
        userName,
        setUserName,
        role,
        isLoadingToken,
        error,
        handleCreateMeeting,
        handleJoinMeeting,
        handleMeetingLeave,
    };
}

export default useMeetingLogic;