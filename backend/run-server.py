import subprocess

subprocess.run(["uvicorn", "main:app", "--reload", "--port", "8000"])