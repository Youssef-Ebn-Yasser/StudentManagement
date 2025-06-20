import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {DollarSign} from 'lucide-react';

export default function PaymobCheckout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch course details to get price in cents
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://e-learn-v1.runasp.net/Course/Get/${id}`);
        if (res.data?.succeeded) {
          setCourse(res.data.data);
        } else {
          setError(res.data?.massage || 'Failed to load course details');
        }
      } catch (err) {
        setError('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  // Convert cents to USD (assuming price is in cents)
  const getUsdPrice = () => {
    if (!course?.price) return '';
    return (course.price*100 / 100).toFixed(2);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const payload = {
        amountInCents: course.price,
        ...form,
      };
      const res = await axios.post('https://e-learn-v1.runasp.net/api/Paymob/start-payment', payload);
      if (res.data?.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      } else {
        setError('Failed to get Paymob payment URL.');
      }
    } catch (err) {
      setError('Payment failed. Please check your info and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-green-50 via-white to-blue-50 p-8 rounded-2xl shadow-lg mt-12 mb-12 border border-blue-100">
             <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-800 tracking-tight leading-tight">
          <DollarSign className="inline-block w-9 h-9 mr-3 text-green-600 animate-pulse" />
          Secure Payment via Paymob
        </h2>
      <div className="mb-8 text-center">
        <div className="text-xl font-semibold text-blue-900">{course.title}</div>
        <div className="text-gray-700 mt-1 text-2xl font-extrabold">
          <span className="text-base text-gray-600 mr-2">Price:</span> <span className=" text-green-700 ">${getUsdPrice()}</span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-semibold text-blue-800">First Name</label>
          <input
            type="text"
            name="firstName"
            className="border-2 border-blue-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 rounded-lg p-3 w-full transition"
            value={form.firstName}
            onChange={handleChange}
            required
            placeholder="e.g., John"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold text-blue-800">Last Name</label>
          <input
            type="text"
            name="lastName"
            className="border-2 border-blue-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 rounded-lg p-3 w-full transition"
            value={form.lastName}
            onChange={handleChange}
            required
            placeholder="e.g., Doe"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold text-blue-800">Email</label>
          <input
            type="email"
            name="email"
            className="border-2 border-blue-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 rounded-lg p-3 w-full transition"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="e.g., john.doe@example.com"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold text-blue-800">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            className="border-2 border-blue-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 rounded-lg p-3 w-full transition"
            value={form.phoneNumber}
            onChange={handleChange}
            required
            placeholder="e.g., +1234567890"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg text-lg font-bold shadow hover:from-green-600 hover:to-blue-600 transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span>
              <svg className="inline mr-2 w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Pay with Paymob'
          )}
        </button>
      </form>
    </div>
  );
}