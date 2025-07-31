import React, { useEffect, useState } from "react";
import "./FileNavigator.css";

const FileNavigator = () => {
    const [currentPath, setCurrentPath] = useState("");
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        const loadHome = async () => {
            if (!window.electronAPI || !window.electronAPI.getHomeDir) return;
            const home = await window.electronAPI.getHomeDir();
            setCurrentPath(home);
            const list = await window.electronAPI.readDir(home);
            setEntries(list);
        };
        loadHome();
    }, []);

    const navigateTo = async (name) => {
        const newPath = await window.electronAPI.joinPath(currentPath, name);
        window.electronAPI.sendInput(`cd "${name}"\n`);
        const list = await window.electronAPI.readDir(newPath);
        setCurrentPath(newPath);
        setEntries(list);
    };

    const goUp = async () => {
        const newPath = await window.electronAPI.joinPath(currentPath, "..");
        window.electronAPI.sendInput("cd ..\n");
        const list = await window.electronAPI.readDir(newPath);
        setCurrentPath(newPath);
        setEntries(list);
    };

    return (
        <div className="file-navigator">
            <div className="navigator-header">
                <button onClick={goUp}>Up</button>
                <span className="current-path">{currentPath}</span>
            </div>
            <ul className="file-list">
                {entries.map((entry, idx) => (
                    <li key={idx} className="file-item">
                        {entry.isDirectory ? (
                            <button onClick={() => navigateTo(entry.name)}>
                                {entry.name}/
                            </button>
                        ) : (
                            <span>{entry.name}</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FileNavigator;
