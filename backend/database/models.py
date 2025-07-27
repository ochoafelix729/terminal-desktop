from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
import hashlib

Base = declarative_base()

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=True)
    email = Column(String, nullable=True)
    password = Column(String, nullable=True)
    selected_plugin = Column(String, nullable=True)
    question = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    date_time = Column(DateTime, default=datetime.utcnow)

    def set_password(self, plain: str):
        if plain:
            self.password = hashlib.sha256(plain.encode()).hexdigest()
