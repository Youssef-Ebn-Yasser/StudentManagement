import React from "react";
import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";

const ParticipantView = ({ participantId }) => {
  const { webcamStream, micStream, displayName, isLocal } = useParticipant(participantId);

  return (
    <div>
      <h4>{displayName} {isLocal && "(You)"}</h4>
      <audio autoPlay ref={(ref) => { if (ref) ref.srcObject = micStream }} />
      {webcamStream && (
        <video
          autoPlay
          playsInline
          muted={isLocal}
          ref={(ref) => {
            if (ref) ref.srcObject = webcamStream;
          }}
        />
      )}
    </div>
  );
};

const MeetingView = () => {
  const { join, participants } = useMeeting();

  React.useEffect(() => {
    join();
  }, [join]);

  return (
    <div>
      <h2>Meeting Room</h2>
      {[...participants.keys()].map((participantId) => (
        <ParticipantView key={participantId} participantId={participantId} />
      ))}
    </div>
  );
};

export default MeetingView;
