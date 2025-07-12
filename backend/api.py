from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# pydantic model for user input - will expand later
class UserInput(BaseModel):
    question: str

@app.post("/submit")
async def receive_user_input(user: UserInput):
    return {
        
    }