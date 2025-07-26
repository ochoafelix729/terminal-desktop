from pathlib import Path
from openai import AsyncOpenAI
import os
import re
from dotenv import load_dotenv
from typing import AsyncGenerator
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
    
    
def format_code_blocks(text: str) -> str:
    """Convert markdown code blocks to HTML with proper styling"""
    # Replace ```language\ncode\n``` with <pre><code class="language-X">code</code></pre>
    pattern = r'```(\w+)?\n(.*?)\n```'
    replacement = r'<pre><code class="language-\1">\2</code></pre>'
    
    # Replace inline `code` with <code>code</code>
    inline_pattern = r'`([^`]+)`'
    inline_replacement = r'<code>\1</code>'
    
    # Apply both replacements
    text = re.sub(pattern, replacement, text, flags=re.DOTALL)
    text = re.sub(inline_pattern, inline_replacement, text)
    
    return text

    
async def query_llm(message: str, system_prompt: str) -> AsyncGenerator[str, None]:
    try:
        response = await client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL"),
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ],
            temperature=0.7,
            max_tokens=1500,
            stream=True
        )

        full_response = ""
        buffer = ""
        
        async for chunk in response:
            if chunk.choices and chunk.choices[0].delta.content:
                content = chunk.choices[0].delta.content
                buffer += content
                full_response += content
                
                # Stream complete words/tokens immediately
                while ' ' in buffer or '\n' in buffer:
                    space_idx = buffer.find(' ')
                    newline_idx = buffer.find('\n')
                    
                    if space_idx == -1:
                        split_idx = newline_idx
                    elif newline_idx == -1:
                        split_idx = space_idx
                    else:
                        split_idx = min(space_idx, newline_idx)
                    
                    if split_idx != -1:
                        yield buffer[:split_idx + 1]
                        buffer = buffer[split_idx + 1:]
                    else:
                        break
        
        # Process final buffer and apply formatting to complete response
        if buffer:
            yield buffer
        
        # After streaming is complete, send formatted version if it contains code blocks
        if '```' in full_response:
            formatted_response = format_code_blocks(full_response)
            # Send a special signal to replace the entire message
            yield f"\n__REPLACE_WITH_FORMATTED__\n{formatted_response}"
            
    except Exception as e:
        print(f"Error querying LLM: {e}")
        yield "An error occurred while querying the LLM."
