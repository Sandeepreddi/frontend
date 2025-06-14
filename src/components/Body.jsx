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
    return <div className="text-center py-8 text-lg">Loading blogs...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500 text-lg">{error}</div>;
  }

  return (
    <div className="px-4 py-6 sm:p-8 max-w-4xl mx-auto">
      {blogs.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
          {blogs.map((blog, index) => (
            <div
              key={index}
              className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg border border-gray-100 sm:border-gray-200 hover:shadow-lg sm:hover:shadow-xl transition duration-300"
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-indigo-700 sm:text-indigo-800 mb-2 line-clamp-2">
                {blog.title}
              </h3>
              <p className="text-gray-600 sm:text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed line-clamp-3">
                {blog.content}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm text-gray-500 gap-1 sm:gap-0">
                <div className="flex items-center gap-1 sm:gap-2">
                  <UserIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="truncate max-w-[120px] sm:max-w-none">{blog.author}</span>
                </div>
                <span className="text-gray-400 sm:text-gray-500">
                  {new Date(blog.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Body;