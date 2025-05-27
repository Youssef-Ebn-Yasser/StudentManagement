// src/components/MeetingChat/MeetingChat.jsx
import React, { useEffect, useRef, useState } from 'react';

function MeetingChat({ messages: receivedMessages, publish }) {
    const [currentMessage, setCurrentMessage] = useState('');
    const chatContainerRef = useRef(null);

    // Effect to scroll to the bottom of the chat when new messages arrive
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [receivedMessages]); // Trigger when receivedMessages array changes

    const sendMessage = () => {
        if (currentMessage.trim()) {
            publish("CHAT", currentMessage, { persist: true });
            setCurrentMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <>
            <div style={{
                marginTop: '20px',
                width: '100%',
                maxWidth: '450px', // Slightly wider chat
                border: '1px solid #e0e0e0', // Lighter border
                borderRadius: '12px', // More rounded
                padding: '20px',
                backgroundColor: '#ffffff', // White background
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)', // Subtle shadow
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
                fontFamily: 'Inter, sans-serif'
            }}>
                <h4 style={{ margin: '0 0 15px', color: '#202124', fontSize: '1.4em', fontWeight: '600' }}>Meeting Chat</h4>
                <div
                    ref={chatContainerRef}
                    style={{
                        height: '300px', // Taller chat window
                        overflowY: 'auto', // Enable vertical scrolling
                        border: '1px solid #f0f0f0', // Very light border
                        borderRadius: '8px',
                        padding: '15px',
                        backgroundColor: '#f8fafd', // Very light blue background
                        marginBottom: '15px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                    }}
                >
                    {receivedMessages.map((msg, index) => {
                        const senderName = msg.senderName;
                        const messageContent = msg.message;
                        const messageType = msg.type;

                        if (messageType === 'CHAT' && messageContent) {
                            return (
                                <div key={index} style={{
                                    backgroundColor: '#e8f0fe', // Light blue for messages
                                    padding: '10px 15px',
                                    borderRadius: '8px',
                                    wordBreak: 'break-word', // Handle long words
                                    fontSize: '0.95em',
                                    color: '#3c4043',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                }}>
                                    <strong style={{ color: '#1a73e8' }}>{senderName || "Unknown"}:</strong> {messageContent}
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        style={{
                            flexGrow: 1, // Allow input to take available space
                            padding: '12px 15px',
                            fontSize: '1em',
                            border: '1px solid #dadce0',
                            borderRadius: '8px',
                            outline: 'none',
                            boxSizing: 'border-box',
                            transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
                        }}
                    />
                    <button
                        onClick={sendMessage}
                        style={{
                            padding: '12px 20px',
                            fontSize: '1em',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#4285f4', // Google Blue
                            color: 'white',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                            transition: 'background-color 0.3s ease'
                        }}
                    >
                        Send
                    </button>
                </div>
            </div>
        </>
    );
}
export default MeetingChat;