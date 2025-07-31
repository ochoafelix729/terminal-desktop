import React, { useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import GeneralPreferences from "./settings/GeneralPreferences";
import PrivacySecurity from "./settings/PrivacySecurity";
import PluginSettings from "./settings/PluginSettings";
import "./Settings.css";

const Settings = () => {
  const location = useLocation();
  const activeTab = useMemo(() => {
    const last = location.pathname.split("/").pop();
    return last || "general";
  }, [location.pathname]);

  return (
    <div className="settings-container">
      <aside className="settings-sidebar">
        <ul>
          <li>
            <NavLink end to="general" replace preventScrollReset>
              ⚙️ General Preferences
            </NavLink>
          </li>
          <li>
            <NavLink to="privacy" replace preventScrollReset>
              🔒 Privacy &amp; Security
            </NavLink>
          </li>
          <li>
            <NavLink to="plugins" replace preventScrollReset>
              🔌 Plugin Settings
            </NavLink>
          </li>
        </ul>
      </aside>
      <main className="settings-content">
        <div className={activeTab === "general" ? "" : "hidden"}>
          <GeneralPreferences />
        </div>
        <div className={activeTab === "privacy" ? "" : "hidden"}>
          <PrivacySecurity />
        </div>
        <div className={activeTab === "plugins" ? "" : "hidden"}>
          <PluginSettings />
        </div>
      </main>
    </div>
  );
};

export default Settings;
