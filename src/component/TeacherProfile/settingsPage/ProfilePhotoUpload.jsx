import { Upload } from "lucide-react";
import { useState } from "react";

const ProfilePhotoUpload = () => {
  const [previewUrl, setPreviewUrl] = useState("../../../../public/teacher-photo.avif");

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-md">
      <div className="relative w-full aspect-square mb-2">
        <div className="w-full h-full bg-pink-200 rounded-md flex items-center justify-center overflow-hidden">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src="/lovable-uploads/25243898-d82a-40a0-847d-aea047363e67.png"
              alt="Default profile"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <label htmlFor="profile-upload" className="absolute bottom-4 left-0 right-0 mx-auto w-36 bg-gray-800 bg-opacity-70 text-white py-2 px-3 rounded flex items-center justify-center cursor-pointer hover:bg-opacity-80 transition-all">
          <Upload size={16} className="mr-2" />
          <span className="text-sm font-medium">Upload Photo</span>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
      <p className="text-gray-500 text-xs text-center">
        Image size should be under 1MB and image ratio needs to be 1:1
      </p>
    </div>
  );
};

export default ProfilePhotoUpload;
