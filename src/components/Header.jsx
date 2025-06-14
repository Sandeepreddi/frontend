import { useState, useEffect } from "react";
import { IoMenuSharp } from "react-icons/io5";

const Header = ({ showNavbar, setShowNavbar }) => {
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [showSignupOptions, setShowSignupOptions] = useState(false);
  const [user, setUser] = useState(null);
  
  // State for error and success messages
  const [signupError, setSignupError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");
  
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" });
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  useEffect(() => {
    const storedUser = localStorage.getItem('blogUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError("");
    setSignupSuccess("");
    
    try {
      const res = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        // Handle specific error cases
        if (res.status === 400 && data.includes("already exists")) {
          throw new Error("Email already in use. Please use a different email.");
        }
        throw new Error(data || "Signup failed");
      }
      
      setUser(data);
      localStorage.setItem('blogUser', JSON.stringify(data));
      setShowSignupOptions(false);
      setSignupSuccess("Signup successful! You are now logged in.");
      setSignupData({ name: "", email: "", password: "" }); // Clear form
    } catch (error) {
      setSignupError("signup failed "+"User Already Exist");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    
    try {
      const res = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData || "Invalid email or password");
      }
      
      const data = await res.json();
      setUser(data);
      localStorage.setItem('blogUser', JSON.stringify(data));
      setShowLoginOptions(false);
      setLoginData({ email: "", password: "" }); // Clear form
    } catch (error) {
      setLoginError(error.message);
    }
  };

  return (
    <div className="relative">
      <header className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-indigo-700 shadow-md">
        {user && (
          <div className="flex items-center gap-2">
            <IoMenuSharp
              onClick={() => {
                setShowNavbar(!showNavbar);
                setShowLoginOptions(false);
                setShowSignupOptions(false);
              }}
              className="text-white cursor-pointer w-6 h-6"
            />
          </div>
        )}

        <h1 className="text-3xl font-bold text-white absolute left-1/2 transform -translate-x-1/2 font-sans">
          Blog
        </h1>

        <div className="ml-auto flex items-center gap-4">
          {user ? (
            <>
              <span className="text-white font-medium">{user.name}</span>
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setShowSignupOptions(!showSignupOptions);
                  setShowLoginOptions(false);
                  setShowNavbar(false);
                  setSignupError(""); // Clear previous errors
                  setSignupSuccess(""); // Clear previous success
                }}
                className="px-3 py-1 bg-white text-blue-600 rounded-full hover:bg-gray-100 font-medium"
              >
                Sign Up
              </button>

              {showSignupOptions && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 py-1" style={{ top: '100%' }}>
                  <form onSubmit={handleSignup} className="px-4 py-2">
                    {signupError && (
                      <div className="mb-2 p-2 text-xs text-red-600 bg-red-50 rounded">
                        {signupError}
                      </div>
                    )}
                    {signupSuccess && (
                      <div className="mb-2 p-2 text-xs text-green-600 bg-green-50 rounded">
                        {signupSuccess}
                      </div>
                    )}
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full px-3 py-1 mb-2 border rounded-md text-sm"
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full px-3 py-1 mb-2 border rounded-md text-sm"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full px-3 py-1 mb-2 border rounded-md text-sm"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      required
                    />
                    <button
                      type="submit"
                      className="w-full bg-blue-500 text-white py-1 rounded-md text-sm hover:bg-blue-600"
                    >
                      Sign Up
                    </button>
                  </form>
                </div>
              )}

              <button
                onClick={() => {
                  setShowLoginOptions(!showLoginOptions);
                  setShowSignupOptions(false);
                  setShowNavbar(false);
                  setLoginError(""); // Clear previous errors
                }}
                className="px-3 py-1 bg-emerald-400 text-white rounded-full hover:bg-emerald-500 font-medium"
              >
                Login
              </button>

              {showLoginOptions && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 py-1" style={{ top: '100%' }}>
                  <form onSubmit={handleLogin} className="px-4 py-2">
                    {loginError && (
                      <div className="mb-2 p-2 text-xs text-red-600 bg-red-50 rounded">
                        {loginError}
                      </div>
                    )}
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full px-3 py-1 mb-2 border rounded-md text-sm"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full px-3 py-1 mb-2 border rounded-md text-sm"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                    <button
                      type="submit"
                      className="w-full bg-emerald-400 text-white py-1 rounded-md text-sm hover:bg-emerald-500"
                    >
                      Login
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;