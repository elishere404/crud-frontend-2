import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { id } = useParams(); // Get ID from the URL
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  // Get token from localStorage
  const token = localStorage.getItem('token');

  if (!isAuthenticated) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Access Denied - must be logged in to see profile
      </div>
    );
  }

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `https://express-auth-api-one.vercel.app/users/${id}`,
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );
      setUserData(response.data[0]);
    } catch (err) {
      setError('Failed to load user data');
      console.error('Error fetching user data:', err.message);
    }
  };

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6">Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Username
          </label>
          <p className="text-gray-900">{userData.username}</p>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <p className="text-gray-900">{userData.email}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
