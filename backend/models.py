from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    bookings = relationship('Booking', back_populates='user')

class Room(Base):
    __tablename__ = 'rooms'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    location = Column(String)
    capacity = Column(Integer)
    bookings = relationship('Booking', back_populates='room')

class Booking(Base):
    __tablename__ = 'bookings'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    room_id = Column(Integer, ForeignKey('rooms.id'))
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    user = relationship('User', back_populates='bookings')
    room = relationship('Room', back_populates='bookings') 