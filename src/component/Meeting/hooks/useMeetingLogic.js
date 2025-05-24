import { useState, useEffect, useCallback } from 'react';
import { createMeetingId, fetchAuthToken } from '@/api/meetingService';

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
                setIsLoadingToken(true)
                setError(null)
                const fetchedTokenResult = await fetchAuthToken() // Call the imported function
                setToken(fetchedTokenResult) // Set the state with the result

            }catch(error){
                console.error("Error in useMeetingLogic fetching token:", error);
                setError(error.message || "Failed to fetch meeting token.");
            } finally {
                setIsLoadingToken(false);
            }
        }
        getToken()

    },[])

      // Callback to handle creating a new meeting
    const handleCreateMeeting= useCallback(async(userRole)=>{
        if(!token || !userName.trim()){
            setError("Token not loaded or name is empty.");
            return;
        }
        try{
            const newMeetingId = await createMeetingId(token)
            setMeetingId(newMeetingId)
            setRole(userRole)
            setError(null)// Clear any previous errors
            return newMeetingId;
        }
        catch(error){
            console.error("Error creating meeting:", error);
      setError(error.message || "Failed to create meeting.");
      return null;
        }
    },[token, userName]) // Re-create if token or userName changes


      // Callback to handle joining an existing meeting
    const handleJoinMeeting= useCallback((idToJoin, userRole)=>{
        if (!userName.trim()) {
            setError("Please enter your name to join.");
            return;
          }
          setMeetingId(idToJoin)
          setRole(userRole)
          setError(null)

    },[userName])


      // Callback to reset meeting state when leaving
    const handleMeetingLeave= useCallback(()=>{
        setMeetingId(null)
        setRole('')
            // Do NOT reset userName here, user might want to join another meeting with same name
        setError(null)
    },[])

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

export default useMeetingLogic