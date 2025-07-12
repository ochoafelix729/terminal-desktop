from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# pydantic model for user input - will expand later
class UserInput(BaseModel):
    message: str

@app.get("/")
def root():
    return {}

@app.post("/submit")
def receive_user_input(user: UserInput):
    return {
        "message": f"Received: {user.message}"
    }