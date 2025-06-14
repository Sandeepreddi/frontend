import React, { useEffect, useState } from 'react';
import { UserIcon } from 'lucide-react';

function Body() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://backend-production-1c3e.up.railway.app/api/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include'
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const users = await res.json();
        // Collect all blogs from all users
        const allBlogs = users.flatMap(user =>
          (user.blogs || []).map(blog => ({ ...blog, author: user.name }))
        );

        setBlogs(allBlogs);
        setError(null);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError('Failed to load blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading blogs...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {blogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((blog, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-300"
            >
              <h3 className="text-2xl font-semibold text-indigo-800 mb-2">{blog.title}</h3>
              <p className="text-gray-700 mb-4 text-sm leading-relaxed">{blog.content}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  <span>{blog.author}</span>
                </div>
                <span>{new Date(blog.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Body;
