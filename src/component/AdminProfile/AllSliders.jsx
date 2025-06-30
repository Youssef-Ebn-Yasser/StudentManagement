import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';

export default function AllSliders() {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchSliders = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await axios.get('https://e-learn-v1.runasp.net/api/Slider');
      setSliders(res.data || []);
    } catch (err) {
      setErrorMsg('Failed to fetch sliders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this slider?')) return;
    setDeletingId(id);
    setErrorMsg('');
    try {
      await axios.delete(`https://e-learn-v1.runasp.net/api/Slider/${id}`);
      setSliders((prev) => prev.filter((slider) => slider.id !== id));
    } catch (err) {
      setErrorMsg('Failed to delete slider.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-8 text-center">
          All Sliders
        </h2>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : errorMsg ? (
          <div className="text-center text-red-600 font-semibold">{errorMsg}</div>
        ) : sliders.length === 0 ? (
          <div className="text-center text-gray-500 font-semibold">No sliders found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sliders.map((slider) => (
              <div
                key={slider.id}
                className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-5 flex flex-col relative hover:shadow-xl transition"
              >
                <img
                  src={slider.path}
                  alt={slider.content}
                  className="w-full h-48 object-cover rounded-lg mb-4 border"
                />
                <div className="flex-1">
                  <div className="text-lg font-bold text-indigo-700 mb-2">{slider.content}</div>
                  <a
                    href={slider.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-500 hover:underline break-all"
                  >
                    {slider.link}
                  </a>
                </div>
                <button
                  className={`absolute top-4 right-4 p-2 rounded-full bg-red-100 hover:bg-red-200 transition text-red-600 shadow ${deletingId === slider.id ? 'opacity-60 cursor-not-allowed' : ''}`}
                  title="Delete Slider"
                  onClick={() => handleDelete(slider.id)}
                  disabled={deletingId === slider.id}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}