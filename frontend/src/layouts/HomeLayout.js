import { React, useState, useRef, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import TerminalUI from "./TerminalUI";
import SmartFileGenerator from "../plugins/SmartFileGenerator";
import TerminalTutor from "../plugins/TerminalTutor";
import Plugin3 from "../plugins/Plugin3";
import Plugin4 from "../plugins/Plugin4";
import "./HomeLayout.css";
import "../plugins/PluginButtons.css";
import LeftSideBar from "../components/LeftSideBar";
import "../components/LeftSideBar.css";


const HomeLayout = () => {

  const [activePlugin, setActivePlugin] = useState(null);
  const terminalPaneRef = useRef(null);
  const copilotPanelRef = useRef(null);

  useEffect(() => {
    if (!copilotPanelRef.current || !terminalPaneRef.current) {
      console.error("References to copilotPanel or terminalPane are not initialized.");
      return;
    }
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
      <div ref={copilotPanelRef} className="copilot-panel">
        <div className="left-sidebar">
          <LeftSideBar />
        </div>
        <div className="plugin-section">
          {plugins.map((plugin, idx) => (
            <button
              key={idx}
              className={`plugin-button ${activePlugin === plugin.name ? "active" : ""}`}
              onClick={() => handlePluginClick(plugin.name)}
            >
              {plugin.name}
            </button>
          ))}
          <div className="plugin-ui">
            {renderPluginSidebar()}
          </div>
        </div>
      </div>
      <div ref={terminalPaneRef} className="terminal-pane">
        <TerminalUI />
      </div>
    </div>
  );
};

export default HomeLayout;
