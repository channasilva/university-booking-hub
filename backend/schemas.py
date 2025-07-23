from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    class Config:
        orm_mode = True

class RoomBase(BaseModel):
    name: str
    location: Optional[str] = None
    capacity: int

class RoomCreate(RoomBase):
    pass

class Room(RoomBase):
    id: int
    class Config:
        orm_mode = True

class BookingBase(BaseModel):
    start_time: datetime
    end_time: datetime

class BookingCreate(BookingBase):
    user_id: int
    room_id: int

class Booking(BookingBase):
    id: int
    user_id: int
    room_id: int
    class Config:
        orm_mode = True 

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None 