//│   ├── MeetingChat.jsx               // Handles the chat input and message display
//This component will provide the text-based communication within your meeting. Participants will be able to type comments and see messages sent by others.


import React, { useEffect, useRef } from 'react'

function MeetingChat() {

    comst [currentMessage, setCurrentMessage] = useState('');
    // The 'messages' array from useMeeting contains all data messages received on the meeting.
    //  // By default, it will include messages sent via `publish('CHAT', ...)`
    const { publish, messages: receivedMessages } = useMeeting(); // 'publish' sends messages, 'messages' array holds received ones.

    const chatContainerRef = useRef(null); //// Ref to scroll chat to bottom

     // Effect to scroll to the bottom of the chat when new messages send
     useEffect(()=>{
        if(chatContainerRef.current){
            chatContainerRef.current.scrollTop= chatContainerRef.current.scrollHeight;
        }
     },[receivedMessages]) // Trigger when receivedMessages array changes

     const sendMessage=()=>{
        if( currentMessage.trim()){
            // 'publish' method sends a data message to all participants in the meeting.
            // "CHAT" is a custom topic name you define.
            // The second argument is the message content.
            // { persist: true } ensures the message is available to participants who join later.
            publish("CHAT", currentMessage,{persist:true})
            setCurrentMessage('');
        }
     }

    const handleKeyPress = (e)=>{
        if(e.key==="Enter"){
            sendMessage();
        }
    }

    return <>
            <div style={{
                marginTop: '20px',
                width: '100%',
                maxWidth: '400px', // Limit chat width
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box' // Include padding in width calculation
                }}>
                <h4 style={{ margin: '0 0 10px', color: '#333' }}>Meeting Chat</h4>
                <div
                    ref={chatContainerRef}
                    style={{
                    height: '250px', // Fixed height for chat messages
                    overflowY: 'auto', // Enable vertical scrolling
                    border: '1px solid #eee',
                    borderRadius: '5px',
                    padding: '10px',
                    backgroundColor: '#f9f9f9',
                    marginBottom: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                    }}
                >
                    {/* Map over the received messages and display them */}
                    {receivedMessages.map((msg, index) => {
                    // Each message object has 'senderName', 'message', 'id', 'timestamp'
                    return (
                        <div key={index} style={{
                        backgroundColor: '#e6f7ff',
                        padding: '8px 12px',
                        borderRadius: '5px',
                        wordBreak: 'break-word' // Handle long words
                        }}>
                        <strong style={{ color: '#0056b3' }}>{msg.senderName || "Unknown"}:</strong> {msg.message}
                        </div>
                    );
                    })}
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your comment..."
                    style={{
                        flexGrow: 1, // Allow input to take available space
                        padding: '10px',
                        fontSize: '1em',
                        border: '1px solid #ddd',
                        borderRadius: '5px'
                    }}
                    />
                    <button
                    onClick={sendMessage}
                    style={{
                        padding: '10px 15px',
                        fontSize: '1em',
                        cursor: 'pointer',
                        borderRadius: '5px',
                        border: 'none',
                        backgroundColor: '#007bff',
                        color: 'white'
                    }}
                    >
                    Send
                    </button>
                </div>
            </div>
    </>
}
export default MeetingChat