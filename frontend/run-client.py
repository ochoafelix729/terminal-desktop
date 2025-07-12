import os
import subprocess

os.environ["PORT"] = "3000"
subprocess.run(["npm", "start"])