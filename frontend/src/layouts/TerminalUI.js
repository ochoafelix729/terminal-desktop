import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

const TerminalUI = () => {
  if (!window.electronAPI) {
    console.error("electronAPI not available - preload script may not be loaded");
    return null;
  }

  const terminalRef = useRef(null);
  const cwdRef = useRef("");
  const linkIdsRef = useRef([]);
  const commandBuffer = useRef("");

  const registerLinks = (term, entries) => {
    // Remove existing link matchers
    linkIdsRef.current.forEach(id => term.deregisterLinkMatcher(id));
    linkIdsRef.current = [];

    entries.forEach(entry => {
      const regex = new RegExp(`\\b${entry.name}\\b`, "g");
      const id = term.registerLinkMatcher(regex, () => {
        window.electronAPI.sendInput(`cd \"${entry.name}\"\n`);
      }, { matchIndex: 0, tooltipCallback: () => {}, leaveCallback: () => {} });
      linkIdsRef.current.push(id);
    });
  };

  const handleCd = async (term, path) => {
    const newPath = await window.electronAPI.joinPath(cwdRef.current, path);
    const list = await window.electronAPI.readDir(newPath);
    cwdRef.current = newPath;
    registerLinks(term, list);
  };

  useEffect(() => {
    const term = new Terminal({ cursorBlink: true, convertEol: true });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    (async () => {
      const home = await window.electronAPI.getHomeDir();
      cwdRef.current = home;
      const list = await window.electronAPI.readDir(home);
      registerLinks(term, list);
    })();

    term.onData(data => {
      window.electronAPI.sendInput(data);
      if (data === "\r") {
        const cmd = commandBuffer.current.trim();
        if (cmd.startsWith("cd ")) {
          const arg = cmd.substring(3).trim();
          handleCd(term, arg);
        } else if (cmd === "cd ..") {
          handleCd(term, "..");
        }
        commandBuffer.current = "";
      } else if (data === "\u0003") {
        commandBuffer.current = "";
      } else {
        commandBuffer.current += data;
      }
    });

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
        overflow: "auto",
        flex: 1
      }}
    />
  );
};

export default TerminalUI;
