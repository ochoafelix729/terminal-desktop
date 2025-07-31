const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    sendInput: (data) => ipcRenderer.send("terminal-input", data),
    onOutput: (callback) => ipcRenderer.on("terminal-output", (_, msg) => callback(msg)),
    getHomeDir: () => ipcRenderer.invoke("get-home-dir"),
    readDir: (path) => ipcRenderer.invoke("read-dir", path),
    joinPath: (...paths) => ipcRenderer.invoke("join-path", ...paths)
});
