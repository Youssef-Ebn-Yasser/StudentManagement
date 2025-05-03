import { useState } from "react";
import ProfilePhotoUpload from "./ProfilePhotoUpload";
import SocialProfileSection from "./SocialProfileSection";
import NotificationsSection from "./NotificationsSection";
import ChangePasswordSection from "./ChangePasswordSection";

const AccountSettings = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    phoneNumber: "",
    title: "",
    biography: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveChanges = () => {
    
  };

  return (
    <div className="bg-white min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h1>
          
          <form className="space-y-6">
            <div className="bg-white rounded-md">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full name
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-0 focus:outline-none focus:border-gray-400"
                      />
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-0 focus:outline-none focus:border-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-0 focus:outline-none focus:border-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="flex">
                      <div className="flex-none">
                        <select className="h-full px-2 py-2 bg-white border border-r-0 border-gray-300 rounded-l-md focus:ring-0 focus:outline-none focus:border-gray-400 text-[#4F39F6] font-medium">
                          <option>+20</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        name="phoneNumber"
                        placeholder="Your Phone number..."
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-r-md focus:ring-0 focus:outline-none focus:border-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="title"
                        placeholder="Your title, proffesion or small biography"
                        value={formData.title}
                        onChange={handleInputChange}
                        maxLength={50}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-0 focus:outline-none focus:border-gray-400"
                      />
                      <span className="absolute right-3 top-2 text-gray-400 text-sm">
                        {formData.title.length}/50
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Biography
                    </label>
                    <textarea
                      name="biography"
                      placeholder="Your title, proffesion or small biography"
                      value={formData.biography}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-0 focus:outline-none focus:border-gray-400"
                    />
                  </div>

                  <button
                    onClick={handleSaveChanges}
                    className="px-6 py-2 bg-[#4F39F6] hover:bg-[#432DD7] cursor-pointer text-white font-medium rounded-md transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
                
                <div className="lg:col-span-1">
                  <ProfilePhotoUpload />
                </div>
              </div>
            </div>

            <div className="mt-12">
              <SocialProfileSection onSave={handleSaveChanges} />
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
              <NotificationsSection onSave={handleSaveChanges} />
              <ChangePasswordSection onSave={handleSaveChanges} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
