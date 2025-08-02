import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import "./TerminalUI.css";

const TerminalUI = () => {

    if (!window.electronAPI) {
      console.error("electronAPI not available - preload script may not be loaded");
      return;
   }

    const terminalRef = useRef(null);
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        const term = new Terminal({ cursorBlink: true });
        const fitAddon = new FitAddon(); // responsive terminal size
    
        term.loadAddon(fitAddon);
        term.open(terminalRef.current);
        fitAddon.fit();
    
        // send user input to backend
        term.onData(data => {
          window.electronAPI.sendInput(data);
        });
    
        // render backend output in terminal
        window.electronAPI.onOutput(data => {
          term.write(data);
        });

        // handle `ls` file array
        window.electronAPI?.onLSFiles?.((_, files) => {
          setFileList([...files]);
        });

        const fetchLatestFiles = async () => {
          const files = await window.electronAPI?.getLastLsFiles?.();
          if (Array.isArray(files) && files.length > 0) {
            console.log("⏪ Initial fetch of files:", files);
            setFileList(files);
          }
        };

        fetchLatestFiles();
    
        term.focus();
        return () => term.dispose();
      }, []);

      return (
        <div className="terminal-wrapper">
          <div className="terminal-top">
            <div ref={terminalRef} className="terminal-pane" />
          </div>
          {fileList.length > 0 && (
            <div className="terminal-bottom">
              <div className="bottom-header">📁 Click a folder to navigate:</div>
              <div className="file-scroll-container">
                {fileList.map((file, idx) => (
                  <button
                    key={idx}
                    className="file-entry"
                    onClick={() => window.electronAPI.sendInput?.(`cd "${file}"\n`)}
                  >
                    {file}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      );
};

export default TerminalUI;