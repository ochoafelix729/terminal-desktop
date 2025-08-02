import React, { useRef } from "react";
import ChatInterface from "../pages/ChatInterface";
import "./PluginButtons.css";

const SmartFileGenerator = () => {
  const examplePrompt = "Create a folder named 'Reports' with a README.md file.";
  const setExternalMessageRef = useRef(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="example-question-box">
        <span className="example-label">Example question:</span>
        <div className="example-row">
          <p className="example-text">{examplePrompt}</p>
          <button
            className="copy-btn"
            onClick={() => {
              if (setExternalMessageRef.current) {
                setExternalMessageRef.current(examplePrompt);
              }
            }}
          >
            Copy
          </button>
        </div>
      </div>

      <div style={{ marginTop: "auto" }}>
        <ChatInterface setExternalMessage={(setter) => {
          setExternalMessageRef.current = setter;
        }} />
      </div>
    </div>
  );
};

export default SmartFileGenerator;
