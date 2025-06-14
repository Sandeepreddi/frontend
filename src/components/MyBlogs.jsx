import React, { useState, useEffect } from 'react';

function MyBlogs({ user }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchUserBlogs();
  }, [user?.id]); // Re-fetch when user.id changes

  const fetchUserBlogs = async () => {
    try {
      if (!user?.id) return;
      
      setLoading(true);
      const response = await fetch(`https://backend-production-1c3e.up.railway.app/api/users/${user.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const userData = await response.json();
      setBlogs(userData.blogs || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (blog) => {
    setEditingBlog(blog);
    setEditFormData({
      title: blog.title,
      content: blog.content
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleUpdateBlog = async (e) => {
    e.preventDefault();
    try {
      const updatedBlogs = blogs.map(blog => 
        blog === editingBlog ? { ...blog, ...editFormData } : blog
      );

      const response = await fetch(`https://backend-production-1c3e.up.railway.app/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...user,
          blogs: updatedBlogs
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update blog');
      }

      setBlogs(updatedBlogs);
      setEditingBlog(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteBlog = async (blogToDelete) => {
    try {
      const updatedBlogs = blogs.filter(blog => blog !== blogToDelete);

      const response = await fetch(`https://backend-production-1c3e.up.railway.app/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...user,
          blogs: updatedBlogs
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete blog');
      }

      setBlogs(updatedBlogs);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading your blogs...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Blog Posts</h1>
      
      {editingBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Edit Blog</h2>
            <form onSubmit={handleUpdateBlog}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="title">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="content">
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={editFormData.content}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border rounded"
                  rows="5"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingBlog(null)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {blogs.length === 0 ? (
        <div className="text-center py-12 bg-gray-100 rounded-lg">
          <p className="text-gray-600">You haven't written any blogs yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden relative">
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => handleEditClick(blog)}
                  className="p-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
                  title="Edit"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteBlog(blog)}
                  className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                  title="Delete"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{blog.title}</h2>
                <p className="text-gray-600 mb-4">
                  {blog.content.length > 150 
                    ? `${blog.content.substring(0, 150)}...` 
                    : blog.content}
                </p>
                <div className="text-sm text-gray-500">
                  Created: {new Date(blog.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBlogs;