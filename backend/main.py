from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from cli.input_handler import run_terminal_prompt, exit_flag
import threading
from contextlib import asynccontextmanager
from collections import deque
import os
import signal

MESSAGE_QUEUE = deque()

@asynccontextmanager
async def lifespan(app: FastAPI):
    cli_thread = threading.Thread(target=run_terminal_prompt, daemon=True)
    cli_thread.start()

    try:
        yield
    finally:
        exit_flag.set()
        MESSAGE_QUEUE.clear()
        if cli_thread.is_alive():
            cli_thread.join(timeout=2.0)


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# pydantic model for user input - will expand later
class ChatMessage(BaseModel):
    message: str

@app.get("/")
def root():
    return {}


@app.post("/chat")
async def chat_endpoint(chat: ChatMessage):
    MESSAGE_QUEUE.append({"message": chat.message})

    if chat.message.strip().lower() in ["exit", "quit"]:
        exit_flag.set() # stop the CLI loop
        os.kill(os.getpid(), signal.SIGINT) # kill the FastAPI server
        return {"response": "Shutting down...", "action": "exit"}

    return {"response": f"Received: {chat.message}", "action": "none"}

@app.get("/poll")
async def poll_messages():
    messages = list(MESSAGE_QUEUE)
    MESSAGE_QUEUE.clear()
    return {"messages": messages}