import React, { useState, useEffect } from 'react';
import { courseService } from '../../../services/courseService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Loader from '../../Loader/Loader';

const AccountSettings = ({ teacherData, onUpdate }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: teacherData?.name || '',
    email: teacherData?.email || '',
    age: teacherData?.age || '',
    additionalInfo: teacherData?.additionalInfo || '',
    specialization: teacherData?.specialization || '',
    phoneNumber: teacherData?.phoneNumber || '',
    password: '',
    confirmPassword: '',
    image: null
  });

  const [previewUrl, setPreviewUrl] = useState(teacherData?.image || null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.email?.trim()) newErrors.email = 'Email is required';
    if (!formData.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Invalid email format';
    if (!formData.age || formData.age < 20 || formData.age > 255) newErrors.age = 'Age must be between 20 and 255';
    if (!formData.specialization?.trim()) newErrors.specialization = 'Specialization is required';
    if (formData.specialization?.length > 100) newErrors.specialization = 'Specialization cannot exceed 100 characters';
    if (formData.additionalInfo?.length > 500) newErrors.additionalInfo = 'Additional Info cannot exceed 500 characters';
    if (!formData.phoneNumber?.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.phoneNumber.match(/^\+?[1-9]\d{1,14}$/)) newErrors.phoneNumber = 'Invalid phone number format';
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
        Email: formData.email.trim(),
        Age: formData.age,
        Specialization: formData.specialization.trim(),
        AdditionalInfo: formData.additionalInfo?.trim() || '',
        PhoneNumber: formData.phoneNumber.trim(),
        Password: formData.password?.trim() || '',
        Image: formData.image
      });
      
      console.log('Update response:', response);
      
      if (response.succeeded) {
        // Show success message
        toast.success('Profile updated successfully!');
        
        // Update local state and trigger parent callback
        const updatedData = {
          ...formData,
          image: previewUrl
        };
        onUpdate(updatedData);
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          password: '',
          confirmPassword: ''
        }));

        // Use window.location for navigation
        window.location.href = '/teacher/profile';
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        requestData: error.config?.data
      });
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-300px)]">
        <div className="scale-[2.5]">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600">
            <h2 className="text-2xl font-bold text-white">Account Settings</h2>
            <p className="mt-1 text-sm text-indigo-100">Manage your profile information and preferences</p>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Image Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Image</h3>
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
                      <span className="sr-only">Choose profile photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-indigo-50 file:text-indigo-700
                          hover:file:bg-indigo-100"
                      />
                    </label>
                    <p className="mt-1 text-sm text-gray-500">
                      JPG, PNG or GIF (MAX. 2MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Information Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200 ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      required
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200 ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      required
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="+1234567890"
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200 ${
                        errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                      }`}
                      required
                    />
                    {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      min="20"
                      max="255"
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200 ${
                        errors.age ? 'border-red-300' : 'border-gray-300'
                      }`}
                      required
                    />
                    {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
                  </div>
                </div>
              </div>

              {/* Professional Information Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Specialization</label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      maxLength="100"
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200 ${
                        errors.specialization ? 'border-red-300' : 'border-gray-300'
                      }`}
                      required
                    />
                    {errors.specialization && <p className="mt-1 text-sm text-red-600">{errors.specialization}</p>}
                  </div>
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Additional Information</label>
                  <textarea
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    maxLength="500"
                    rows="3"
                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200 ${
                      errors.additionalInfo ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.additionalInfo && <p className="mt-1 text-sm text-red-600">{errors.additionalInfo}</p>}
                </div>
              </div>

              {/* Password Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200 border-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200 ${
                        errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    'Update Profile'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings; 