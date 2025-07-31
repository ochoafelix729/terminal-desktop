const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("path");
const pty = require("node-pty");
const axios = require("axios");

let win;
let shell;

let inputBuffer = "";
let lastCommand = "";
let lsBuffer = "";
let lsTimeout = null;
let lastLsFiles = [];

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
    win.loadURL(`http://localhost:${process.env.PORT}`);
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

  const stripAnsi = (str) =>
    str.replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, "");
  
  const parseLsOutput = (rawLines) => {
    return rawLines
      .flatMap((line) =>
        stripAnsi(line)
          .split("\t") // handle tabbed columns from `ls`
          .map((name) => name.trim())
      )
      .filter(
        (entry) =>
          entry !== "" &&
          !entry.startsWith("ochoa@") &&
          !entry.endsWith("%") &&
          !entry.includes("~") &&
          !entry.includes(".pyc") &&
          !entry.includes("ls") // skip echoed commands
      );
  };

  // send PTY output to frontend
  shell.onData(data => {
  win.webContents.send("terminal-output", data);

  if (lastCommand.startsWith("ls")) {
    lsBuffer += data;

    if (lsTimeout) clearTimeout(lsTimeout);
    lsTimeout = setTimeout(() => {
      const parsedFiles = parseLsOutput(lsBuffer.split(/\r?\n/));
      lastLsFiles = [...parsedFiles];
      console.log("Sending ls-files-output:", parsedFiles);
      win.webContents.send("ls-files-output", parsedFiles);

      // Reset buffers
      lsBuffer = "";
      lastCommand = "";
    }, 100); // allow time for all data chunks
  }
});

  // receive user input from frontend
  ipcMain.on("terminal-input", (event, input) => {
    shell.write(input);

    inputBuffer += input;

    if (input === "\r" || input === "\n") {
      lastCommand = inputBuffer.trim(); // e.g., "ls"
      inputBuffer = ""; // reset for next command
      console.log("Detected full command:", lastCommand);
    }
  });

  ipcMain.handle("get-last-ls-files", () => {
    console.log(lastLsFiles)
    return lastLsFiles;
  });
  
  axios.post("http://127.0.0.1:8001/set_shell_type", {shell_type: shellType});
  


});
