import React, { useRef, useEffect, useState, useCallback } from 'react';



// Public STUN servers for NAT traversal. For production, consider TURN servers for more robust connectivity.

const configuration = {

  iceServers: [

    { urls: 'stun:stun.l.google.com:19302' },

    { urls: 'stun:stun1.l.google.com:19302' },

    { urls: 'stun:stun2.l.google.com:19302' },

    // For production, consider adding a TURN server (e.g., from Xirsys, Twilio, Coturn)

    // { urls: 'turn:your_turn_server_url:port', username: 'your_username', credential: 'your_password' }

  ],

};



// IMPORTANT: Ensure this URL matches the port your Node.js signaling server is running on.

const SIGNALING_SERVER_URL = 'ws://localhost:8080';



const VideoCall = ({ role, initialPeerId, onMeetingCreated, onMeetingEnded }) => {

  const localVideoRef = useRef(null);

  const remoteVideoRef = useRef(null);

  const peerConnectionRef = useRef(null);

  const socketRef = useRef(null); // Ref for the WebSocket instance



  // States

  const [localStream, setLocalStream] = useState(null);

  const [remoteStream, setRemoteStream] = useState(null);

  const [isCalling, setIsCalling] = useState(false);

  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const [isVideoMuted, setIsVideoMuted] = useState(false);

  const [userId, setUserId] = useState('');

  const [peerId, setPeerId] = useState(initialPeerId || '');

  const [wsConnected, setWsConnected] = useState(false);

  const [peerConnected, setPeerConnected] = useState(false);

  const [mediaAccessDenied, setMediaAccessDenied] = useState(false);

  const [connectionStatus, setConnectionStatus] = useState("Initializing...");



  // Refs to hold the latest state values for stable access within closures

  // These refs are crucial for functions inside useEffect that don't re-run often

  const currentUserIdRef = useRef(userId);

  const currentPeerIdRef = useRef(peerId);

  const localStreamRef = useRef(localStream);

  const isCallingRef = useRef(isCalling); // Added ref for isCalling

  const roleRef = useRef(role); // Added ref for role

  const initialPeerIdRef = useRef(initialPeerId); // Added ref for initialPeerId



  // Update refs whenever their corresponding states/props change

  useEffect(() => { currentUserIdRef.current = userId; }, [userId]);

  useEffect(() => { currentPeerIdRef.current = peerId; }, [peerId]);

  useEffect(() => { localStreamRef.current = localStream; }, [localStream]);

  useEffect(() => { isCallingRef.current = isCalling; }, [isCalling]);

  useEffect(() => { roleRef.current = role; }, [role]);

  useEffect(() => { initialPeerIdRef.current = initialPeerId; }, [initialPeerId]);





  // Function to end the call (cleans up WebRTC, not WebSocket) - now fully stable

  const endCall = useCallback(() => {

    console.log("Attempting to end call and clean up WebRTC resources.");

    if (peerConnectionRef.current) {

      peerConnectionRef.current.close();

      peerConnectionRef.current = null;

      console.log("RTCPeerConnection closed.");

    }

    if (remoteStream) {

      remoteStream.getTracks().forEach(track => track.stop());

      setRemoteStream(null);

      console.log("Remote stream tracks stopped.");

    }

    setIsCalling(false);

    setPeerConnected(false);

    setRemoteStream(null); // Clear remote stream explicitly

    console.log('Call ended successfully.');

    setConnectionStatus("Call ended. Ready for new call.");

    if (onMeetingEnded) {

      onMeetingEnded(); // Notify parent component (App.jsx) that meeting ended

    }

  }, [remoteStream, onMeetingEnded, setIsCalling, setPeerConnected, setRemoteStream, setConnectionStatus]);





  // Function to initialize RTCPeerConnection - now fully stable

  const initializePeerConnection = useCallback(() => {

    if (peerConnectionRef.current) {

      console.log("Closing existing peer connection before creating a new one.");

      peerConnectionRef.current.close();

      peerConnectionRef.current = null;

    }



    peerConnectionRef.current = new RTCPeerConnection(configuration);

    console.log("RTCPeerConnection created.");



    if (localStreamRef.current) { // Use ref for localStream

      localStreamRef.current.getTracks().forEach(track => {

        peerConnectionRef.current.addTrack(track, localStreamRef.current);

        console.log(`Added local track: ${track.kind}`);

      });

    } else {

        console.warn("Local stream not available when initializing PeerConnection. Check media access.");

    }





    peerConnectionRef.current.onicecandidate = (event) => {

      if (event.candidate) {

        // Use refs for latest userId and peerId when sending

        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {

          socketRef.current.send(JSON.stringify({

            type: 'ice-candidate',

            candidate: event.candidate,

            targetId: currentPeerIdRef.current, // Use ref

            senderId: currentUserIdRef.current // Use ref

          }));

        } else {

          console.warn('WebSocket not connected or closed, cannot send ICE candidate.');

        }

      } else {

        console.log('ICE candidate gathering complete.');

      }

    };



    peerConnectionRef.current.ontrack = (event) => {

      console.log('Remote track received:', event.streams[0]);

      setRemoteStream(event.streams[0]);

      if (remoteVideoRef.current) {

        remoteVideoRef.current.srcObject = event.streams[0];

      }

      setPeerConnected(true);

      setConnectionStatus("Peer connected!");

    };



    peerConnectionRef.current.onnegotiationneeded = async () => {

      try {

        console.log('Negotiation needed: Creating offer...');

        const offer = await peerConnectionRef.current.createOffer();

        await peerConnectionRef.current.setLocalDescription(offer);

        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {

          socketRef.current.send(JSON.stringify({

            type: 'offer',

            sdp: peerConnectionRef.current.localDescription,

            targetId: currentPeerIdRef.current,

            senderId: currentUserIdRef.current

          }));

        } else {

          console.warn('WebSocket not connected or closed, cannot send SDP offer.');

        }

      } catch (error) {

        console.error('Error creating or sending offer:', error);

      }

    };



    peerConnectionRef.current.oniceconnectionstatechange = () => {

        const newState = peerConnectionRef.current.iceConnectionState;

        console.log('ICE connection state changed:', newState);

        setConnectionStatus(`WebRTC connection: ${newState}`);

        if (newState === 'disconnected' || newState === 'failed' || newState === 'closed') {

            console.log(`WebRTC connection lost: ${newState}. Ending call.`);

            setPeerConnected(false);

            if (isCallingRef.current) { // Use ref for isCalling

                endCall(); // Calls the stable endCall callback

            }

        } else if (newState === 'connected' || newState === 'completed') {

            setPeerConnected(true);

            setConnectionStatus("WebRTC connection established.");

        }

    };



    peerConnectionRef.current.onconnectionstatechange = () => {

        const newState = peerConnectionRef.current.connectionState;

        console.log('Peer connection state changed:', newState);

        if (newState === 'disconnected' || newState === 'failed' || newState === 'closed') {

            console.log(`Peer connection lost: ${newState}. Ending call.`);

            setPeerConnected(false);

            if (isCallingRef.current) { // Use ref for isCalling

                endCall(); // Calls the stable endCall callback

            }

        } else if (newState === 'connected') {

            setPeerConnected(true);

            setConnectionStatus("Peer connection established.");

        }

    };

  }, [endCall, setRemoteStream, setPeerConnected, setConnectionStatus, localStreamRef, isCallingRef]);





  // Primary effect to manage WebSocket connection and signaling

  // This effect will run ONLY once on mount and once on unmount.

  useEffect(() => {

    let reconnectTimeout;



    const connectWebSocketInner = () => {

      // Guard against multiple concurrent connections

      if (socketRef.current && (socketRef.current.readyState === WebSocket.CONNECTING || socketRef.current.readyState === WebSocket.OPEN)) {

        console.log("WebSocket already connecting or open. Skipping new connection attempt.");

        return;

      }



      // If a previous socket was closed, clear it before creating a new one.

      if (socketRef.current && socketRef.current.readyState === WebSocket.CLOSED) {

          console.log("Previous WebSocket was closed, clearing ref before new connection.");

          socketRef.current = null;

      }



      console.log(`Attempting to connect to signaling server at ${SIGNALING_SERVER_URL}...`);

      setConnectionStatus("Connecting to signaling server...");

      socketRef.current = new WebSocket(SIGNALING_SERVER_URL);



      socketRef.current.onopen = () => {

        console.log('Connected to signaling server');

        setWsConnected(true);

        clearTimeout(reconnectTimeout);



        const id = 'user_' + Math.random().toString(36).substring(2, 9);

        setUserId(id); // Update state

        currentUserIdRef.current = id; // IMMEDIATELY update ref for use in current closure



        socketRef.current.send(JSON.stringify({ type: 'register', id: id }));

        setConnectionStatus("Connected to signaling server. Your ID: " + id);



        // If teacher, immediately set their userId as the meeting ID

        if (roleRef.current === 'teacher' && onMeetingCreated) { // Use ref for role

          onMeetingCreated(id); // Pass the generated userId as the meeting ID

        }

      };



      socketRef.current.onmessage = async (event) => {

        try {

          const message = JSON.parse(event.data);

          console.log('Received message from signaling server:', message);



          switch (message.type) {

            case 'offer':

              if (message.targetId === currentUserIdRef.current) {

                if (!peerConnectionRef.current) {

                  initializePeerConnection(); // Call stable callback

                }

                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(message.sdp));

                const answer = await peerConnectionRef.current.createAnswer();

                await peerConnectionRef.current.setLocalDescription(answer);

                if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {

                  socketRef.current.send(JSON.stringify({

                    type: 'answer',

                    sdp: peerConnectionRef.current.localDescription,

                    targetId: message.senderId,

                    senderId: currentUserIdRef.current

                  }));

                }

                setIsCalling(true);

                setPeerId(message.senderId);

                currentPeerIdRef.current = message.senderId;

                setConnectionStatus("Call incoming! Answering...");

              } else {

                console.warn("Received offer not for this user:", message);

              }

              break;

            case 'answer':

              if (message.targetId === currentUserIdRef.current) {

                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(message.sdp));

                setIsCalling(true);

                setConnectionStatus("Call connected!");

              } else {

                console.warn("Received answer not for this user:", message);

              }

              break;

            case 'ice-candidate':

              if (message.targetId === currentUserIdRef.current && message.candidate) {

                if (peerConnectionRef.current) {

                    await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(message.candidate));

                } else {

                    console.warn("Received ICE candidate but peerConnection is not initialized.");

                }

              } else {

                console.warn("Received ICE candidate not for this user or missing candidate:", message);

              }

              break;

            case 'user-joined':

                console.log(`User ${message.id} joined.`);

                // If this is a student and the joined user is the teacher, set them as peer

                // Or if no peer is set, and a new user joins, suggest them as a peer (for teacher to call)

                if (roleRef.current === 'student' && message.id === initialPeerIdRef.current) {

                    setPeerId(message.id);

                    currentPeerIdRef.current = message.id;

                    setConnectionStatus(`Teacher ${message.id} joined. Ready to connect.`);

                    if (!isCallingRef.current && localStreamRef.current && wsConnected) { // Ensure wsConnected before auto-calling

                        startCall(); // Auto-call the teacher

                    }

                } else if (roleRef.current === 'teacher' && !currentPeerIdRef.current && message.id !== currentUserIdRef.current) {

                    setPeerId(message.id);

                    currentPeerIdRef.current = message.id;

                    setConnectionStatus(`Student ${message.id} joined. Ready to call them.`);

                } else if (message.id !== currentUserIdRef.current) {

                    setConnectionStatus(`User ${message.id} joined.`);

                }

                break;

            case 'user-left':

                console.log(`User ${message.id} left.`);

                if (message.id === currentPeerIdRef.current) {

                    endCall();

                    setConnectionStatus(`Peer ${message.id} left. Call ended.`);

                }

                break;

            default:

              console.warn('Unknown message type:', message.type);

          }

        } catch (e) {

          console.error("Error processing WebSocket message:", e);

        }

      };



      socketRef.current.onclose = (event) => {

        console.log('WebSocket disconnected. Code:', event.code, 'Reason:', event.reason);

        setWsConnected(false);

        setConnectionStatus("Disconnected from signaling server. Attempting to reconnect...");

        if (!event.wasClean) {

            console.log('Attempting to reconnect WebSocket in 5 seconds...');

            reconnectTimeout = setTimeout(connectWebSocketInner, 5000); // Recursive call to inner function

        }

      };



      socketRef.current.onerror = (errorEvent) => {

        console.error('WebSocket error event:', errorEvent);

        if (errorEvent && errorEvent.message) {

            console.error('WebSocket error message:', errorEvent.message);

        }

        if (errorEvent && errorEvent.code) {

            console.error('WebSocket error code:', errorEvent.code);

        }

        setWsConnected(false);

        setConnectionStatus("WebSocket error. Check server or network.");

      };

    };



    connectWebSocketInner(); // Initial call to start the connection process



    return () => {

      // Cleanup on component unmount

      clearTimeout(reconnectTimeout);

      if (socketRef.current) {

        console.log("Closing WebSocket on component unmount.");

        socketRef.current.close(1000, "Component Unmount");

      }

    };

    // EMPTY DEPENDENCY ARRAY: This effect runs only once on mount and cleans up on unmount.

    // All dynamic values are accessed via refs or stable callbacks.

  }, []);





  // Function to get local media (camera and microphone) - runs once on mount

  useEffect(() => {

    const getMedia = async () => {

      try {

        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        setLocalStream(stream);

        if (localVideoRef.current) {

          localVideoRef.current.srcObject = stream;

        }

        setMediaAccessDenied(false);

        setConnectionStatus("Media access granted. Waiting for signaling server.");

      } catch (error) {

        console.error('Error accessing media devices: Error: Permission denied');

        console.error('Could not access camera/microphone. Please ensure permissions are granted in your browser settings.');

        setMediaAccessDenied(true);

        setConnectionStatus("Media access denied. Please grant permissions.");

      }

    };



    getMedia();



    return () => {

      if (localStream) {

        localStream.getTracks().forEach(track => track.stop());

      }

    };

  }, []); // Empty dependency array: runs only once on mount





  // Function to start the call (initiate an offer)

  const startCall = async () => {

    if (!localStream) {

      console.error('Local stream not available. Please allow camera/microphone access.');

      setConnectionStatus("Cannot start call: Camera/mic not available.");

      return;

    }

    if (!peerId) {

        console.error('Please enter a Peer ID to call, or wait for another user to join.');

        setConnectionStatus("Cannot start call: Enter a Peer ID.");

        return;

    }

    if (!wsConnected) {

        console.error('Cannot start call: Not connected to signaling server. Please check server status.');

        setConnectionStatus("Cannot start call: Not connected to signaling server.");

        return;

    }

    if (peerId === userId) {

        console.error('Cannot call yourself. Please enter a different Peer ID.');

        setConnectionStatus("Cannot call yourself.");

        return;

    }

    if (isCalling) {

        console.warn('Already in a call or attempting to call.');

        return;

    }



    setIsCalling(true);

    setConnectionStatus("Initiating call...");

    initializePeerConnection(); // Call the stable callback



    try {

      const offer = await peerConnectionRef.current.createOffer();

      await peerConnectionRef.current.setLocalDescription(offer);

      console.log('Sending SDP offer:', offer);

      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {

        socketRef.current.send(JSON.stringify({

          type: 'offer',

          sdp: peerConnectionRef.current.localDescription,

          targetId: peerId,

          senderId: userId // Our ID

        }));

      } else {

        console.warn('WebSocket not connected, cannot send SDP offer. Call aborted.');

        setIsCalling(false);

        setConnectionStatus("Call aborted: Signaling server disconnected.");

      }

    } catch (error) {

      console.error('Error creating or sending offer:', error);

      setIsCalling(false);

      setConnectionStatus("Error initiating call.");

    }

  };



  // Function to toggle audio mute/unmute

  const toggleAudio = () => {

    if (localStream) {

      localStream.getAudioTracks().forEach(track => {

        track.enabled = !track.enabled;

        setIsAudioMuted(!track.enabled);

      });

    }

  };



  // Function to toggle video mute/unmute

  const toggleVideo = () => {

    if (localStream) {

      localStream.getVideoTracks().forEach(track => {

        track.enabled = !track.enabled;

        setIsVideoMuted(!track.enabled);

      });

    }

  };



  return (

    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 font-inter">

      <h1 className="text-4xl font-bold mb-8 text-blue-400">E-Learning Video Call ({role === 'teacher' ? 'Teacher' : 'Student'})</h1>



      {/* Overall connection status indicator */}

      <div className={`p-3 rounded-md mb-4 shadow-md w-full max-w-md text-center

        ${wsConnected && peerConnected ? 'bg-green-600' :

          wsConnected && !peerConnected ? 'bg-blue-600' :

          mediaAccessDenied ? 'bg-yellow-700' :

          'bg-red-800'}`}>

        <p className="font-semibold">{connectionStatus}</p>

        {!wsConnected && !mediaAccessDenied && (

             <p className="text-sm">Please ensure the Node.js signaling server is running at <code className="font-mono">{SIGNALING_SERVER_URL}</code>.</p>

        )}

        {mediaAccessDenied && (

            <p className="text-sm">Please allow access to your camera and microphone in your browser settings.</p>

        )}

      </div>





      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">

        {/* Local Video Stream */}

        <div className="flex-1 bg-gray-800 rounded-lg shadow-lg overflow-hidden relative">

          <h2 className="absolute top-2 left-2 text-lg font-semibold bg-gray-900 bg-opacity-75 px-3 py-1 rounded-md">Your Camera</h2>

          <video

            ref={localVideoRef}

            autoPlay

            playsInline

            muted // Mute local video to prevent echo

            className="w-full h-full object-cover rounded-lg"

          ></video>

          {!localStream && !mediaAccessDenied && (

            <div className="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75 rounded-lg">

              <p className="text-xl text-gray-400">Awaiting camera/mic access...</p>

            </div>

          )}

           {mediaAccessDenied && (

            <div className="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75 rounded-lg">

              <p className="text-xl text-gray-400">Camera/Mic Blocked</p>

            </div>

          )}

        </div>



        {/* Remote Video Stream */}

        <div className="flex-1 bg-gray-800 rounded-lg shadow-lg overflow-hidden relative">

          <h2 className="absolute top-2 left-2 text-lg font-semibold bg-gray-900 bg-opacity-75 px-3 py-1 rounded-md">Peer Camera</h2>

          <video

            ref={remoteVideoRef}

            autoPlay

            playsInline

            className="w-full h-full object-cover rounded-lg"

          ></video>

          {!remoteStream && (

            <div className="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75 rounded-lg">

              <p className="text-xl text-gray-400">Waiting for peer connection...</p>

            </div>

          )}

        </div>

      </div>



      {/* Controls */}

      <div className="mt-8 flex flex-wrap justify-center gap-4">

        {/* User ID Display */}

        <div className="flex items-center bg-gray-700 rounded-full px-4 py-2 shadow-md">

          <span className="text-sm font-medium mr-2">Your ID:</span>

          <span className="text-blue-300 font-bold">{userId}</span>

        </div>



        {/* Peer ID Input (conditionally rendered) */}

        {role === 'teacher' && (

          <div className="flex items-center bg-gray-700 rounded-full px-4 py-2 shadow-md">

            <label htmlFor="peerIdInput" className="text-sm font-medium mr-2">Student ID:</label>

            <input

              id="peerIdInput"

              type="text"

              value={peerId}

              onChange={(e) => setPeerId(e.target.value)}

              placeholder="Enter student ID to call"

              className="bg-gray-800 text-white rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"

            />

          </div>

        )}

        {role === 'student' && (

          <div className="flex items-center bg-gray-700 rounded-full px-4 py-2 shadow-md">

            <span className="text-sm font-medium mr-2">Teacher ID:</span>

            <span className="text-blue-300 font-bold">{peerId}</span> {/* Display teacher's ID */}

          </div>

        )}





        {/* Call/End Call Buttons */}

        {!isCalling ? (

          <button

            onClick={startCall}

            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"

            disabled={!localStream || !peerId || !wsConnected || mediaAccessDenied || isCalling}

          >

            {role === 'teacher' ? 'Call Student' : 'Join Teacher'}

          </button>

        ) : (

          <button

            onClick={endCall}

            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus://ring-red-500 focus:ring-opacity-50"

          >

            End Call

          </button>

        )}



        {/* Mute/Unmute Audio Button */}

        <button

          onClick={toggleAudio}

          className={`py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${

            isAudioMuted ? 'bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-400' : 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400'

          }`}

          disabled={!isCalling}

        >

          {isAudioMuted ? (

            <svg className="w-6 h-6 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">

              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8V4a1 1 0 10-2 0v4a5 5 0 01-10 0V4a1 1 0 00-2 0v4a7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />

            </svg>

          ) : (

            <svg className="w-6 h-6 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">

              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8V4a1 1 0 10-2 0v4a5 5 0 01-10 0V4a1 1 0 00-2 0v4a7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />

            </svg>

          )}

          {isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}

        </button>



        {/* Mute/Unmute Video Button */}

        <button

          onClick={toggleVideo}

          className={`py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${

            isVideoMuted ? 'bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-400' : 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400'

          }`}

          disabled={!isCalling}

        >

          {isVideoMuted ? (

            <svg className="w-6 h-6 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">

              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm11.293 1.293a1 1 0 00-1.414 0L10 9.586 6.121 5.707a1 1 0 00-1.414 1.414L8.586 11l-3.879 3.879a1 1 0 101.414 1.414L10 12.414l3.879 3.879a1 1 0 001.414-1.414L11.414 11l3.879-3.879a1 1 0 000-1.414z" clipRule="evenodd" />

            </svg>

          ) : (

            <svg className="w-6 h-6 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">

              <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />

            </svg>

          )}

          {isVideoMuted ? 'Unmute Video' : 'Mute Video'}

        </button>

      </div>

    </div>

  );

};



export default VideoCall;

// // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




// import React, { useRef, useEffect, useState, useCallback } from 'react';



// // Public STUN servers for NAT traversal. For production, consider TURN servers for more robust connectivity.

// const configuration = {

//   iceServers: [

//     { urls: 'stun:stun.l.google.com:19302' },

//     { urls: 'stun:stun1.l.google.com:19302' },

//     { urls: 'stun:stun2.l.google.com:19302' },

//     // For production, consider adding a TURN server (e.g., from Xirsys, Twilio, Coturn)

//     // { urls: 'turn:your_turn_server_url:port', username: 'your_username', credential: 'your_password' }

//   ],

// };



// // IMPORTANT: Ensure this URL matches the port your Node.js signaling server is running on.

// const SIGNALING_SERVER_URL = 'ws://localhost:8080';



// const VideoCall = ({ role, initialPeerId, onMeetingCreated, onMeetingEnded }) => {

//   const localVideoRef = useRef(null);

//   const remoteVideoRef = useRef(null);

//   const peerConnectionRef = useRef(null);
    
//   const socketRef = useRef(null); // Ref for the WebSocket instance
 





//   // States

//   const [localStream, setLocalStream] = useState(null);

//   const [remoteStreams, setRemoteStreams] = useState({});

//   const [isCalling, setIsCalling] = useState(false);

//   const [isAudioMuted, setIsAudioMuted] = useState(false);

//   const [isVideoMuted, setIsVideoMuted] = useState(false);

//   const [userId, setUserId] = useState('');

//   const [peerId, setPeerId] = useState(initialPeerId || '');

//   const [wsConnected, setWsConnected] = useState(false);

//   const [peerConnected, setPeerConnected] = useState(false);

//   const [mediaAccessDenied, setMediaAccessDenied] = useState(false);

//   const [connectionStatus, setConnectionStatus] = useState("Initializing...");

//   const [peerConnections, setPeerConnections] = useState(new Map()); // Track all peer connections    

//   const [participants, setParticipants] = useState(new Set());

//   // Refs to hold the latest state values for stable access within closures

//   // These refs are crucial for functions inside useEffect that don't re-run often

//   const currentUserIdRef = useRef(userId);

//   const currentPeerIdRef = useRef(peerId);

//   const localStreamRef = useRef(localStream);

//   const isCallingRef = useRef(isCalling); // Added ref for isCalling

//   const roleRef = useRef(role); // Added ref for role

//   const initialPeerIdRef = useRef(initialPeerId); // Added ref for initialPeerId



//   // Update refs whenever their corresponding states/props change

//   useEffect(() => { currentUserIdRef.current = userId; }, [userId]);

//   useEffect(() => { currentPeerIdRef.current = peerId; }, [peerId]);

//   useEffect(() => { localStreamRef.current = localStream; }, [localStream]);

//   useEffect(() => { isCallingRef.current = isCalling; }, [isCalling]);

//   useEffect(() => { roleRef.current = role; }, [role]);

//   useEffect(() => { initialPeerIdRef.current = initialPeerId; }, [initialPeerId]);





//   // Function to end the call (cleans up WebRTC, not WebSocket) - now fully stable

// const endCall = useCallback(() => {

//     peerConnections.forEach((pc, peerId) => {
//         pc.close();
//         // Cleanup streams
//         setRemoteStreams(prev => {
//           const newStreams = {...prev};
//           delete newStreams[peerId];
//           return newStreams;
//         });
//       });
//       setPeerConnections(new Map());
//       console.log("Attempting to end call and clean up WebRTC resources.");
  
//       if (peerConnectionRef.current) {
  
//         peerConnectionRef.current.close();
  
//         peerConnectionRef.current = null;
  
//         console.log("RTCPeerConnection closed.");
  
//       }
  
//       if (remoteStreams) {
  
//             Object.values(remoteStreams).forEach(stream => {
//           stream.getTracks().forEach(track => track.stop());
//         });
//         setRemoteStreams({});
  
//       }

//     if (remoteStreams) {

//           Object.values(remoteStreams).forEach(stream => {
//         stream.getTracks().forEach(track => track.stop());
//       });
//       setRemoteStreams({});

//     }

//     setIsCalling(false);

//     setPeerConnected(false);

// setRemoteStreams(null); // Clear remote stream explicitly

//     console.log('Call ended successfully.');

//     setConnectionStatus("Call ended. Ready for new call.");

//     if (onMeetingEnded) {

//       onMeetingEnded(); // Notify parent component (App.jsx) that meeting ended

//     }

// }, [remoteStreams, onMeetingEnded, setIsCalling, setPeerConnected, setRemoteStreams, setConnectionStatus]);





//   // Function to initialize RTCPeerConnection - now fully stable

// const initializePeerConnection = useCallback((peerId) => {
//     const pc = new RTCPeerConnection(configuration);

//     // Add local tracks to new connection
//     localStreamRef.current?.getTracks().forEach(track => {
//     pc.addTrack(track, localStreamRef.current);
//     });

//     // ICE Candidate handling
//     pc.onicecandidate = (event) => {
//     if (event.candidate) {
//         socketRef.current.send(JSON.stringify({
//         type: 'ice-candidate',
//         candidate: event.candidate,
//         targetId: peerId,
//         senderId: currentUserIdRef.current
//         }));
//     }
//     };

//     // Track remote streams
//     pc.ontrack = (event) => {
//     setRemoteStreams(prev => ({
//         ...prev,
//         [peerId]: event.streams[0]
//     }));
//     };

//     // Connection state handling
//     pc.onconnectionstatechange = () => {
//         if (pc.connectionState === 'connected') {
//           setPeerConnected(true);
//           setPeerConnections(prev => new Map(prev).set(peerId, pc));
//         }
//         if (pc.connectionState === 'disconnected') {
//           setPeerConnections(prev => {
//             const newMap = new Map(prev);
//             newMap.delete(peerId);
//             return newMap;
//           });
//         }
//       };

//     return pc;
// }, [localStreamRef, currentUserIdRef]);

//   // Primary effect to manage WebSocket connection and signaling

//   // This effect will run ONLY once on mount and once on unmount.

//   useEffect(() => {

//     let reconnectTimeout;



//     const connectWebSocketInner = () => {

//       // Guard against multiple concurrent connections

//       if (socketRef.current && (socketRef.current.readyState === WebSocket.CONNECTING || socketRef.current.readyState === WebSocket.OPEN)) {

//         console.log("WebSocket already connecting or open. Skipping new connection attempt.");

//         return;

//       }



//       // If a previous socket was closed, clear it before creating a new one.

//       if (socketRef.current && socketRef.current.readyState === WebSocket.CLOSED) {

//           console.log("Previous WebSocket was closed, clearing ref before new connection.");

//           socketRef.current = null;

//       }



//       console.log(`Attempting to connect to signaling server at ${SIGNALING_SERVER_URL}...`);

//       setConnectionStatus("Connecting to signaling server...");

//       socketRef.current = new WebSocket(SIGNALING_SERVER_URL);



//       socketRef.current.onopen = () => {

//         console.log('Connected to signaling server');

//         setWsConnected(true);

//         clearTimeout(reconnectTimeout);



//         const id = 'user_' + Math.random().toString(36).substring(2, 9);

//         setUserId(id); // Update state

//         currentUserIdRef.current = id; // IMMEDIATELY update ref for use in current closure



//         socketRef.current.send(JSON.stringify({ type: 'register', id: id }));

//         setConnectionStatus("Connected to signaling server. Your ID: " + id);



//         // If teacher, immediately set their userId as the meeting ID

//         if (roleRef.current === 'teacher' && onMeetingCreated) { // Use ref for role

//           onMeetingCreated(id); // Pass the generated userId as the meeting ID

//         }

//       };



//       socketRef.current.onmessage = async (event) => {

//         try {

//           const message = JSON.parse(event.data);

//           console.log('Received message from signaling server:', message);



//           switch (message.type) {

//                 case 'offer':

//     if (message.targetId === currentUserIdRef.current) {

//       if (!peerConnectionRef.current) {

//         initializePeerConnection(); // Call stable callback

//       }

//       await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(message.sdp));

//       const answer = await peerConnectionRef.current.createAnswer();

//       await peerConnectionRef.current.setLocalDescription(answer);

//       if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {

//         socketRef.current.send(JSON.stringify({

//           type: 'answer',

//           sdp: peerConnectionRef.current.localDescription,

//           targetId: message.senderId,

//           senderId: currentUserIdRef.current

//         }));

//       }

//       setIsCalling(true);

//       setPeerId(message.senderId);

//       currentPeerIdRef.current = message.senderId;

//       setConnectionStatus("Call incoming! Answering...");

//     } else {

//       console.warn("Received offer not for this user:", message);

//     }

//     break;

//             case 'answer':

//               if (message.targetId === currentUserIdRef.current) {
//                 const pc = peerConnections.get(message.senderId);
//                 if (pc) {
//                  // Fix: Use RTCSessionDescription instead of RTCIceCandidate
//                  await pc.setRemoteDescription(new RTCSessionDescription(message.sdp));
//                  setConnectionStatus("Call connected!");
//                 }
//             }

//               break;

//             case 'ice-candidate':

//              if (message.targetId === currentUserIdRef.current && message.candidate) {
//                 const pc = peerConnections.get(message.senderId);
//                 if (pc) {
//                 await pc.addIceCandidate(new RTCIceCandidate(message.candidate));
//                 }
//             }
//               break;

//             case 'user-joined':
//                 if (roleRef.current === 'teacher' && message.id !== currentUserIdRef.current) {
//                     // Create new connection only if not already exists
//                     if (!peerConnections.has(message.id)) {
//                     const pc = initializePeerConnection(message.id);
                    
//                     // Set up track event before creating offer
//                     pc.ontrack = (event) => {
//                         setRemoteStreams(prev => {
//                           const newStream = new MediaStream([
//                             ...(prev[peerId]?.getTracks() || []),
//                             ...event.streams[0].getTracks()
//                           ]);
//                           return {...prev, [peerId]: newStream};
//                         });
//                       };

//                     // Create offer for new student
//                     pc.createOffer()
//                         .then(offer => pc.setLocalDescription(offer))
//                         .then(() => {
//                         socketRef.current.send(JSON.stringify({
//                             type: 'offer',
//                             sdp: pc.localDescription,
//                             targetId: message.id,
//                             senderId: currentUserIdRef.current
//                         }));
//                         setParticipants(prev => new Set([...prev, message.id]));
//                         })
//                         .catch(error => {
//                         console.error('Offer creation error:', error);
//                         });
//                     }
//                 }
//                 break;
//                 case 'user-left':
//                     if (peerConnections.has(message.id)) {
//                       peerConnections.get(message.id).close();
//                       setPeerConnections(prev => {
//                         const newMap = new Map(prev);
//                         newMap.delete(message.id);
//                         return newMap;
//                       });
//                       setParticipants(prev => {
//                         const updated = new Set(prev);
//                         updated.delete(message.id);
//                         return updated;
//                       });
//                 }
//                 break;

//             default:

//               console.warn('Unknown message type:', message.type);

//           }

//         } catch (e) {

//           console.error("Error processing WebSocket message:", e);

//         }

//       };



//       socketRef.current.onclose = (event) => {

//         console.log('WebSocket disconnected. Code:', event.code, 'Reason:', event.reason);

//         setWsConnected(false);

//         setConnectionStatus("Disconnected from signaling server. Attempting to reconnect...");

//         if (!event.wasClean) {

//             console.log('Attempting to reconnect WebSocket in 5 seconds...');

//             reconnectTimeout = setTimeout(connectWebSocketInner, 5000); // Recursive call to inner function

//         }

//       };



//       socketRef.current.onerror = (errorEvent) => {

//         console.error('WebSocket error event:', errorEvent);

//         if (errorEvent && errorEvent.message) {

//             console.error('WebSocket error message:', errorEvent.message);

//         }

//         if (errorEvent && errorEvent.code) {

//             console.error('WebSocket error code:', errorEvent.code);

//         }

//         setWsConnected(false);

//         setConnectionStatus("WebSocket error. Check server or network.");

//       };

//     };



//     connectWebSocketInner(); // Initial call to start the connection process



//     return () => {

//       // Cleanup on component unmount

//       clearTimeout(reconnectTimeout);

//       if (socketRef.current) {

//         console.log("Closing WebSocket on component unmount.");

//         socketRef.current.close(1000, "Component Unmount");

//       }

//     };

//     // EMPTY DEPENDENCY ARRAY: This effect runs only once on mount and cleans up on unmount.

//     // All dynamic values are accessed via refs or stable callbacks.

//   }, []);





//   // Function to get local media (camera and microphone) - runs once on mount

//   useEffect(() => {

//     const getMedia = async () => {

//       try {

//         const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

//         setLocalStream(stream);

//         if (localVideoRef.current) {

//           localVideoRef.current.srcObject = stream;

//         }

//         setMediaAccessDenied(false);

//         setConnectionStatus("Media access granted. Waiting for signaling server.");

//       } catch (error) {

//         console.error('Error accessing media devices: Error: Permission denied');

//         console.error('Could not access camera/microphone. Please ensure permissions are granted in your browser settings.');

//         setMediaAccessDenied(true);

//         setConnectionStatus("Media access denied. Please grant permissions.");

//       }

//     };



//     getMedia();



//     return () => {

//       if (localStream) {

//         localStream.getTracks().forEach(track => track.stop());

//       }

//     };

//   }, []); // Empty dependency array: runs only once on mount





//   // Function to start the call (initiate an offer)

//   const startCall = async () => {

//     if (!localStream) {

//       console.error('Local stream not available. Please allow camera/microphone access.');

//       setConnectionStatus("Cannot start call: Camera/mic not available.");

//       return;

//     }

//     if (!peerId) {

//         console.error('Please enter a Peer ID to call, or wait for another user to join.');

//         setConnectionStatus("Cannot start call: Enter a Peer ID.");

//         return;

//     }

//     if (!wsConnected) {

//         console.error('Cannot start call: Not connected to signaling server. Please check server status.');

//         setConnectionStatus("Cannot start call: Not connected to signaling server.");

//         return;

//     }

//     if (peerId === userId) {

//         console.error('Cannot call yourself. Please enter a different Peer ID.');

//         setConnectionStatus("Cannot call yourself.");

//         return;

//     }

//     if (isCalling) {

//         console.warn('Already in a call or attempting to call.');

//         return;

//     }



//     setIsCalling(true);

//     setConnectionStatus("Initiating call...");

//     const pc = initializePeerConnection(peerId); // Create new connection
//     try {
//         const offer = await pc.createOffer(); // Use new connection
//         await pc.setLocalDescription(offer);
        
//         socketRef.current.send(JSON.stringify({
//         type: 'offer',
//         sdp: pc.localDescription,
//         targetId: peerId,
//         senderId: userId
//         }));

//     } catch (error) {

//       console.error('Error creating or sending offer:', error);

//       setIsCalling(false);

//       setConnectionStatus("Error initiating call.");

//     }

//   };



//   // Function to toggle audio mute/unmute

// // Mute/unmute should affect all peer connections
//     const toggleAudio = () => {
//         localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
//         setIsAudioMuted(!isAudioMuted);
        
//         // Update all peer connections
//         peerConnections.forEach(pc => {
//         const sender = pc.getSenders().find(s => s.track.kind === 'audio');
//         if (sender) sender.replaceTrack(localStream.getAudioTracks()[0]);
//         });
//   };



//   // Function to toggle video mute/unmute

//   const toggleVideo = () => {

//     if (localStream) {

//       localStream.getVideoTracks().forEach(track => {

//         track.enabled = !track.enabled;

//         setIsVideoMuted(!track.enabled);

//       });

//     }

//   };



//   return (

//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 font-inter">

//       <h1 className="text-4xl font-bold mb-8 text-blue-400">E-Learning Video Call ({role === 'teacher' ? 'Teacher' : 'Student'})</h1>



//       {/* Overall connection status indicator */}

//       <div className={`p-3 rounded-md mb-4 shadow-md w-full max-w-md text-center

//         ${wsConnected && peerConnected ? 'bg-green-600' :

//           wsConnected && !peerConnected ? 'bg-blue-600' :

//           mediaAccessDenied ? 'bg-yellow-700' :

//           'bg-red-800'}`}>

//         <p className="font-semibold">{connectionStatus}</p>

//         {!wsConnected && !mediaAccessDenied && (

//              <p className="text-sm">Please ensure the Node.js signaling server is running at <code className="font-mono">{SIGNALING_SERVER_URL}</code>.</p>

//         )}

//         {mediaAccessDenied && (

//             <p className="text-sm">Please allow access to your camera and microphone in your browser settings.</p>

//         )}

//       </div>





//       <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">

//         {/* Local Video Stream */}

//         <div className="flex-1 bg-gray-800 rounded-lg shadow-lg overflow-hidden relative">

//           <h2 className="absolute top-2 left-2 text-lg font-semibold bg-gray-900 bg-opacity-75 px-3 py-1 rounded-md">Your Camera</h2>

//             <video
//             ref={remoteVideoRef}
//             autoPlay
//             playsInline
//             className="w-full h-full object-cover rounded-lg"
//             ></video>

//           {!localStream && !mediaAccessDenied && (

//             <div className="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75 rounded-lg">

//               <p className="text-xl text-gray-400">Awaiting camera/mic access...</p>

//             </div>

//           )}

//            {mediaAccessDenied && (

//             <div className="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75 rounded-lg">

//               <p className="text-xl text-gray-400">Camera/Mic Blocked</p>

//             </div>

//           )}

//         </div>



//         {/* Remote Video Stream */}

//         {/* Local Video Stream */}
//         <div className="flex-1 bg-gray-800 rounded-lg shadow-lg overflow-hidden relative">
//         <h2 className="absolute top-2 left-2 text-lg font-semibold bg-gray-900 bg-opacity-75 px-3 py-1 rounded-md">
//             Your Camera
//         </h2>
//         <video
//             ref={localVideoRef}
//             autoPlay
//             playsInline
//             muted
//             className="w-full h-full object-cover rounded-lg"
//         ></video>
//         </div>

//         {/* Remote Video Streams */}
//         <div className="flex-1 bg-gray-800 rounded-lg shadow-lg overflow-hidden relative">
//         <h2 className="absolute top-2 left-2 text-lg font-semibold bg-gray-900 bg-opacity-75 px-3 py-1 rounded-md">
//             Participants ({Object.keys(remoteStreams).length})
//         </h2>
//         <div className="grid grid-cols-2 gap-4 p-4">
//             {Object.entries(remoteStreams).map(([peerId, stream]) => (
//             <div key={peerId} className="relative">
//                 <video
//                 ref={el => el && (el.srcObject = stream)}
//                 autoPlay
//                 playsInline
//                 className="w-full h-48 object-cover rounded-lg"
//                 />
//                 <div className="absolute bottom-2 left-2 text-sm bg-gray-900 bg-opacity-75 px-2 py-1 rounded">
//                 {peerId}
//                 </div>
//             </div>
//             ))}
//         </div>
//         </div>



//       {/* Controls */}

//       <div className="mt-8 flex flex-wrap justify-center gap-4">

//         {/* User ID Display */}

//         <div className="flex items-center bg-gray-700 rounded-full px-4 py-2 shadow-md">

//           <span className="text-sm font-medium mr-2">Your ID:</span>

//           <span className="text-blue-300 font-bold">{userId}</span>

//         </div>



//         {/* Peer ID Input (conditionally rendered) */}

//         {role === 'teacher' && (

//           <div className="flex items-center bg-gray-700 rounded-full px-4 py-2 shadow-md">

//             <label htmlFor="peerIdInput" className="text-sm font-medium mr-2">Student ID:</label>

//             <input

//               id="peerIdInput"

//               type="text"

//               value={peerId}

//               onChange={(e) => setPeerId(e.target.value)}

//               placeholder="Enter student ID to call"

//               className="bg-gray-800 text-white rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"

//             />

//           </div>

//         )}

//         {role === 'student' && (

//           <div className="flex items-center bg-gray-700 rounded-full px-4 py-2 shadow-md">

//             <span className="text-sm font-medium mr-2">Teacher ID:</span>

//             <span className="text-blue-300 font-bold">{peerId}</span> {/* Display teacher's ID */}

//           </div>

//         )}

//             <div className="participant-list bg-gray-800 p-4 rounded-lg w-full max-w-md">
//             <h3 className="text-lg font-semibold mb-2">Connected Students ({participants.size})</h3>
//             <div className="space-y-1 max-h-40 overflow-y-auto">
//                 {[...participants].map(id => (
//                 <div key={id} className="text-sm text-blue-300 px-2 py-1 bg-gray-700 rounded">
//                     {id}
//                 </div>
//                 ))}
//             </div>
//             </div>

//         {/* Fix the call button structure */}
//         {!isCalling ? (
//             role === 'teacher' ? (
//                 <button
//                 onClick={() => {
//                     if (peerId) {
//                     const pc = initializePeerConnection(peerId);
//                     pc.createOffer()
//                         .then(offer => pc.setLocalDescription(offer))
//                         .then(() => {
//                         socketRef.current.send(JSON.stringify({
//                             type: 'offer',
//                             sdp: pc.localDescription,
//                             targetId: peerId,
//                             senderId: userId
//                         }));
//                         });
//                     }
//                 }}
//                 className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
//                 disabled={!localStream || !peerId || !wsConnected || mediaAccessDenied}
//                 >
//                 Call Student
//                 </button>
//             ) : (
//                 <button
//                 onClick={startCall}
//                 className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
//                 disabled={!localStream || !wsConnected || mediaAccessDenied}
//                 >
//                 Join Teacher
//                 </button>
//             )
//             ) : (
//             <button
//                 onClick={endCall}
//                 className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
//             >
//                 End Call
//             </button>
//             )}

//         {/* Call/End Call Buttons */}

//         




//         {/* Mute/Unmute Audio Button */}

//         <button

//           onClick={toggleAudio}

//           className={`py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${

//             isAudioMuted ? 'bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-400' : 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400'

//           }`}

//           disabled={!isCalling}

//         >

//           {isAudioMuted ? (

//             <svg className="w-6 h-6 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">

//               <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8V4a1 1 0 10-2 0v4a5 5 0 01-10 0V4a1 1 0 00-2 0v4a7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />

//             </svg>

//           ) : (

//             <svg className="w-6 h-6 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">

//               <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8V4a1 1 0 10-2 0v4a5 5 0 01-10 0V4a1 1 0 00-2 0v4a7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />

//             </svg>

//           )}

//           {isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}

//         </button>



//         {/* Mute/Unmute Video Button */}

//         <button

//           onClick={toggleVideo}

//           className={`py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${

//             isVideoMuted ? 'bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-400' : 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400'

//           }`}

//           disabled={!isCalling}

//         >

//           {isVideoMuted ? (

//             <svg className="w-6 h-6 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">

//               <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm11.293 1.293a1 1 0 00-1.414 0L10 9.586 6.121 5.707a1 1 0 00-1.414 1.414L8.586 11l-3.879 3.879a1 1 0 101.414 1.414L10 12.414l3.879 3.879a1 1 0 001.414-1.414L11.414 11l3.879-3.879a1 1 0 000-1.414z" clipRule="evenodd" />

//             </svg>

//           ) : (

//             <svg className="w-6 h-6 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">

//               <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />

//             </svg>

//           )}

//           {isVideoMuted ? 'Unmute Video' : 'Mute Video'}

//         </button>

//       </div>

//     </div>
// </div>

//   );

// };



// export default VideoCall;