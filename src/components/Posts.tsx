import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);



  const fetchPosts = async () => {
    try {
      const response = await axios.get('https://express-auth-api-one.vercel.app/posts');
      const postsData = response.data || [];
      setPosts(postsData);

      // Fetch user details for each unique user_id
      const userIds = [...new Set(postsData.map(post => post.user_id))];
      fetchUsers(userIds);
    } catch (err) {
      setError('Failed to load posts');
      console.error('Error fetching posts:', err.message);
    }
  };

  const fetchUsers = async (userIds) => {
    try {
      const response = await axios.get('https://express-auth-api-one.vercel.app/users');
      const usersData = response.data || [];

      // Convert array to object { userId: username }
      const usersObj = usersData.reduce((acc, user) => {
        acc[user.id] = user.username;
        return acc;
      }, {});

      setUsers(usersObj);
    } catch (err) {
      console.error('Error fetching users:', err.message);
    }
  };

const handleDelete = async (postId) => {
  if (!isAuthenticated || user?.id === undefined) {
    setError('You must be logged in to delete posts.');
    return;
  }

  try {
    await axios.delete(`https://express-auth-api-one.vercel.app/posts/${postId}`, {
      headers: {
        'x-auth-token': localStorage.token, // Send authentication token
      },
    });

    setPosts(posts.filter(post => post.id !== postId));
  } catch (err) {
    setError('Failed to delete post');
    console.error('Error deleting post:', err.message);
  }
};


  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">No posts available</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="aspect-video">
            <iframe
              src={post.video_url}
              className="w-full h-full"
              allowFullScreen
              title={post.title}
            />
          </div>
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
            <p className="text-gray-600 mb-2">{post.description}</p>
            <p className="text-sm text-gray-500">
              Posted by:
              {users[post.user_id] ? (
                <Link to={`/profile/${post.user_id}`} className="text-blue-500 hover:underline ml-1">
                  {users[post.user_id]}
                </Link>
              ) : (
                ' Loading...'
              )}
            </p>
            {isAuthenticated && user?.id === post.user_id && (
  <button
    onClick={() => handleDelete(post.id)}
    className="flex items-center gap-2 text-red-600 hover:text-red-700"
  >
    <Trash2 className="w-4 h-4" />
    Delete
  </button>
)}

          </div>
        </div>
      ))}
    </div>
  );
}

export default Posts;
