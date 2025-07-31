import React from "react";
import { useNavigate } from "react-router-dom";
import "./LeftSideBar.css";

const LeftSideBar = () => {
    const Navigate = useNavigate();

    return (
        <div className="left-sidebar-container">
            <ul className="sidebar-icon-list">
                <li className="icon-button">
                    <button
                        className="icon-button button"
                        onClick={() => {Navigate("/settings")}}
                    >
                        ⚙️ Settings
                    </button>
                </li>
                <li className="icon-button"> 
                    <button
                        className="icon-button button"
                        onClick={() => {Navigate("/history")}}
                    >
                        🕘 History
                    </button>
                </li>
                <li className="icon-button">
                    <button
                        className="icon-button button"
                        onClick={() => {Navigate("/create")}}
                    >
                        🛠️ Create
                    </button>
                </li>
            </ul>
        </div>
        
    );
};

export default LeftSideBar;