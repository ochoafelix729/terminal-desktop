import React from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import GeneralPreferences from "./settings/GeneralPreferences";
import PrivacySecurity from "./settings/PrivacySecurity";
import PluginSettings from "./settings/PluginSettings";
import "./Settings.css";

const Settings = () => {
  return (
    <div className="settings-container">
      <aside className="settings-sidebar">
        <ul>
          <li>
            <NavLink end to="general">
              ⚙️ General Preferences
            </NavLink>
          </li>
          <li>
            <NavLink to="privacy">
              🔒 Privacy &amp; Security
            </NavLink>
          </li>
          <li>
            <NavLink to="plugins">
              🔌 Plugin Settings
            </NavLink>
          </li>
        </ul>
      </aside>
      <main className="settings-content">
        <Routes>
          <Route path="/" element={<GeneralPreferences />} />
          <Route path="general" element={<GeneralPreferences />} />
          <Route path="privacy" element={<PrivacySecurity />} />
          <Route path="plugins" element={<PluginSettings />} />
        </Routes>
      </main>
    </div>
  );
};

export default Settings;
