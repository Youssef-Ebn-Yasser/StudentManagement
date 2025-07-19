import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import * as signalR from '@microsoft/signalr';
import axiosInstance from '../../services/axiosInstance';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FaPaperPlane, FaUserCircle } from 'react-icons/fa';
import Loader from './../Loader/Loader';

// API Endpoints (These remain the same for both student and teacher views)
const CHAT_HUB_URL = "https://e-learn-v1.runasp.net/chatHub";
const GET_CHAT_ROOM_ID_API = "https://e-learn-v1.runasp.net/api/ChatRooms/GetChatRoomID";
const GET_MESSAGES_API_BASE = "https://e-learn-v1.runasp.net/api/ChatRooms"; // Append /<chatRoomId>/messages

const TChatRoom = () => {
    const { studentId: paramStudentId } = useParams();
    const { user } = useSelector((state) => state.auth);

    // State for the authenticated user's ID and name (which is the teacher in this component)
    const [currentUserId, setCurrentUserId] = useState(null);
    const [currentUserName, setCurrentUserName] = useState('');
    const [currentUserRole, setCurrentUserRole] = useState(null); // Will be 'teacher'

    const [chatRoomId, setChatRoomId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [connection, setConnection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const messagesEndRef = useRef(null); // Ref for scrolling to the latest message

    // --- Utility for scrolling to bottom of messages ---
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // --- Function to fetch or create chat room ID ---
    // This function's parameters and internal logic remain the same as it correctly
    // takes studentId and teacherId as arguments, regardless of the user's role.
    const getOrCreateChatRoom = useCallback(async (sId, tId) => {
        const studentIdNum = parseInt(sId, 10);
        const teacherIdNum = parseInt(tId, 10);

        if (isNaN(studentIdNum) || studentIdNum <= 0) {
            setError("Invalid Student ID for chat room creation.");
            toast.error("Invalid Student ID provided.");
            setLoading(false);
            return null;
        }
        if (isNaN(teacherIdNum) || teacherIdNum <= 0) {
            setError("Invalid Teacher ID for chat room creation.");
            toast.error("Invalid Teacher ID provided.");
            setLoading(false);
            return null;
        }

        try {
            setLoading(true);
            setError(null);
            console.log(`Attempting to get/create chat room for Student ID: ${studentIdNum}, Teacher ID: ${teacherIdNum}`);
            const response = await axiosInstance.post('/api/ChatRooms/GetChatRoomID', {
                studentId: String(studentIdNum),
                teacherId: String(teacherIdNum),
            });

            if (response.data.succeeded) {
                const receivedChatRoomId = response.data.data;
                if (receivedChatRoomId) {
                    setChatRoomId(receivedChatRoomId);
                    console.log("Chat room ID received:", receivedChatRoomId);
                    return receivedChatRoomId;
                } else {
                    throw new Error("Chat room ID was not found in the response data.");
                }
            } else {
                const errorMessage = response.data.message || response.data.massage || 'Failed to get/create chat room ID.';
                throw new Error(errorMessage + ` Server response: ${JSON.stringify(response.data)}`);
            }
        } catch (err) {
            console.error('Error getting/creating chat room:', err.response?.data || err.message, err);
            
            if (err.response?.status === 401) {
                const errorMessage = 'Authentication failed. Please log in again.';
                setError(errorMessage);
                toast.error(errorMessage);
            } else if (err.response?.status === 403) {
                const errorMessage = 'Access denied. You do not have permission to access this chat.';
                setError(errorMessage);
                toast.error(errorMessage);
            } else {
                const apiErrors = err.response?.data?.errors;
                let detailedErrorMessage = '';
                if (apiErrors) {
                    for (const key in apiErrors) {
                        if (apiErrors.hasOwnProperty(key)) {
                            detailedErrorMessage += `${key}: ${apiErrors[key].join(', ')}\n`;
                        }
                    }
                }
                const finalErrorMessage = detailedErrorMessage || err.response?.data?.message || err.response?.data?.massage || err.message || 'Failed to load chat room.';
                setError(finalErrorMessage);
                toast.error(finalErrorMessage);
            }
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // --- Function to load historical messages ---
    const loadHistoricalMessages = useCallback(async (roomId) => {
        if (!roomId) return;
        try {
            const response = await axiosInstance.get(`/api/ChatRooms/${roomId}/messages`);
            if (response.data.succeeded) {
                setMessages(response.data.data || []);
            } else {
                toast.error(response.data.message || 'Failed to load historical messages.');
            }
        } catch (err) {
            console.error('Error loading historical messages:', err);
            toast.error('Error loading historical messages.');
        }
    }, []);

    // --- SignalR Connection Logic ---
    useEffect(() => {
        if (!chatRoomId || !currentUserId) {
            console.log("SignalR: Waiting for chatRoomId and currentUserId...", { chatRoomId, currentUserId });
            return;
        }

        let newConnection = new signalR.HubConnectionBuilder()
            .withUrl(CHAT_HUB_URL)
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        newConnection.on("ReceiveMessage", (message) => {
            console.log("Received new message:", message);
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        newConnection.onclose(async (error) => {
            console.log('Connection closed due to error:', error);
            setIsConnected(false);
        });

        const startSignalR = async () => {
            try {
                await newConnection.start();
                console.log("SignalR Connected.");
                setIsConnected(true);
                // Join the specific chat room
                await newConnection.invoke("JoinRoom", chatRoomId);
                console.log(`Joined chat room: ${chatRoomId}`);
                // Load historical messages only if messages array is empty
                if (messages.length === 0) {
                    loadHistoricalMessages(chatRoomId);
                }
            } catch (err) {
                console.error("Error starting SignalR connection:", err);
                setError("Could not connect to chat. Retrying...");
                toast.error("Could not connect to chat. Retrying...");
                setIsConnected(false);
            }
        };

        setConnection(newConnection); // Store the connection object in state
        startSignalR(); // Initiate connection

        // Cleanup function for useEffect: stop the connection when component unmounts or dependencies change
        return () => {
            if (newConnection.state === signalR.HubConnectionState.Connected) {
                newConnection.stop()
                    .then(() => console.log("SignalR Disconnected."))
                    .catch(err => console.error("Error stopping SignalR connection:", err));
            }
        };
    }, [chatRoomId, currentUserId, loadHistoricalMessages, messages.length]); // Dependencies for re-running this effect

    // --- Initial setup: Determine user role and IDs, then get/create chat room ---
    useEffect(() => {
        const setupTeacherChat = async () => {
            setLoading(true);
            setError(null);

            // Get logged-in teacher's ID and Name from Redux store
            if (!user?.id) {
                setError("Teacher ID not found. Please ensure you are logged in as a teacher.");
                toast.error("Authentication error: Teacher ID missing.");
                setLoading(false);
                return;
            }

            const teacherUserId = parseInt(user.id, 10);
            const teacherUserName = user.name || user.userName || `Teacher ${teacherUserId}`;

            // Validate the teacher's ID from Redux store (current user)
            if (isNaN(teacherUserId) || teacherUserId <= 0) {
                setError("Teacher ID is invalid. Please ensure you are logged in as a teacher.");
                toast.error("Authentication error: Invalid Teacher ID.");
                setLoading(false);
                return;
            }

            // Get the student ID from the URL (the 'other' participant in the chat)
            const studentIdFromUrl = parseInt(paramStudentId, 10);

            // Validate the student ID from the URL
            if (isNaN(studentIdFromUrl) || studentIdFromUrl <= 0) {
                setError("Student ID not provided in the URL or is invalid. Cannot establish chat with student.");
                toast.error("Invalid Student ID in URL.");
                setLoading(false);
                return;
            }

            // Set the current user's details (which is the teacher)
            setCurrentUserId(teacherUserId);
            setCurrentUserName(teacherUserName);
            setCurrentUserRole('teacher');
            console.log("Current User (Teacher):", teacherUserName, "(ID:", teacherUserId, ")");
            console.log("Attempting to chat with Student ID from URL:", studentIdFromUrl);

            // Call getOrCreateChatRoom with the student ID from the URL and the teacher's ID from localStorage.
            // In the API, 'studentId' refers to the student and 'teacherId' refers to the teacher.
            const roomId = await getOrCreateChatRoom(studentIdFromUrl, teacherUserId);
            if (!roomId) {
                // Errors are already handled by getOrCreateChatRoom, just return
                return;
            }
        };

        setupTeacherChat();
    }, [paramStudentId, getOrCreateChatRoom]); // Effect re-runs if the studentId in the URL changes

    // --- Scroll to bottom whenever messages update ---
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    function getMessageAlignment(msg, currentUserId) {
    // Returns the correct Tailwind classes for alignment and color
    if (msg.senderId === currentUserId || msg.SenderId === currentUserId) {
        // Sender (teacher): blue, right
        return "self-end bg-blue-500 text-white shadow-md";
    } else {
        // Receiver (student): grey, left
        return "mr-auto bg-gray-200 text-gray-800 shadow-sm";
    }
}

    // --- Send Message Function ---
    const sendMessage = async () => {
        // Prevent sending if input is empty, not connected, or user not identified
        if (!messageInput.trim() || !connection || connection.state !== signalR.HubConnectionState.Connected || !chatRoomId || !currentUserId) {
            toast.error("Cannot send message. Not connected, message is empty, or user not identified.");
            return;
        }

        try {
            // Invoke the "SendMessage" method on the SignalR hub
            // It expects (chatRoomId, senderId, content)
            await connection.invoke("SendMessage", chatRoomId, currentUserId, messageInput);
            setMessageInput(''); // Clear the input field after sending
        } catch (err) {
            console.error("Error sending message:", err);
            toast.error("Failed to send message.");
        }
    };

    // --- JSX Render ---
    if (loading) return <Loader />;
    if (error) return <div className="text-center text-red-500 mt-8 p-4 bg-red-100 rounded-lg">{error}</div>;
    // Show a loading message if chatRoomId is not yet available
    if (!chatRoomId) return <div className="text-center text-gray-500 mt-8">Initializing chat...</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="bg-white rounded-lg shadow-xl p-6 border border-gray-200">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
                    Teacher-Student Chat Room
                </h2>

                {/* Connection Status / Info */}
                <div className="mb-4 text-center text-sm font-medium">
                    {isConnected ? (
                        <span className="text-green-600 flex items-center justify-center space-x-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            Connected to Chat
                        </span>
                    ) : (
                        <span className="text-red-500 flex items-center justify-center space-x-2">
                            <span className="relative flex h-3 w-3">
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            Connecting...
                        </span>
                    )}
                </div>

                {/* User Identity Display - Removed ID display */}
                {currentUserId && currentUserName && (
                    <div className="flex items-center justify-center mb-4 text-gray-700 text-lg font-semibold">
                        <FaUserCircle className="text-blue-500 mr-2 text-2xl" />
                        You are: <span className="ml-1 text-blue-700">{currentUserName}</span>
                    </div>
                )}

                {/* Messages Display Area */}
                <div className="bg-gray-50 border border-gray-300 rounded-lg px-2 py-4 h-96 overflow-y-auto mb-4 custom-scrollbar flex flex-col">
                    {messages.length === 0 ? (
                        <p className="text-gray-500 text-center italic py-10">No messages yet. Start the conversation!</p>
                    ) : (
                        messages.map((msg, index) => (
                            <div
                                key={msg.id || index} // Use msg.id if available, otherwise index (for newly sent messages)
                                className={`
                                    message mb-3 p-3 rounded-lg max-w-[80%] w-fit
                                    ${getMessageAlignment(msg, currentUserId)}
                                `}
                            >
                                <div className="font-semibold text-sm mb-1 opacity-90">
                                    {/* Display sender name from message, or "You" if it's the current user */}
                                    {((msg.senderId === currentUserId || msg.SenderId === currentUserId) ? currentUserName : (msg.senderName || msg.SenderName || 'Other User'))}
                                    <span className="text-xs font-normal ml-2 opacity-70">
                                        {new Date(msg.timestamp || msg.Timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-base">{msg.content || msg.Content}</p>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} /> {/* For auto-scrolling */}
                </div>

                {/* Message Input Section */}
                <div className="flex gap-3">
                    <input
                        type="text"
                        id="messageInput"
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        placeholder="Type your message here..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                sendMessage();
                            }
                        }}
                        disabled={!isConnected} // Disable input if not connected
                    />
                    <button
                        id="sendButton"
                        onClick={sendMessage}
                        className={`
                            bg-blue-600 text-white p-3 rounded-lg shadow-md
                            hover:bg-blue-700 hover:shadow-lg
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75
                            transition-all duration-300 ease-in-out
                            flex items-center justify-center space-x-2
                            ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                        disabled={!isConnected} // Disable button if not connected
                    >
                        <FaPaperPlane className="text-xl" />
                        <span className="hidden md:inline">Send</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TChatRoom;
