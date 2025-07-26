from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from cli.input_handler import run_terminal_prompt, exit_flag
import threading
from contextlib import asynccontextmanager
import os
import signal
from typing import AsyncGenerator


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

# global variables
current_plugin = {"name": None}
shell_type = ""


@app.get("/")
def root():
    return {}


@app.post("/chat")
async def chat_endpoint(chat: ChatMessage):
    if chat.message.strip().lower() in ["exit", "quit"]:
        exit_flag.set()  # stop the CLI loop
        os.kill(os.getpid(), signal.SIGINT)  # kill the FastAPI server
        return StreamingResponse(
            iter(["data: Shutting down...\n\n"]),
            media_type="text/event-stream"
        )

    if current_plugin["name"] == "Smart File Generator":
        from plugins.smart_file_generator.smart_file_generator import generate_response
    elif current_plugin["name"] == "Terminal Tutor":
        from plugins.terminal_tutor.terminal_tutor import generate_response
    else:
        return StreamingResponse(
            iter(["data: Error: No plugin selected.\n\n"]),
            media_type="text/event-stream"
        )

    async def event_stream() -> AsyncGenerator[str, None]:
        async for chunk in generate_response(chat.message, shell_type):
            yield f"data: {chunk}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@app.get("/plugins")
async def get_plugins():
    return {"plugins": ["Smart File Generator", "Terminal Tutor"]}


@app.post("/set_plugin")
def set_plugin(data: dict):
    plugin_name = data.get("plugin")
    current_plugin["name"] = plugin_name
    print(f"Plugin set to: {plugin_name}")
    return {"status": "ok", "plugin": plugin_name}


@app.post("/set_shell_type")
def set_shell_type(data: dict):
    global shell_type
    shell_type = data.get("shell_type")
    return {"status": "ok", "shell_type": shell_type}