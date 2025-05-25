import React, { useState, useRef, useEffect } from 'react';
import { chatbotService } from '../../services/chatbotService';
import './Chatbot.css';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMessage = inputMessage.trim();
        setInputMessage('');
        setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
        setIsLoading(true);

        try {
            const response = await chatbotService.sendMessage(userMessage);
            setMessages(prev => [...prev, { text: response.response, sender: 'bot' }]);
        } catch (error) {
            setMessages(prev => [...prev, { 
                text: 'Sorry, I encountered an error. Please try again.', 
                sender: 'bot' 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <button 
                className="chatbot-toggle-button"
                onClick={toggleChat}
                title="Chat with AI Assistant"
            >
                <i className="fas fa-robot"></i>
            </button>
            
            {isOpen && (
                <div className="chatbot-container">
                    <div className="chatbot-header">
                        <h3>AI Assistant</h3>
                        <button 
                            className="close-button"
                            onClick={toggleChat}
                            title="Close chat"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <div className="chatbot-messages">
                        {messages.map((message, index) => (
                            <div 
                                key={index} 
                                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
                            >
                                {message.text}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message bot-message loading">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="chatbot-input">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Type your message..."
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !inputMessage.trim()}>
                            Send
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default Chatbot; 