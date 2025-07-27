from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import os
import signal
from typing import AsyncGenerator



app = FastAPI()

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