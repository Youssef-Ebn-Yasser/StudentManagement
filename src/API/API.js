import axios from "axios";

const authToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIxZDY4MmI3MC02OGM1LTQxMjktYWEwZS1kNWM5NzRiMzc3NzgiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTc0ODAxNTAzNywiZXhwIjoxNzQ4NjE5ODM3fQ.7wmaVUh5utCbOXBQvK824wEepZMEHU9JwnjK4GeGKh0"

// API call to create a meeting

export const createMeeting = async ({ token }) => {
    const res = await  fetch("https://api.videosdk.live/v2/rooms", {
      method: "POST",
      headers: {
        authorization: `${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }); 
    //Destructuring the roomId from the response
    const { roomId } = await res.json();
    return roomId;
  };
  export default authToken;
