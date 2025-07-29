import React from "react";
import "./LeftSideBar.css";


const LeftSideBar = () => {
    return (
      <nav className="left-sidebar-nav">
        <ul className="sidebar-icon-list">
          {/* Future icons will go here */}
          <li className="sidebar-icon-item">
            <button
              className="sidebar-icon-button"
              aria-label="Icon placeholder"
            />
          </li>
          <li className="sidebar-icon-item">
            <button
              className="sidebar-icon-button"
              aria-label="Icon placeholder"
            />
          </li>
          <li className="sidebar-icon-item">
            <button
              className="sidebar-icon-button"
              aria-label="Icon placeholder"
            />
          </li>
        </ul>
      </nav>
    );
  };

export default LeftSideBar;