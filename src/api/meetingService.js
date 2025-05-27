// src/api/meetingService.js
import axios from "axios";

// IMPORTANT: Replace with your actual VideoSDK backend URL or API endpoint
// This URL should point to your server-side logic that generates VideoSDK tokens.
const VIDEOSDK_BACKEND_BASE_URL = "https://e-learn-v1.runasp.net"; // Replace with your actual backend URL

/**
 * Fetches an authentication token from your backend for VideoSDK.
 * In a production environment, this should be a secure server-side endpoint.
 */
export async function fetchAuthToken() {
    console.warn("WARNING: In production, ensure this token generation is secure and not directly exposed client-side.");

    try {
        const response = await axios.post(`${VIDEOSDK_BACKEND_BASE_URL}/api/VideoSDK/generateVideoSDKToken`, {}, {
            headers: {
                "Content-Type": "application/json"
            },
        });
        const data = response.data;
        if (!data.token) {
            throw new Error(data.error || "Token not found in response.");
        }
        return data.token;
    } catch (error) {
        console.error("Error fetching authentication token from backend:", error);
        if (error.response) {
            const errorMessage = error.response.data?.message || error.response.data?.error || error.response.statusText || error.message;
            throw new Error(`Failed to fetch authentication token: HTTP error! Status: ${error.response.status}, Message: ${errorMessage}`);
        } else if (error.request) {
            throw new Error(`Failed to fetch authentication token: No response from server. Check network or backend status.`);
        } else {
            throw new Error(`Failed to fetch authentication token: ${error.message}`);
        }
    }
}


export async function createMeetingId(token) {
    console.log("Requesting new meeting ID with token:", token ? "Token Present" : "Token MISSING");
    if (!token) {
        throw new Error("Authentication token is required to create a meeting ID.");
    }

    try {
        const response = await axios.post(`https://api.videosdk.live/v2/rooms`, {}, {
            headers: {
                authorization: `${token}`,
                "Content-Type": "application/json"
            },
        });
        const { roomId } = response.data;
        if (!roomId) {
            throw new Error("Meeting ID not found in response.");
        }
        return roomId;
    } catch (error) {
        console.error("Error creating meeting ID:", error);
        if (error.response) {
            const errorMessage = error.response.data?.message || error.response.data?.error || error.response.statusText || error.message;
            console.error("VideoSDK API Error Details:", error.response.data);
            throw new Error(`Failed to create meeting ID: HTTP error! Status: ${error.response.status}, Message: ${errorMessage}`);
        } else if (error.request) {
            throw new Error(`Failed to create meeting ID: No response from VideoSDK API. Check network or API status.`);
        } else {
            throw new Error(`Failed to create meeting ID: ${error.message}`);
        }
    }
}

/**
 * (Optional) Simulates fetching active meetings from your e-learning platform's database.
 * In a real application, this would fetch from your actual database.
 */
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