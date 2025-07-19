import React, { useState } from 'react';
import axiosInstance from '@/services/axiosInstance';
import { useNavigate } from 'react-router-dom';

export default function AddSlider() {
  const [content, setContent] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!image) {
      setErrorMsg('Image is required.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('Content', content);
    formData.append('Link', link);
    formData.append('Image', image);

    try {
      const res = await axiosInstance.post('/api/Slider', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccessMsg('Slider added successfully!');
      setContent('');
      setLink('');
      setImage(null);
      document.getElementById('slider-image-input').value = '';
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        const errors = err.response.data.errors;
        setErrorMsg(
          errors.Image?.[0] ||
          errors.Content?.[0] ||
          errors.Link?.[0] ||
          'Failed to add slider.'
        );
      } else {
        setErrorMsg('Failed to add slider.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 py-10 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
          Add New Slider
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="slider-content">
              Content
            </label>
            <input
              id="slider-content"
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Enter slider content"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="slider-link">
              Link
            </label>
            <input
              id="slider-link"
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
              placeholder="Enter slider link"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="slider-image-input">
              Image
            </label>
            <input
              id="slider-image-input"
              type="file"
              accept="image/*"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
              onChange={handleImageChange}
              required
            />
            {image && (
              <div className="mt-2 flex justify-center">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="h-32 rounded-lg shadow border"
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            className={`w-full py-2 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Slider'}
          </button>
        </form>
        <button
          onClick={() => navigate('/admin/all-sliders')}
          className="w-full mt-4 py-2 rounded-lg font-bold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 border border-indigo-200 transition"
        >
          View All Sliders
        </button>
        {successMsg && (
          <div className="mt-4 text-green-600 font-semibold text-center">{successMsg}</div>
        )}
        {errorMsg && (
          <div className="mt-4 text-red-600 font-semibold text-center">{errorMsg}</div>
        )}
      </div>
    </div>
  );
}