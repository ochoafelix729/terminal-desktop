from plugins.shared_plugin_functions import query_llm
import asyncio

async def generate_response(message: str) -> str:
    response = await query_llm(
        message=message,
        system_prompt="terminal_tutor/prompt.txt"
    )
    return response