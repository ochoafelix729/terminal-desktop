import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const sendMessage = async () => {
    try {
      setError("");
      setResponse("");
      const res = await axios.post("http://127.0.0.1:8000/submit", {
        message
      });
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (err) {
      setResponse("Error: " + err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Send a Message</h2>
      <input
        type="text"
        placeholder="Enter your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "80%", padding: 5 }}
      />
      <button onClick={sendMessage} style={{ marginLeft: 10 }}>
        Submit
      </button>

      {error && (
        <pre style={{ color: "red", marginTop: 20 }}>{error}</pre>
      )}

      {response && (
        <div style={{ marginTop: 30, padding: 10, border: "1px solid #ccc", borderRadius: 4 }}>
          <h3>Backend Response</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default App;