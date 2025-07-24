import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ChatInterface.css";

const ChatInterface = ({ setExternalMessage }) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setIsLoading(true);

    const newUserMessage = { sender: "user", text: message };
    setChatHistory((prev) => [...prev, newUserMessage]);

    try {
      const res = await axios.post("http://127.0.0.1:8000/chat", {
        message: message,
      });

      const newBotMessage = {
        sender: "bot",
        text: res.data.response,
        action: res.data.action,
      };
      setChatHistory((prev) => [...prev, newBotMessage]);

      if (res.data.action === "exit") {
        window.close();
      }
    } catch (err) {
      const errorMsg = { sender: "bot", text: "Error: " + err.message };
      setChatHistory((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    if (setExternalMessage) {
      setExternalMessage((newVal) => {
        setMessage(newVal);
        inputRef.current?.focus();
      });
    }
  }, [setExternalMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  return (
    <div className="chat-container">
      <div className="messages">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`message-bubble ${msg.sender}`}>
            <div className="message-text">{msg.text}</div>
            {msg.sender === "bot" && msg.action && (
                <div className="action-buttons">
                    <button
                        className="accept-btn"
                        onClick={() => {
                            if (window.electronAPI && msg.text) {
                            window.electronAPI.sendInput(msg.text + "\n");
                            } else {
                            console.warn("electronAPI or message text not available");
                            }
                        }}
                    >
                        Accept
                    </button>
                    <button className="decline-btn"
                        onClick={() => {
                            setChatHistory((prev) =>
                              prev.map((msgItem, i) =>
                                i === index
                                  ? { ...msgItem, text: "❌ You declined the suggestion.", action: null }
                                  : msgItem
                              )
                            );
                        }}
                    >  
                        Decline
                    </button>
                </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <textarea
          className="chat-input" 
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          disabled={isLoading}
        />
        <button onClick={sendMessage} disabled={isLoading || !message.trim()}>
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
