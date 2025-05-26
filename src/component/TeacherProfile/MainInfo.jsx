import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faUsers, faVideo } from '@fortawesome/free-solid-svg-icons';
import {
  FaBehance,
  FaDribbble,
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaSkype,
  FaTwitter,
} from "react-icons/fa";

const socials = [
  {
    id: 1,
    icon: <FaFacebookF />,
    link: "https://facebook.com",
  },
  {
    id: 2,
    icon: <FaGithub />,
    link: "#0",
  },
  {
    id: 3,
    icon: <FaLinkedinIn />,
    link: "#0",
  },
  {
    id: 4,
    icon: <FaInstagram />,
    link: "#0",
  },
  {
    id: 5,
    icon: <FaBehance />,
    link: "#0",
  },
  {
    id: 7,
    icon: <FaTwitter />,
    link: "#0",
  },
];

const MainInfo = ({ teacherData }) => {
  return (
    <aside className="sticky top-0 bg-white md:mx-8 lg:mx-4 mb-8 p-6 shadow-md rounded-md -mt-40">
      <div className="w-64 h-64 rounded-md overflow-hidden mx-auto mb-5">
        <img 
          src={teacherData.profileImagePath || '../../../public/teacher-photo.avif'} 
          alt={teacherData?.name || 'teacher'} 
          className="h-full w-full object-cover rounded-full border p-1 border-solid border-black"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '../../../public/teacher-photo.avif';
          }}
        />
      </div>
      <div className="text-center">
        <h3 className="text-2xl text-gray-800 font-bold mb-1">{teacherData?.name || 'Teacher Name'}</h3>
        <p className="text-xs text-gray-400 mb-1">Teacher ID: {teacherData?.id || 'Not available'}</p>
        <p className="text-sm text-gray-400 mb-3">
          {teacherData.specialization || 'Teacher'}
        </p>
        <p className="text-sm text-gray-600 mb-3">
          Age: {teacherData?.age || 'Not provided'}
        </p>
        <div className="flex justify-center gap-2">
            <span>
                <FontAwesomeIcon icon={faStar} style={{color: "#FFD43B",}} /> {teacherData?.rating || 0}
                <span className="text-[#6E7485]">({teacherData?.reviews || 0} review)</span> 
            </span>
            <span>
                <FontAwesomeIcon icon={faUsers} style={{color: "#564FFD",}}/> {teacherData?.students || 0}
                <span className="text-[#6E7485]">Students</span>
            </span>
            <span>
                <FontAwesomeIcon icon={faVideo} style={{color: "#F56234",}}/> {teacherData?.courses || 0}
                <span className="text-[#6E7485]">Courses</span>
            </span>
        </div>
        <ul className="flex flex-wrap justify-center">
          {socials.map((social, id) => (
            <SocialIcon social={social} key={id} />
          ))}
        </ul>
      </div>
      <div className="text-start pt-4">
        <h3 className="text-md mb-2 uppercase font-medium text-gray-800">
          About Me
        </h3>
        <p className="text-gray-400 text font-light leading-relaxed">
          {teacherData?.additionalInfo || 'No description available'}
        </p>
      </div>
      <div className="text-start pt-4">
        <h3 className="text-md mb-2 uppercase font-medium text-gray-800">
          Contact Information
        </h3>
        <div className="space-y-2">
          <p className="text-gray-600">
            <span className="font-medium">Email:</span> {teacherData?.email || 'Not provided'}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default MainInfo;

const SocialIcon = (props) => {
  const {icon} = props.social;
  const {link} = props.social
  return (
    <li className="m-2 mt-5">
      <a
        href={link}
        className="w-8 h-8 bg-purple-100 rounded text-purple-800 flex items-center justify-center hover:text-white hover:bg-purple-600"
      >
        {icon}
      </a>
    </li>
  );
};
