from plugins.shared_plugin_functions import query_llm, read_prompt_file
import asyncio
import os
from typing import AsyncGenerator

prompt_file = "terminal_tutor_prompt.txt"
prompt_path = os.path.join(os.path.dirname(__file__), prompt_file)

async def generate_response(message: str, shell_type: str) -> AsyncGenerator[str, None]:
    system_prompt = read_prompt_file(prompt_path).replace("{shellType}", shell_type)
    async for chunk in query_llm(message=message, system_prompt=system_prompt):
        yield chunk