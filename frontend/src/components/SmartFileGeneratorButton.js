import React from "react";
import ChatInterface from "./ChatInterface";

const SmartFileGeneratorButton = () => {
  const examplePrompt = "Create a folder named 'Reports' with a README.md file.";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ marginBottom: "1rem" }}>
        <div className="example-prompt-box">{examplePrompt}</div>
      </div>
  
      <div style={{ marginTop: "auto" }}>
        <ChatInterface />
      </div>
    </div>
  );
};

export default SmartFileGeneratorButton;