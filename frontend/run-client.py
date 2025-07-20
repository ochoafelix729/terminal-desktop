import os
import subprocess
import signal
import sys
import time
import requests

os.environ["PORT"] = "3001"
os.environ["NODE_ENV"] = "development"
react_process = None
electron_process = None

def signal_handler(sig, frame):
    if react_process:
        react_process.terminate()
        try:
            react_process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            print("Force killing frontend process...")
            react_process.kill()
    sys.exit(0)

def wait_for_react_server(port=3001, timeout=60):
    print(f"Waiting for React dev server on port {port}...")
    start_time = time.time()
    
    while time.time() - start_time < timeout:
        try:
            response = requests.get(f"http://localhost:{port}", timeout=2)
            if response.status_code == 200:
                print("React dev server is ready!")
                return True
        except (requests.exceptions.RequestException, requests.exceptions.ConnectionError):
            time.sleep(1)
    
    print("Timeout waiting for React dev server")
    return False

signal.signal(signal.SIGINT, signal_handler)

# startup block
try:
    print("Starting React dev server...")
    react_process = subprocess.Popen(
        ["npm", "run", "react-dev"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.STDOUT
    )

    if not wait_for_react_server():
        print("Failed to start React dev server")
        sys.exit(1)

    print("Launching Electron app...")
    electron_process = subprocess.Popen(["npm", "run", "electron-dev"])
    electron_process.wait()

except subprocess.CalledProcessError as e:
    print("Failed to start application:", e)
    sys.exit(1)

except KeyboardInterrupt:
    print("Interrupted by user")
    signal_handler(signal.SIGINT, None)

except Exception as e:
    print(f"Unexpected error: {e}")
    sys.exit(1)

