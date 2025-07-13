from pathlib import Path
from openai import AsyncOpenAI
import os
from dotenv import load_dotenv

load_dotenv()
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def read_prompt_file(filename: str) -> str:
    try:
        current_dir = Path(__file__).parent
        prompt_path = current_dir / filename
        with open(prompt_path, 'r') as file:
            return file.read().strip()
    except Exception as e:
        print(f"Error reading prompt file: {e}")
        return "You are a helpful terminal assistant."
    
async def query_llm(message: str, system_prompt: str) -> str:
    try:
        response = await client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL"),
            messages=[
                {"role": "system", "content": read_prompt_file(system_prompt)},
                {"role": "user", "content": message}
            ],
            temperature=0.7,
            max_tokens=150
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error querying LLM: {str(e)}"