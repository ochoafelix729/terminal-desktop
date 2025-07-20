const { contextBridge, ipcRenderer } = require("electron");

console.log("Preload script is loading..."); // Debug line

contextBridge.exposeInMainWorld("electronAPI", {
    sendInput: (data) => ipcRenderer.send("terminal-input", data),
    onOutput: (callback) => ipcRenderer.on("terminal-output", (_, msg) => callback(msg))
});

console.log("electronAPI exposed to window"); // Debug line