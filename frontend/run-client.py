import os
import subprocess

os.environ["PORT"] = "3000"
try:
    print("Launching frontend (React + Electron)...")
    subprocess.run(["npm", "run", "react-dev"], check=True)
except subprocess.CalledProcessError as e:
    print("Failed to start frontend:", e)