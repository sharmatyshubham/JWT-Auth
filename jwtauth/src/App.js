import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Button } from '@mui/material';
import Register from './Register';
import Login from './Login';
import Home from './Home';
import Logout from './Logout';

export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <Button 
            component={Link} 
            to="/register" 
            variant="contained" 
            color="success" 
            style={{ marginRight: '10px' }}
          >
            Register
          </Button>
          <Button 
            component={Link} 
            to="/login" 
            variant="contained" 
            color="primary"
          >
            Login
          </Button>
        </nav>
        
        <h1>If you don't have an account, then register</h1>
        <h2>If already registered, then login</h2>

        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}
