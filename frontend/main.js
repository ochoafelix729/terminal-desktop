const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("path");
const pty = require("node-pty");
const axios = require("axios");

let win;
let shell;
let debug = true;

app.whenReady().then(() => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    width,
    height,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:3001');
    if (debug === true) {
      win.webContents.openDevTools();
    }
  } else {
    win.loadFile('build/index.html');
  }

  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.log('Failed to load:', errorCode, errorDescription);
  });


  const shellByOS = {
    win32: "powershell.exe",  // Windows
    darwin: "zsh",            // macOS
    linux: "bash",            // Linux (most distros)
    freebsd: "sh",            // FreeBSD (minimal shell)
    openbsd: "sh",            // OpenBSD (like FreeBSD)
    aix: "sh",                // IBM AIX systems
    sunos: "sh"               // Solaris
  };

  const platform = process.platform;
  const shellType = shellByOS[platform] || "zsh" // default fallback to zsh

  shell = pty.spawn(shellType, [], {
    name: "xterm-color",
    cols: 80,
    rows: 30,
    cwd: process.env.HOME,
    env: process.env
  })

  // send PTY output to frontend
  shell.onData(data => {
    win.webContents.send("terminal-output", data);
  })

  // receive user input from frontend
  ipcMain.on("terminal-input", (event, input) => {
    shell.write(input);
  });
  
  axios.post("http://127.0.0.1:8001/set_shell_type", {shell_type: shellType});
  


});
