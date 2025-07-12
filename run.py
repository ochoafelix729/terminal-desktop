import subprocess
import os
import time

# Start backend server
backend = subprocess.Popen(["python", "run-server.py"], cwd="backend")

# Optional: wait for server to be ready (you can use health checks too)
time.sleep(2)

# Start frontend client
frontend = subprocess.Popen(["python", "run-client.py"], cwd="frontend")

try:
    frontend.wait()  # Keep main script alive while frontend runs
except KeyboardInterrupt:
    print("Shutting down...")
    backend.terminate()
    frontend.terminate()