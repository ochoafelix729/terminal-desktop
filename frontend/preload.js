const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    sendInput: (data) => ipcRenderer.send("terminal-input", data),
    onOutput: (callback) => ipcRenderer.on("terminal-output", (_, msg) => callback(msg)),
    onLSFiles: (callback) => ipcRenderer.on("ls-files-output", callback),
    getLastLsFiles: () => ipcRenderer.invoke("get-last-ls-files"),
});
