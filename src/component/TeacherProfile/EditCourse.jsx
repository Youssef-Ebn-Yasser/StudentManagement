import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import Loader from '../Loader/Loader';

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    level: '',
    image: null,
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const response = await courseService.getCourseDetails(id);
        if (response.succeeded) {
          setCourse(response.data);
          setForm({
            title: response.data.title || '',
            description: response.data.description || '',
            price: response.data.price || '',
            level: response.data.level || '',
            image: null,
          });
        } else {
          throw new Error(response.messages?.[0] || 'Failed to load course');
        }
      } catch (err) {
        setError(err.message || 'Failed to load course');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const updateData = {
        ...form,
        price: parseFloat(form.price),
        level: form.level,
        image: form.image,
      };
      await courseService.updateCourse(id, updateData);
      alert('Course updated successfully!');
      navigate(`/teacher/course/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to update course');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><Loader /></div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">Edit Course</h2>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            rows={4}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Price</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
            min="0"
            step="0.01"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Level</label>
          <input
            type="text"
            name="level"
            value={form.level}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-semibold">Image (optional)</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div className="flex gap-4">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Update Course</button>
          <button type="button" onClick={() => navigate(-1)} className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditCourse; 