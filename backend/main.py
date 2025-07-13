from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from cli.input_handler import run_terminal_prompt, exit_flag
from plugins.smart_file_generator.smart_file_generator import generate_response
import threading
from contextlib import asynccontextmanager
import os
import signal


@asynccontextmanager
async def lifespan(app: FastAPI):
    cli_thread = threading.Thread(target=run_terminal_prompt, daemon=True)
    cli_thread.start()

    try:
        yield
    finally:
        exit_flag.set()
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

    if chat.message.strip().lower() in ["exit", "quit"]:
        exit_flag.set() # stop the CLI loop
        os.kill(os.getpid(), signal.SIGINT) # kill the FastAPI server
        return {"response": "Shutting down...", "action": "exit"}

    response = await generate_response(chat.message)
    return {"response": response, "action": "response_generated"}

@app.get("/plugins")
async def get_plugins():
    return {"plugins": ["smart_file_generator", "terminal_tutor"]}