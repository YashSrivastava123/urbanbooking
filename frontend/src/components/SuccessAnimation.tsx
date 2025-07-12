import React from 'react';

export const SuccessAnimation: React.FC<{ message?: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-6">
    <svg
      className="w-20 h-20 text-green-500 animate-success-bounce"
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="stroke-current text-green-200"
        cx="26"
        cy="26"
        r="25"
        fill="white"
        strokeWidth="2"
      />
      <path
        className="stroke-current text-green-500"
        d="M16 27L23 34L36 20"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
    <div className="mt-4 text-lg font-semibold text-green-700 animate-fadeIn">
      {message || 'Booking Confirmed!'}
    </div>
  </div>
);

// Tailwind animations (add to your global CSS if not present):
// .animate-success-bounce { animation: success-bounce 0.7s cubic-bezier(.68,-0.55,.27,1.55); }
// .animate-fadeIn { animation: fadeIn 0.3s ease; }
// @keyframes success-bounce { 0% { transform: scale(0.7); opacity: 0; } 60% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); } }
// @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } 