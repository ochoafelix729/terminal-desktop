#!/usr/bin/env python3

import subprocess

command = ["uvicorn", "uvicorn main:app --reload"]

subprocess.run(command)

