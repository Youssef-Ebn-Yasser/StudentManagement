import { useState } from "react";
import { Facebook, Instagram, Twitter, Linkedin, Globe} from "lucide-react";

const SocialProfileSection = ({ onSave }) => {
  const [socialProfiles, setSocialProfiles] = useState({
    website: "",
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSocialProfiles({
      ...socialProfiles,
      [name]: value,
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{t("social-profiles")}</h2>
      
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe size={20} className="text-gray-400" />
            </div>
            <input
              type="url"
              name="website"
              placeholder="yoursite.com"
              value={socialProfiles.website}
              onChange={handleInputChange}
              className="w-full pl-20 px-4 py-2 border border-gray-300 rounded-md focus:ring-0 focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Facebook
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Facebook size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              name="facebook"
              placeholder="username"
              value={socialProfiles.facebook}
              onChange={handleInputChange}
              className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-0 focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Twitter
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Twitter size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              name="twitter"
              placeholder="username"
              value={socialProfiles.twitter}
              onChange={handleInputChange}
              className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-0 focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instagram
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Instagram size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              name="instagram"
              placeholder="username"
              value={socialProfiles.instagram}
              onChange={handleInputChange}
              className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-0 focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Linkedin
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Linkedin size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              name="linkedin"
              placeholder="username"
              value={socialProfiles.linkedin}
              onChange={handleInputChange}
              className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-0 focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={onSave}
            className="px-6 py-2 bg-[#4F39F6] hover:bg-[#432DD7] cursor-pointer text-white font-medium rounded-md  transition-colors"
          >
            {t("save-changes")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SocialProfileSection;
