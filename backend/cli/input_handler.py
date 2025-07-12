import requests
from prompt_toolkit import prompt
from prompt_toolkit.completion import WordCompleter
from prompt_toolkit.styles import Style
import threading

exit_flag = threading.Event()

style = Style.from_dict({
    "prompt": "#00ff00 bold" # green prompt text
})

def run_terminal_prompt():
    global exit_requested
    while not exit_flag.is_set():
        try:
            user_input = prompt('>>> ', style=style) # will add a completer later
            
            if user_input.strip().lower() in ['exit', 'quit']:
                break

            response = requests.post("http://127.0.0.1:8000/chat", json={
                "message": user_input,
                "source": "cli"
            })
            
            # process command here
        
        except KeyboardInterrupt:
            print("\nInterrupted. Type 'exit' to quit.")
        except EOFError:
            print("\nEOF received. Exiting.")
            break