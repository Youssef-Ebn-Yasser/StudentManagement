//│   ├── ParticipantView.jsx           // Displays a single participant's video/audio and name
import { useParticipant } from '@videosdk.live/react-sdk'
import React, { useEffect, useRef } from 'react'

function ParticipantView({ participantId }) {

    //useParticipant--> provides all the real-time information about a specific participant
    //--> video stream, audio stream, whether their mic/webcam is on, their display name, and if they are the local user.
    const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName}= useParticipant(participantId)

    const videoPlayerRef= useRef()

    useEffect(()=>{
        if(webcamStream && videoPlayerRef.current){
            const mediaStream = new MediaStream()
            mediaStream.addTrack(webcamStream.track)
            videoPlayerRef.current.srcObject= mediaStream
            videoPlayerRef.current.play().catch(error=>{
                console.error("Error playing video:", error);
            })
        }
    },[webcamStream])

    useEffect(()=>{
        if(micStream && !isLocal){ // Only attach mic for remote participants
            const mediaStream = new MediaStream()
            mediaStream.addTrack(micStream.track)
            const audioElement= document.createElement('audio')
            audioElement.autoplay= true;
            audioElement.playsInline= true
            audioElement.srcObject= mediaStream

            // Clean up old audio element if stream changes
            return () => {
                audioElement.pause();
                audioElement.srcObject = null;
              };


        }
    },[micStream, isLocal])

    return <>
     <div
      key={participantId}
      style={{
        margin: '10px',
        border: isLocal ? '2px solid #007bff' : '1px solid gray', // Highlight local user
        borderRadius: '8px',
        overflow: 'hidden',
        padding: '5px',
        backgroundColor: '#f0f0f0',
        textAlign: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <p style={{ margin: '5px 0', fontWeight: 'bold' }}>
        {displayName} {isLocal ? "(You)" : ""}
      </p>
      <div style={{ position: 'relative', width: '240px', height: '180px', backgroundColor: 'black', borderRadius: '4px', overflow: 'hidden' }}>
        {webcamOn ? (
          <video
            ref={videoPlayerRef}
            autoPlay // Autoplay is handled by the useEffect for stream attachment
            playsInline
            muted={isLocal} // Mute your own audio to prevent echo/feedback
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            fontSize: '1.2em'
          }}>
            No Video
          </div>
        )}
        <div style={{
          position: 'absolute',
          bottom: '5px',
          right: '5px',
          backgroundColor: 'rgba(0,0,0,0.6)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '5px',
          fontSize: '0.8em'
        }}>
          Mic: {micOn ? "On" : "Off"}
        </div>
      </div>
    </div>
    </>
}

export default ParticipantView
