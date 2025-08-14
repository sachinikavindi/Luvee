import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const { setShowUserLogin, setUser } = useAppContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to verify credentials
    // For now, we'll just simulate a successful login
    setUser({
      email: formData.email,
      // Add any other user data you want to store
    });
    setShowUserLogin(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowUserLogin(false);
    }
  };

  const handleCreateAccount = () => {
    setShowUserLogin(false);
    navigate('/signup');
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-40 flex justify-end" onClick={handleBackdropClick}>
      <div className="bg-white w-full sm:w-[400px] h-full p-6 shadow-lg animate-slide-in-right relative">
        <button
          onClick={() => setShowUserLogin(false)}
          className="absolute right-4 top-4 text-xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full border border-gray-300 px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full border border-gray-300 px-3 py-2 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-950 text-white py-2 rounded hover:opacity-90 hover:bg-black"
          >
            Log In
          </button>
          <a href="#" className="text-sm text-primary-dull hover:underline">Forgot your password?</a>
          <button
            type="button"
            onClick={handleCreateAccount}
            className="border py-2 rounded hover:bg-green-950 hover:text-white"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
