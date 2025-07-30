import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import "./ChatInterface.css";

const ChatInterface = ({ setExternalMessage, showActionButtons = true }) => {
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
      const res = await fetch("http://127.0.0.1:8001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let botMessage = { sender: "bot", text: "", isStreamComplete: false, declined: false };
      setChatHistory((prev) => [...prev, botMessage]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const clean = chunk.replace(/^data:\s*/gm, "").replace(/\n\n/g, "");
        
        // Check for formatting replacement signal
        if (clean.includes("__REPLACE_WITH_FORMATTED__")) {
          const formattedContent = clean.split("__REPLACE_WITH_FORMATTED__")[1];
          botMessage.text = formattedContent;
        } else {
          botMessage.text += clean;
        }
      
        setChatHistory((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { ...botMessage };
          return updated;
        });
      }
      botMessage.isStreamComplete = true;
      setChatHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...botMessage };
        return updated;
      });
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
        inputRef.current?.focus({ preventScroll: true });
      });
    }
  }, [setExternalMessage]);

  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [chatHistory]);

  return (
    <div className="chat-container">
      <div className="messages">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`message-bubble ${msg.sender}`}>
            <div className="message-text" dangerouslySetInnerHTML={{ __html: msg.text }} />
            {msg.sender === "bot" && showActionButtons && msg.isStreamComplete && !msg.declined && (
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
                                  ? { ...msgItem, text: "❌ You declined the suggestion.", declined: true }
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
