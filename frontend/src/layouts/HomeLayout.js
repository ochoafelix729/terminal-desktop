import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import TerminalUI from "../components/TerminalUI";
import "./HomeLayout.css";

const HomeLayout = () => {
  const navigate = useNavigate();

  const plugins = [
    { name: "Smart File Generator", path: "/smart-file-generator" },
    { name: "Terminal Tutor", path: "/terminal-tutor" },
    { name: "Plugin 3", path: "/plugin3" },
    { name: "Plugin 4", path: "/plugin4" }
  ];

  return (
    <div className="layout-container">
      <div className="side-panel">
        {plugins.map((plugin, idx) => (
          <button key={idx} onClick={() => navigate(plugin.path)}>{plugin.name}</button>
        ))}
      </div>

      <div className="terminal-wrapper">
        <TerminalUI />
      </div>

      <div className="plugin-content">
        <Outlet /> {/* Nested route plugin renders here */}
      </div>
    </div>
  );
};

export default HomeLayout;
