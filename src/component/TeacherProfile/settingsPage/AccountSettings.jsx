import React, { useState, useEffect, use } from 'react';
import { courseService } from '../../../services/courseService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const AccountSettings = ({ teacherData, onUpdate }) => {

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: teacherData?.name || '',
    age: teacherData?.age || '',
    specialization: teacherData?.specialization || '',
    phone: teacherData?.phone || '',
    image: null
  });

  const [previewUrl, setPreviewUrl] = useState(teacherData?.image || null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.specialization?.trim()) {
      newErrors.specialization = 'Specialization is required';
    }
    
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!formData.phone.match(/^\+?[1-9]\d{1,14}$/)) {
      newErrors.phone = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      // Ensure we have a valid teacher ID
      if (!teacherData?.id) {
        throw new Error('Teacher ID is missing');
      }

      const response = await courseService.updateTeacher({
        Id: teacherData.id,
        Name: formData.name.trim(),
        Age: formData.age || '',
        Specialization: formData.specialization.trim(),
        Phone: formData.phone.trim(),
        Image: formData.image
      });
      
      if (response.succeeded) {
        // Show success message
        toast.success('Profile updated successfully!');
        
        // Update local state and trigger parent callback
        onUpdate({
          ...formData,
          image: previewUrl
        });
        
        // Navigate back to profile
        window.location.href = '/teacher/profile';
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("account-settings")}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{t("profile-image")}</h3>
              <div className="flex items-center space-x-6">
                <div className="shrink-0">
                  <img
                    className="h-24 w-24 object-cover rounded-full"
                    src={previewUrl || 'https://via.placeholder.com/150'}
                    alt="Profile"
                  />
                </div>
                <div>
                  <label className="block">
                    <span className="sr-only">{t("choose-profile-photo")}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-violet-50 file:text-violet-700
                        hover:file:bg-violet-100"
                    />
                  </label>
                  <p className="mt-1 text-sm text-gray-500">
                    JPG, PNG or GIF (MAX. 2MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                {t("full-name")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t("enter-full-name")}
                className={`form-input w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 p-3 ${
                  errors.name ? 'border-red-500' : ''
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Age Field */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                {t('age')}
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder={t("enter-age")}
                className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 p-3"
              />
            </div>

            {/* Specialization Field */}
            <div>
              <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                {t("specialization")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder={t("enter-specialization")}
                className={`form-input w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 p-3 ${
                  errors.specialization ? 'border-red-500' : ''
                }`}
              />
              {errors.specialization && (
                <p className="mt-1 text-sm text-red-600">{errors.specialization}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                {t("phone-number")} <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={t("phone-placeholder")}
                className={`form-input w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 p-3 ${
                  errors.phone ? 'border-red-500' : ''
                }`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => window.location.href = '/teacher/profile'}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-violet-600 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? `${t("saving")}...` : `${'save-changes'}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings; 