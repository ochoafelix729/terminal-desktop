import React from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import GeneralPreferences from "./settings/GeneralPreferences";
import PrivacySecurity from "./settings/PrivacySecurity";
import PluginSettings from "./settings/PluginSettings";
import "./Settings.css";

const Settings = () => {
  return (
    <div className="settings-container">
      <nav className="settings-sidebar">
        <NavLink
          to="general"
          end
          className={({ isActive }) =>
            `settings-link${isActive ? " active" : ""}`
          }
        >
          ⚙️ General Preferences
        </NavLink>
        <NavLink
          to="privacy"
          className={({ isActive }) =>
            `settings-link${isActive ? " active" : ""}`
          }
        >
          🔒 Privacy &amp; Security
        </NavLink>
        <NavLink
          to="plugins"
          className={({ isActive }) =>
            `settings-link${isActive ? " active" : ""}`
          }
        >
          🔌 Plugin Settings
        </NavLink>
      </nav>
      <div className="settings-content">
        <Routes>
          <Route index element={<GeneralPreferences />} />
          <Route path="general" element={<GeneralPreferences />} />
          <Route path="privacy" element={<PrivacySecurity />} />
          <Route path="plugins" element={<PluginSettings />} />
        </Routes>
      </div>
    </div>
  );
};

export default Settings;
