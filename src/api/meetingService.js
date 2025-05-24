//│   └── meetingService.js             // Functions for interacting with your backend (e.g., createMeeting API call, getToken API call, saveChatMessage API call)

// THIS MUST BE REPLACED BY SECURE TOKEN GENERATION FROM YOUR .NET BACKEND IN PRODUCTION.

const VIDEOSDK_API_KEY='3660fb45-4076-4e25-b77e-ffd5a5674f76'

export async function fetchAuthToken(){
    console.warn("WARNING: Using direct API key for token generation. This is INSECURE for production!");

    try{
        const response = await fetch(`https://api.videosdk.live/v2/auth/token`,{
            method:'POST',
            headers:{
                "Content-Type": "application/json",
                "x-api-key":VIDEOSDK_API_KEY,
            },
            body: JSON.stringify({
                expiresIn:"10000m",// Token validity (e.g., 10000 minutes)
                permissions: ["allow_join", "allow_create_room", "allow_streaming", "allow_recording"],


            }),
           
        })
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, Message: ${errorData.message || response.statusText}`);
        }
        const data = await response.json();
        if (!data.token) {
          throw new Error("Token not found in response.");
        }
        return data.token;
    }catch (error) {
        console.error("Error fetching authentication token:", error);
        throw new Error(`Failed to fetch authentication token: ${error.message}`);
    }
}

// * Creates a new meeting ID using the VideoSDK API directly (for development).

export async function createMeetingId(token) {
    try{
        const response = await fetch(`https://api.videosdk.live/v2/rooms`,{
            method:"POST",
            headers: {
                authorization: `${token}`, // Token goes in the Authorization header for VideoSDK's API
                "Content-Type": "application/json",
              },
              body: JSON.stringify({}), // You can send an empty body or custom room properties here
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, Message: ${errorData.error || response.statusText}`);
            }
            const { roomId } = await response.json();
            if (!roomId) {
              throw new Error("Meeting ID not found in response.");
            }
            return roomId
              
        }
        catch (error) {
            console.error("Error creating meeting ID:", error);
            throw new Error(`Failed to create meeting ID: ${error.message}`);
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