from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

from .models import Base, Conversation, User
from datetime import datetime
import hashlib

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# For sqlite, need check_same_thread=False for multithreading with FastAPI
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables on startup
Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def add_conversation(question: str, response: str, selected_plugin: str,
                     username: str | None = None,
                     email: str | None = None,
                     password: str | None = None) -> None:
    """Save a conversation entry to the database."""
    db = SessionLocal()
    try:
        convo = Conversation(
            username=username,
            email=email,
            selected_plugin=selected_plugin,
            question=question,
            response=response,
            date_time=datetime.utcnow()
        )
        if password:
            convo.password = hashlib.sha256(password.encode()).hexdigest()
        db.add(convo)
        print(f"Added convo to database: {convo}")
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Error saving conversation: {e}")
    finally:
        db.close()


def add_user(username: str, email: str | None, password: str) -> bool:
    """Create a new user if username does not exist."""
    db = SessionLocal()
    try:
        if db.query(User).filter(User.username == username).first():
            return False
        user = User(username=username, email=email)
        user.set_password(password)
        db.add(user)
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        print(f"Error creating user: {e}")
        return False
    finally:
        db.close()


def verify_user(username: str, password: str) -> bool:
    """Verify username and password."""
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == username).first()
        if not user:
            return False
        return user.verify_password(password)
    finally:
        db.close()

