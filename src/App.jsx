import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Body from './components/Body';
import Navbar from './components/NavBar';
import MyBlogs from './components/MyBlogs';
import CreateBlog from './components/CreateBlog';
import { useState, useEffect } from 'react';

function App() {
  const [showNavbar, setShowNavbar] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('blogUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleBlogCreated = (newBlog) => {
    // Update user's blogs in state
    if (user) {
      const updatedUser = {
        ...user,
        blogs: [...(user.blogs || []), newBlog]
      };
      setUser(updatedUser);
      localStorage.setItem('blogUser', JSON.stringify(updatedUser));
    }
  };

  return (
    <BrowserRouter>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        position: 'relative'
      }}>
        {/* Fixed Header */}
        <div style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <Header setShowNavbar={setShowNavbar} showNavbar={showNavbar} />
        </div>

        {/* Main content wrapper with padding for fixed header */}
        <div style={{ 
          display: 'flex', 
          flex: 1,
          marginTop: '60px', // Adjust based on your header height
          height: 'calc(100vh - 60px)', // Subtract header height
          position: 'relative'
        }}>
          {/* Fixed Navbar */}
          {showNavbar && (
            <div style={{ 
              width: '250px',
              position: 'fixed',
              left: 0,
              top: '60px', // Match header height
              bottom: 0,
              backgroundColor: 'white',
              zIndex: 900,
              boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
              overflowY: 'auto'
            }}>
              <Navbar />
            </div>
          )}

          {/* Scrollable main content */}
          <div style={{ 
            flex: 1,
            padding: '1rem',
            marginLeft: showNavbar ? '250px' : 0,
            overflowY: 'auto',
            height: '100%'
          }}>
            <Routes>
              <Route path="/" element={<Body />} />
              <Route path="/createblog" element={<CreateBlog onBlogCreated={handleBlogCreated} />} />
              <Route path="/myblogs" element={<MyBlogs user={user} />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
