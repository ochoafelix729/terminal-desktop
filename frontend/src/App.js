import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setIsLoading(true);

    const newUserMessage = { sender: "user", text: message };
    setChatHistory(prev => [...prev, newUserMessage]);

    try {
      const res = await axios.post("http://127.0.0.1:8000/chat", {
        message: message,
      });

      const newBotMessage = { 
        sender: "bot", 
        text: res.data.response,
        action: res.data.action 
      };
      setChatHistory(prev => [...prev, newBotMessage]);

      if (res.data.action === "exit") {
        // Handle exit action
        window.close();
      }
    } catch (err) {
      const errorMsg = { sender: "bot", text: "Error: " + err.message };
      setChatHistory(prev => [...prev, errorMsg]);
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  return (
    <div className="chat-container">
      <div className="messages">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <textarea
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

export default App;