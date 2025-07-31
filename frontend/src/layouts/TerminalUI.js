import React, { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

const TerminalUI = () => {

    if (!window.electronAPI) {
      console.error("electronAPI not available - preload script may not be loaded");
      return;
   }

    const terminalRef = useRef(null);

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
    
        term.focus();
        return () => term.dispose();
      }, []);

    return (
        <div
            ref={terminalRef}
            style={{
                width: "100%",
                height: "100%",
                position: "relative",
                overflow: "auto"
            }}
        />
    );
};

export default TerminalUI;