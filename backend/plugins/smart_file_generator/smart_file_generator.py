from plugins.shared_plugin_functions import query_llm, read_prompt_file
import asyncio
import os

prompt_file = "smart_file_generator_prompt.txt"
prompt_path = os.path.join(os.path.dirname(__file__), prompt_file)

async def generate_response(message: str, shell_type: str) -> str:
    response = await query_llm(
        message=message,
        system_prompt=read_prompt_file(prompt_path).replace("{shellType}", shell_type)
    )
    return response