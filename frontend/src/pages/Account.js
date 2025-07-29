
import React, { useEffect, useState } from "react";
import "./Account.css";

const Account = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8001/account");
        const json = await res.json();
        if (json.status === "ok") {
          setData(json);
        }
      } catch (err) {
        console.error("Failed to fetch account info", err);
      }
    };
    fetchData();
  }, []);

  if (!data) {
    return <div className="account-page">Loading...</div>;
  }

  return (
    <div className="account-page">
      <h2>Account Info</h2>
      <p>
        <strong>Username:</strong> {data.username}
      </p>
      <p>
        <strong>Email:</strong> {data.email || "N/A"}
      </p>

      <h3>Conversation History (Last 30 Days)</h3>
      <ul className="conversation-list">
        {data.conversations.map((c, i) => (
          <li key={i} className="conversation-item">
            <div>
              <strong>Date:</strong>{" "}
              {new Date(c.date_time).toLocaleString()}
            </div>
            <div>
              <strong>Plugin:</strong> {c.selected_plugin}
            </div>
            <div>
              <strong>Q:</strong> {c.question}
            </div>
            <div>
              <strong>A:</strong> {c.response}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Account;
