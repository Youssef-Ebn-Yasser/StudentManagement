//│   └── meetingService.js             // Functions for interacting with your backend (e.g., createMeeting API call, getToken API call, saveChatMessage API call)

import axios from "axios";

// THIS MUST BE REPLACED BY SECURE TOKEN GENERATION FROM YOUR .NET BACKEND IN PRODUCTION.

const VIDEOSDK_BACKEND_BASE_URL="https://e-learn-v1.runasp.net"

export async function fetchAuthToken(){
    console.warn("WARNING: Using direct API key for token generation. This is INSECURE for production!");

    try{
        const response = await axios.post(`${VIDEOSDK_BACKEND_BASE_URL}/api/VideoSDK/generateVideoSDKToken`,{
            headers:{
                "Content-Type": "application/json"
            },
           
        })
        const data = response.data; 
        if(!data.token){
          throw new Error(data.error);

          }
        return data.token;
    }catch (error) {
      console.error("Error fetching authentication token from backend:", error);
      // --- FIX 3: Handle Axios errors in catch block ---
      // Check if it's an Axios error with a response from the server
      if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const errorMessage = error.response.data?.message || error.response.statusText || error.message;
          throw new Error(`Failed to fetch authentication token from backend: HTTP error! Status: ${error.response.status}, Message: ${errorMessage}`);
      } else if (error.request) {
          // The request was made but no response was received
          throw new Error(`Failed to fetch authentication token from backend: No response from server. Check network or backend status.`);
      } else {
          // Something else happened in setting up the request that triggered an Error
          throw new Error(`Failed to fetch authentication token from backend: ${error.message}`);
      }
    }
}

// * Creates a new meeting ID using the VideoSDK API directly (for development).

export async function createMeetingId(token) {
  console.log(token);
  
    try{
        const response = await axios.post(`https://api.videosdk.live/v2/rooms`,{},
          {
            headers: {
                authorization: `${token}` // Token goes in the Authorization header for VideoSDK's API
              },
            });
            const { roomId } = response.data;
            if (!roomId) {
              throw new Error("Meeting ID not found in response.");
          }
          return roomId;
              
        }
        catch (error) {
          console.error("Error creating meeting ID:", error);
          // --- FIX 2: Handle Axios errors in catch block ---
          if (error.response) {
              const errorMessage = error.response.data?.message || error.response.data?.error || error.response.statusText || error.message;
              throw new Error(`Failed to create meeting ID: HTTP error! Status: ${error.response.status}, Message: ${errorMessage}`);
          } else if (error.request) {
              throw new Error(`Failed to create meeting ID: No response from VideoSDK API. Check network or API status.`);
          } else {
              throw new Error(`Failed to create meeting ID: ${error.message}`);
          }
          }
}



// * (Optional) Simulates fetching active meetings from your e-learning platform's database.

export async function fetchActiveMeetings() {
    console.log("Simulating fetch of active meetings...");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 'math-lesson-1', topic: 'Algebra Basics', teacher: 'Mrs. Davis', description: 'Interactive session on algebraic equations.' },
          { id: 'science-lab-2', topic: 'Chemistry Experiments', teacher: 'Dr. Lee', description: 'Virtual lab on chemical reactions.' },
          // Add more dummy meetings for testing
        ]);
      }, 500); // Simulate network delay
    });
  }