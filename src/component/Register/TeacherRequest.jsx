import React, { useState } from 'react';
import { FaUserGraduate, FaEnvelope, FaPaperPlane, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TeacherRequest = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponse(null);

    try {
      const response = await axios.post(
        `https://e-learn-v1.runasp.net/api/Auth/Teacher-request?name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}`
      );

      if (response.data) {
        setResponse({
          success: true,
          message: 'Request has been sent successfully! Our admin team will review your application and contact you soon.'
        });
        setFormData({ name: '', email: '' }); // Reset form
      } else {
        throw new Error('Failed to send request');
      }
    } catch (error) {
      console.error('Error sending request:', error);
      setResponse({
        success: false,
        message: error.response?.data?.message || 'Failed to send request. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-12">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Become a Teacher</h2>
          <p className="text-xl text-gray-600">Send a request to become a teacher on our platform</p>
        </div>

        {response ? (
          <div className={`p-6 rounded-lg mb-8 ${response.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex items-center gap-4">
              {response.success ? (
                <FaCheckCircle className="text-green-500 text-3xl" />
              ) : (
                <FaTimesCircle className="text-red-500 text-3xl" />
              )}
              <p className={`text-xl ${response.success ? 'text-green-700' : 'text-red-700'}`}>
                {response.message}
              </p>
            </div>
            <div className="mt-6 flex justify-center gap-4">
              {response.success ? (
                <Link
                  to="/auth/login"
                  className="text-blue-600 hover:text-blue-800 font-medium text-lg"
                >
                  Go to Login
                </Link>
              ) : (
                <button
                  onClick={() => setResponse(null)}
                  className="text-blue-600 hover:text-blue-800 font-medium text-lg"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaUserGraduate className="text-gray-400 text-xl" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="pl-12 w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400 text-xl" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="pl-12 w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center px-6 py-4 text-lg border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending Request...
                </>
              ) : (
                <>
                  <FaPaperPlane className="mr-3 text-xl" />
                  Send Request
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-8 text-center text-base text-gray-500">
          <p>After submitting your request, our admin team will review your application.</p>
          <p className="mt-2">You will be notified via email once your request is approved.</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherRequest; 