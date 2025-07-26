import { React, useState, useRef, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import TerminalUI from "../components/TerminalUI";
import SmartFileGenerator from "../components/SmartFileGenerator";
import TerminalTutor from "../components/TerminalTutor";
import Plugin3 from "../components/Plugin3";
import Plugin4 from "../components/Plugin4";
import "./HomeLayout.css";
import "../components/PluginButtons.css";


const HomeLayout = () => {

  const [activePlugin, setActivePlugin] = useState(null);
  const terminalPaneRef = useRef(null);
  const copilotPanelRef = useRef(null);

  useEffect(() => {
    if (!copilotPanelRef.current || !terminalPaneRef.current) {
      console.error("References to copilotPanel or terminalPane are not initialized.");
      return;
    }
  
    const handleResize = () => {
      const copilotWidth = copilotPanelRef.current.offsetWidth || 0;
      terminalPaneRef.current.style.width = `calc(100vw - ${copilotWidth}px)`;
    };
  
    // Initialize the width on mount
    handleResize();
  
    const observer = new ResizeObserver(() => {
      handleResize();
    });
  
    observer.observe(copilotPanelRef.current);
  
    return () => {
      observer.disconnect();
    };
  }, []);

  const plugins = [
    { name: "Smart File Generator", path: "/smart-file-generator" },
    { name: "Terminal Tutor", path: "/terminal-tutor" },
    { name: "Plugin 3", path: "/plugin3" },
    { name: "Plugin 4", path: "/plugin4" }
  ];

  const handlePluginClick = async (pluginName) => {
    try {
      await axios.post("http://127.0.0.1:8001/set_plugin", { plugin: pluginName });
      setActivePlugin(pluginName);
    } catch (err) {
      console.error("Failed to set plugin:", err);
    }
  };

  const renderPluginSidebar = () => {

    if (!activePlugin) {
      return (
        <div className="plugin-placeholder">
          <div className="placeholder-icon">🧩</div>
          <h2>Select a Plugin</h2>
          <p>Choose a tool from above to get started.</p>
        </div>
      );
    }

    switch (activePlugin) {
      case "Smart File Generator":
        return <SmartFileGenerator />;
      case "Terminal Tutor":
        return <TerminalTutor />;
      case "Plugin 3":
        return <Plugin3 />;
      case "Plugin 4":
        return <Plugin4 />;
      default:
        return null;
    }
  };

  return (
    <div className="layout-container">
      <div className="copilot-panel">
        {plugins.map((plugin, idx) => (
          <button
            key={idx}
            className="plugin-button"
            onClick={() => handlePluginClick(plugin.name)}
          >
            {plugin.name}
          </button>
        ))}
        <div className="plugin-ui">
          {renderPluginSidebar()}
        </div>
      </div>
      <div className="terminal-pane">
        <TerminalUI />
      </div>
    </div>
  );
};

export default HomeLayout;
