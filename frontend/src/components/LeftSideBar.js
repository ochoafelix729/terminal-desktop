import { React } from "react";
import { useNavigate } from "react-router-dom";
import "./LeftSideBar.css";


const LeftSideBar = () => {

    const navigate = useNavigate();

    return (
      <nav className="left-sidebar-nav">
        <ul className="sidebar-icon-list">
          <li className="icon-button">
            <button 
                onClick={() =>{
                    navigate("/settings")
                }}
            >
                ⚙️ Settings
            </button>
          </li>
          <li className="icon-button">
            <button
                onClick={() =>{
                    navigate("/history")
                }}
            >
                🕘 History
            </button>
          </li>
          <li className="icon-button">
            <button
                onClick={() =>{
                    navigate("/create")
                }}
            >
                🛠️ Create
            </button>
          </li>
        </ul>
      </nav>
    );
  };

export default LeftSideBar;