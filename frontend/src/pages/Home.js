import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"

const Home = () => {
  const navigate = useNavigate();

  const plugins = [
    { name: "Smart File Generator", path: "/smartfilegenerator" },
    { name: "Plugin 2", path: "/plugin2" },
    { name: "Plugin 3", path: "/plugin3" },
    { name: "Plugin 4", path: "/plugin4" }
  ];

  return (
    <div className="container">
      <h1 className="title">Terminal Copilot</h1>
      <div className="grid">
        {plugins.map((plugin, idx) => (
          <button key={idx} className="button" onClick= {() => navigate(plugin.path)}>
            {plugin.name}
          </button>
        ))}
      </div>
    </div>
  );
};
export default Home;