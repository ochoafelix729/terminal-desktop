import subprocess

try:
    print("Launching backend...")
    subprocess.run(["uvicorn", "main:app", "--reload", "--port", "8000"])
except subprocess.CalledProcessError as e:
    print("Failed to start backend:", e)