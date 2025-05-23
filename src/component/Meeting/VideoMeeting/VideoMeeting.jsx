import React, { useEffect, useState,useMemo, useRef } from "react";
import { MeetingProvider ,
  MeetingConsumer,
  useMeeting,
  useParticipant, } from "@videosdk.live/react-sdk";
import MeetingView from "../MeetingView/MeetingView";
import {authToken, createMeeting} from '@/API/API'
import ReactPlayer from "react-player";



const VideoMeeting = () => {
  const [meetingId, setMeetingId] = useState(null);

  const getMeetingAndToken = async (id) => {
    const meetingId =
      id == null ? await createMeeting({ token: authToken }) : id;
    setMeetingId(meetingId);
  };
   //This will set Meeting Id to null when meeting is left or ended
   const onMeetingLeave = () => {
    setMeetingId(null);
  };
  return authToken && meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: "C.V. Raman",
      }}
      token={authToken}
    >
      <MeetingView meetingId={meetingId} onMeetingLeave={onMeetingLeave} />
    </MeetingProvider>
  ) : (
    <JoinScreen getMeetingAndToken={getMeetingAndToken} />
  );
};

export default VideoMeeting;
