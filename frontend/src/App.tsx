import React, { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  user: any;
}

const AuthContext = createContext<AuthContextType>({ token: null, setToken: () => {}, user: null });

function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      try {
        setUser(jwtDecode(token));
      } catch {
        setUser(null);
      }
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, user }}>
      {children}
    </AuthContext.Provider>
  );
}

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { token } = useAuth();
  if (!token) {
    return <div>Please login to access this page.</div>;
  }
  return children;
}

function Home() {
  return <h2>Home</h2>;
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const form = new FormData();
      form.append('username', email);
      form.append('password', password);
      const res = await axios.post('http://localhost:8000/login', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      localStorage.setItem('token', res.data.access_token);
      setToken(res.data.access_token);
      navigate('/rooms');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{color:'red'}}>{error}</p>}
    </div>
  );
}

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:8000/users/', {
        username,
        email,
        password,
      });
      setSuccess('Registration successful! You can now login.');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Register</button>
      </form>
      {error && <p style={{color:'red'}}>{error}</p>}
      {success && <p style={{color:'green'}}>{success}</p>}
    </div>
  );
}

function Rooms() {
  const { token } = useAuth();
  const [rooms, setRooms] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState(1);

  const fetchRooms = async () => {
    try {
      const res = await axios.get('http://localhost:8000/rooms/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(res.data);
    } catch (err: any) {
      setError('Failed to fetch rooms');
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/rooms/', { name, location, capacity }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setName(''); setLocation(''); setCapacity(1);
      fetchRooms();
    } catch (err: any) {
      setError('Failed to create room');
    }
  };

  return (
    <div>
      <h2>Rooms</h2>
      {error && <p style={{color:'red'}}>{error}</p>}
      <form onSubmit={handleCreate}>
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
        <input type="number" placeholder="Capacity" value={capacity} onChange={e => setCapacity(Number(e.target.value))} min={1} required />
        <button type="submit">Add Room</button>
      </form>
      <ul>
        {rooms.map(room => (
          <li key={room.id}>
            <strong>{room.name}</strong> - {room.location} (Capacity: {room.capacity})
          </li>
        ))}
      </ul>
    </div>
  );
}
function Bookings() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:8000/bookings/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err: any) {
      setError('Failed to fetch bookings');
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/bookings/', {
        user_id: Number(userId),
        room_id: Number(roomId),
        start_time: startTime,
        end_time: endTime,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserId(''); setRoomId(''); setStartTime(''); setEndTime('');
      fetchBookings();
    } catch (err: any) {
      setError('Failed to create booking');
    }
  };

  return (
    <div>
      <h2>Bookings</h2>
      {error && <p style={{color:'red'}}>{error}</p>}
      <form onSubmit={handleCreate}>
        <input type="number" placeholder="User ID" value={userId} onChange={e => setUserId(e.target.value)} required />
        <input type="number" placeholder="Room ID" value={roomId} onChange={e => setRoomId(e.target.value)} required />
        <input type="datetime-local" placeholder="Start Time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
        <input type="datetime-local" placeholder="End Time" value={endTime} onChange={e => setEndTime(e.target.value)} required />
        <button type="submit">Add Booking</button>
      </form>
      <ul>
        {bookings.map(booking => (
          <li key={booking.id}>
            Booking #{booking.id}: Room {booking.room_id}, User {booking.user_id}, {booking.start_time} - {booking.end_time}
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/rooms">Rooms</Link></li>
            <li><Link to="/bookings">Bookings</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/rooms" element={<ProtectedRoute><Rooms /></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
