import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import Loader from '../Loader/Loader';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const EditCourse = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const courseId = location.state?.courseId;
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    teacherId: '',
    categoryId: '',
    level: '',
    hours: '',
    image: course?.imagePath || '',
    id: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await courseService.getAllCategories();
        if (response.succeeded) {
          setCategories(response.data || []);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!courseId) {
      setError('Course ID is required');
      setLoading(false);
      return;
    }

    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const response = await courseService.getCourseDetails(courseId);
        if (response.succeeded) {
          setCourse(response.data);
          setForm({
            title: response.data.title || '',
            description: response.data.description || '',
            price: response.data.price || '',
            teacherId: user?.id || '',
            categoryId: response.data.categoryId || '',
            level: response.data.level || '',
            hours: response.data.hours || '',
            image: null,
            id: response.data.id || ''
          });
        } else {
          throw new Error(response.messages?.[0] || 'Failed to load course');
        }
      } catch (err) {
        setError(err.message || 'Failed to load course');
        toast.error(err.message || 'Failed to load course');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
  }, [courseId, user?.id]);

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
        id: courseId.toString(),
        title: form.title.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        teacherId: parseInt(form.teacherId),
        categoryId: parseInt(form.categoryId),
        level: form.level.trim(),
        hours: form.hours.trim()
      };

      // If there's a new image, handle it separately
      if (form.image) {
        const imageFormData = new FormData();
        imageFormData.append('image', form.image);
        // You might need to implement a separate endpoint for image upload
        // await courseService.uploadCourseImage(courseId, imageFormData);
      }

      const response = await courseService.updateCourse(courseId, updateData);
      if (response.succeeded) {
        toast.success('Course updated successfully!');
        navigate('/teacher/course/details', { state: { courseId } });
      } else {
        throw new Error(response.messages?.[0] || 'Failed to update course');
      }
    } catch (err) {
      setError(err.message || 'Failed to update course');
      toast.error(err.message || 'Failed to update course');
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">{t("edit-course")}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-semibold">{t("title")}</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">{t("description")}</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              rows={4}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">{t("category")}</label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              required
            >
              <option value="">{t("select-category")}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold">{t("price")}</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">{t("level")}</label>
            <input
              type="text"
              name="level"
              value={form.level}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">{t("hours")}</label>
            <input
              type="text"
              name="hours"
              value={form.hours}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">{t("image")} ({t("optional")})</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div className="flex gap-4">
            <button 
              type="submit" 
              className="bg-[var(--primary-color)] text-white px-6 py-2 rounded hover:bg-[var(--primary-dark)] transition-colors duration-200"
              disabled={isLoading}
            >
              {isLoading ? `${t('updating')}...` : `${t("update-course")}`}
            </button>
            <button 
              type="button" 
              onClick={() => navigate(-1)} 
              className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400 transition-colors duration-200"
            >
              {t('cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourse; 