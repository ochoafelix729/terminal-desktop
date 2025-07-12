## Project Overview

This project shall be called Terminal Copilot. It shall provide an easier experience for users when handling their terminal on MacOS. This is similar to how Github Desktop makes it easier to manage git version control.

## Prerequisites

1. Create a new directory via Finder or Terminal where you want this project stored.
2. Clone Repository
- In your terminal navigate to your new project directory and type: ```git clone https://github.com/ochoafelix729/terminal-copilot.git```
3. Set up virtual environment
- In your project directory in your terminal, type: ```python3 -m venv venv```
- Now, activate the virtual environment by typing: ```source venv/bin/activate```

## Git Reference

- Delete remote branche after merging and deleting - ```git remote prune origin```
- Delete local branch - ```git branch -d <branch-name>```

## Tech Stack

- Frontend - React + Electron
- Backend - Python w/ FastAPI

## Data Flow

Frontend user (API request) -> main.py (API layer) -> 