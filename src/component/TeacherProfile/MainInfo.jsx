import React, { useState } from "react";
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

const MainInfo = () => {
  const[instrutorInfo, setInstructorInfo] = useState({
    instructorName : "Ahmed Ahmed" ,
    instructorSpecialization: "Frontend Instructor",
    instructorExperience: 12,
    instructorRating: 4.8,
    instructorReviews: "13,405",
    instructorStudents: "20,354",
    instructorCourses: 7,
    instructorAbout: " Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diamnonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus.",
  });
  return (
    <aside className="sticky top-0 bg-white md:mx-8 lg:mx-4 mb-8 p-6 shadow-md rounded-md -mt-40">
      <div className="w-24 h-24 rounded-md overflow-hidden mx-auto mb-5">
        <img src='../../../public/download.jpeg' alt="shafiqhammad" className="w-full rounded-full border p-1 border-solid border-black" />
      </div>
      <div className="text-center">
        <h3 className="text-2xl text-gray-800 font-bold mb-1">{instrutorInfo.instructorName}</h3>
        <p className="text-sm text-gray-400 mb-3">
          {instrutorInfo.instructorSpecialization}
          <a href="#0" className="text-purple-600 pl-1">
            {instrutorInfo.instructorExperience} years experience
          </a>
        </p>
        <div className="flex justify-center gap-2">
            <span>
                <FontAwesomeIcon icon={faStar} style={{color: "#FFD43B",}} /> {instrutorInfo.instructorRating}
                <span className="text-[#6E7485]">({instrutorInfo.instructorReviews} review)</span> 
            </span>
            <span>
                <FontAwesomeIcon icon={faUsers} style={{color: "#564FFD",}}/> {instrutorInfo.instructorStudents}
                <span className="text-[#6E7485]">Students</span>
            </span>
            <span>
                <FontAwesomeIcon icon={faVideo} style={{color: "#F56234",}}/> {instrutorInfo.instructorCourses}
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
          {instrutorInfo.instructorAbout}
        </p>
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
