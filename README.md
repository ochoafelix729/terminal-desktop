## Project Overview

This project is called Terminal Desktop. It provides an easier experience for users when working with their terminal (works on all operating systems and shell types). This is similar to how Github Desktop makes it easier to manage git version control.

## Prerequisites

1. Create a new directory via Finder or Terminal where you want this project stored.
2. Clone Repository
- In your terminal navigate to your new project directory and type: ```git clone https://github.com/ochoafelix729/terminal-copilot.git```
3. Set up virtual environment
- In your project directory in your terminal, type: ```python3 -m venv venv```
- Now, activate the virtual environment by typing: ```source venv/bin/activate```
4. Install dependencies
- Once your virtual environment is active, type:
    - Windows - ```pip install -r requirements.txt & cd frontend & npm install & npx electron-rebuild```
    - MacOS - ```pip install -r requirements.txt && cd frontend && npm install && npx electron-rebuild```



## Project Architecture

- **backend/** - contains all backend files
    - **database/** - will contain any database related files (not set up yet)
    - **plugins/** - contains all plugin-related files
        - **smart_file_generator/** - folder for Smart File Generator plugin
            - **smart_file_generator.py** - sends query to LLM with its system prompt
            - **smart_file_generator_prompt.txt** - system prompt for Smart File Generator plugin
        - **terminal_tutor/** - folder for Terminal Tutor plugin
            - **terminal_tutor.py** - sends query to LLM with its system prompt
            - **terminal_tutor_prompt.txt** - system prompt for Terminal Tutor plugin
        - **shared_plugin_functions.py** - contains all shared functions used by plugins
    - **main.py** - API layer; includes all endpoints
    **run-server.py** - executable script that starts up the backend
- **frontend/** - contains all frontend files
    - **src/** - contains all source files
        - **components/** - contains general components
            - **ChatInterface.js** (API client) - handles all chat related actions
            - **TerminalUI.js** - handles terminal view; communicates with main.js to send and receive terminal I/O
        - **layouts/** - contains all layouts
            - **HomeLayout.js** (API client) - orchestrates side panel and terminal view logic
        - **plugins/** - contains all plugin components
            - **SmartFileGenerator.js** - Smart File Generator button and custom chat configurations
            - **TerminalTutor.js** - Terminal Tutor button and custom chat configurations
        - **App.js** - entry point for frontend (will become a router later)
        - **index.js** - React DOM entry point; renders App.js
    - **main.js** (API client) - enables shell environment; communicates with TerminalUI.js to send and receive terminal I/O
    - **package-lock.json** - locks the exacts versions of all npm dependencies
    - **package.json** - contains all npm dependencies, scripts, and metadata
    - **preload.js** - bridge between Electron main process and frontend
    - **run-client.py** - executable script that starts up the frontend
- **run.py** - executable script that starts both the backend and frontend
- **README.md** - touches on important info about project
- **requirements.txt** - contains all python modules necessary for the project
