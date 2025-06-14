import React, { useState, useEffect } from 'react';

function CreateBlog({ onBlogCreated }) {
    const [blogData, setBlogData] = useState({ title: "", content: "" });
    const [user, setUser] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("blogUser");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (err) {
                console.error("Error parsing user from localStorage:", err);
            }
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBlogData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const newBlog = {
                ...blogData,
                createdAt: new Date().toISOString()
            };

            const updatedUserData = {
                ...user,
                blogs: [...(user.blogs || []), newBlog]
            };

            const response = await fetch(`https://backend-production-1c3e.up.railway.app/api/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(updatedUserData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Failed to create blog');
            }

            const updatedUser = await response.json();
            setSuccess(true);
            setBlogData({ title: "", content: "" });
            
            localStorage.setItem("blogUser", JSON.stringify(updatedUser));

            if (onBlogCreated) {
                onBlogCreated(newBlog);
            }

            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Error creating blog:', err);
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">Create New Blog Post</h2>
            
            {error && (
                <div className="mb-3 sm:mb-4 p-3 bg-red-100 text-red-700 rounded text-sm sm:text-base">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="mb-3 sm:mb-4 p-3 bg-green-100 text-green-700 rounded text-sm sm:text-base">
                    Blog post created successfully!
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-3 sm:mb-4">
                    <label htmlFor="title" className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={blogData.title}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        required
                    />
                </div>

                <div className="mb-4 sm:mb-6">
                    <label htmlFor="content" className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                        Content
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        value={blogData.content}
                        onChange={handleChange}
                        rows="6"
                        className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        required
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {isSubmitting ? 'Publishing...' : 'Publish Blog Post'}
                </button>
            </form>
        </div>
    );
}

export default CreateBlog;