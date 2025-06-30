import React from 'react'
import { Link } from 'react-router-dom';

function NotFound() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <h1 className="text-7xl font-extrabold text-blue-700 mb-4 drop-shadow-lg">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">Sorry, the page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-blue-700 transition-all duration-200">Go Home</Link>
      </div>
    );
}

export default NotFound
