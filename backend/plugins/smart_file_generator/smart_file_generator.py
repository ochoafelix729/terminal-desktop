from plugins.shared_plugin_functions import query_llm
import asyncio

system_prompt_template = "smart_file_generator/prompt.txt"

async def generate_response(message: str, shell_type: str) -> str:
    response = await query_llm(
        message=message,
        system_prompt=system_prompt_template.replace("{shell_type}", shell_type)
    )
    return response