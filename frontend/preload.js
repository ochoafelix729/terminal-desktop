const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    sendInput: (data) => ipcRenderer.send("terminal-input", data),
    onOutput: (callback) => ipcRenderer.on("terminal-output", (_, msg) => callback(msg))
});
