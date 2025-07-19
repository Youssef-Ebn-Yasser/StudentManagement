import React, { useState, useEffect } from 'react';
import { courseService } from '../../services/courseService';
import Loader from '../Loader/Loader';
import { useTranslation } from 'react-i18next';


export default function Teachers() {

  const { t } = useTranslation();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const response = await courseService.getAllTeachers();
        setTeachers(response?.data || []);
      } catch (error) {
        setError(error.message || 'Failed to load teachers');
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="scale-[2.5]">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {t('retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t("our-teach")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-xl transition" onClick={() => window.location.href = `/courses/teacher/${teacher.id}`}>
            <div className="flex items-center space-x-4">
              <img
                src={teacher.image || '../../../public/teacher-photo.avif'}
                alt={teacher.name}
                className="w-16 h-16 rounded-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '../../../public/teacher-photo.avif';
                }}
              />
              <div>
                <h2 className="text-xl font-semibold">{teacher.name}</h2>
                <p className="text-gray-600">{teacher.specialization}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
