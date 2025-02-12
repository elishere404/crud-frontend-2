import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { UserCircle, Video, LogOut } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Posts from './components/Posts';
import CreatePost from './components/CreatePost';
import Profile from './components/Profile';

function Navigation() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
          <Video className="w-6 h-6" />
          FRONTEND-CRUD
        </Link>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/create" className="hover:text-gray-300">Share Video</Link>
              <Link to="/profile" className="hover:text-gray-300">
                <UserCircle className="w-6 h-6" />
              </Link>
              <button
                onClick={logout}
                className="hover:text-gray-300 flex items-center gap-1"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link to="/register" className="hover:text-gray-300">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navigation />
          <main className="container mx-auto py-8 px-4">
            <Routes>
              <Route path="/" element={<Posts />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create" element={<CreatePost />} />
              <Route path="/profile/:id" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
