import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  // If user is authenticated, redirect to booking page
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-primary-100 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome back, {user.name}!
          </h2>
          <Link to="/booking" className="btn-primary">
            Go to Booking
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-primary-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-primary-600 rounded-full p-4 shadow-lg animate-bounce-in">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 17l4 4 4-4m0-5V3m-8 9v4a4 4 0 004 4h0a4 4 0 004-4v-4" />
            </svg>
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-2 animate-fade-in">
          Welcome to <span className="text-primary-600">Urban Booking</span>
        </h2>
        <p className="text-center text-base text-gray-600 mb-6 animate-fade-in delay-100">
          Book your preferred time slots with ease
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card shadow-xl animate-fade-in-up">
          <div className="space-y-4">
            <Link
              to="/login"
              className="btn-primary w-full text-center transition-transform transform hover:scale-105 focus:scale-105"
            >
              Sign In
            </Link>
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-200" />
              <span className="mx-2 text-gray-400">or</span>
              <div className="flex-grow border-t border-gray-200" />
            </div>
            <Link
              to="/register"
              className="btn-secondary w-full text-center transition-transform transform hover:scale-105 focus:scale-105"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Tailwind custom animation classes (add to index.css or tailwind config)
// .animate-fade-in { animation: fadeIn 0.7s ease; }
// .animate-fade-in-up { animation: fadeInUp 0.7s ease; }
// .animate-bounce-in { animation: bounceIn 0.7s cubic-bezier(.68,-0.55,.27,1.55); }
// @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
// @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: none; } }
// @keyframes bounceIn { 0% { transform: scale(0.7); opacity: 0; } 80% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); } } 