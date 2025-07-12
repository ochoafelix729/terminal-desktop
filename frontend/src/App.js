import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newUserMessage = { sender: "user", text: message };
    setChatHistory(prev => [...prev, newUserMessage]);

    try {
      const res = await axios.post("http://127.0.0.1:8000/chat", {
        message: message,
      });

      const newBotMessage = { sender: "bot", text: res.data.message };
      setChatHistory(prev => [...prev, newBotMessage]);

    } catch (err) {
      const errorMsg = { sender: "bot", text: "Error: " + err.message };
      setChatHistory(prev => [...prev, errorMsg]);
    }

    setMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);
  

  return (
    <div className="container">
      <div className="chat-box">
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.sender}`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <input
          type="text"
          className="input-field"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="send-button" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default App;