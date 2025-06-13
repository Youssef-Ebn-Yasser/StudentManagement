import React from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { FaCog, FaBook, FaPlus, FaChalkboardTeacher, FaFileUpload, FaClipboardList, FaChartBar } from "react-icons/fa";
import { Users } from 'lucide-react'; // Importing Users icon from lucide-react
=======
import { FaCog, FaBook, FaPlus, FaChalkboardTeacher, FaFileUpload, FaClipboardList, FaChartBar, FaQuestionCircle, FaTasks } from "react-icons/fa";
>>>>>>> Stashed changes
=======
import { FaCog, FaBook, FaPlus, FaChalkboardTeacher, FaFileUpload, FaClipboardList, FaChartBar, FaQuestionCircle, FaTasks } from "react-icons/fa";
>>>>>>> Stashed changes

const MainInfo = ({ teacherData }) => {
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    navigate('/teacher/settings');
  };
  const handleStudentsClick = () => {
    navigate('/teacher/profile/students');
  };

  const quickActions = [
    {
      icon: <FaBook className="w-5 h-5" />,
      label: "My Courses",
      onClick: () => navigate('/teacher/courses'),
      description: "View and manage your courses",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <FaPlus className="w-5 h-5" />,
      label: "Create Course",
      onClick: () => navigate('/teacher/createcourse'),
      description: "Create a new course",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <FaChalkboardTeacher className="w-5 h-5" />,
      label: "Add Lesson",
      onClick: () => navigate('/teacher/add-lesson'),
      description: "Add new lessons to courses",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <FaFileUpload className="w-5 h-5" />,
      label: "Upload Material",
      onClick: () => navigate('/teacher/add-material'),
      description: "Upload course materials",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: <FaClipboardList className="w-5 h-5" />,
      label: "Manage Quiz",
      onClick: () => navigate('/teacher/manage-quiz'),
      description: "Create and manage quizzes",
      color: "from-yellow-500 to-yellow-600"
    },
    {
      icon: <FaQuestionCircle className="w-5 h-5" />,
      label: "Review Student Answers",
      onClick: () => navigate('/teacher/review-student-answers'),
      description: "Review and grade student quiz answers",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: <FaTasks className="w-5 h-5" />,
      label: "Manage Assignments",
      onClick: () => navigate('/teacher/assignments'),
      description: "View and manage student assignments",
      color: "from-red-500 to-red-600"
    },
    {
      icon: <FaChartBar className="w-5 h-5" />,
      label: "Dashboard",
      onClick: () => navigate('/teacher/dashboard'),
      description: "View your teaching analytics",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  return (
    <aside className="sticky top-0 bg-white md:mx-8 lg:mx-4 mb-8 p-6 shadow-md rounded-md -mt-40 relative">
      <button
        onClick={handleStudentsClick}
        className="        bg-blue-600 hover:bg-blue-700 active:bg-blue-800 
        text-white font-semibold 
        py-3 px-6 
        rounded-xl 
        shadow-lg hover:shadow-xl 
        transition-all duration-300 ease-in-out 
        inline-flex items-center justify-center
        space-x-3 
        focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-75 
        max-w-xs mx-auto 
        transform hover:scale-105 "
      >
      <Users size={24} className="mr-2" /> {/* Users icon from lucide-react */}
      <span>View Students</span>
      </button>
      <button
        onClick={handleSettingsClick}
        className="absolute  top-4 right-4 inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50"
      >
        <FaCog className="mr-2" />
        Edit Profile
      </button>
   
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

      {/* Quick Actions Section */}
      <div className="text-start pt-6 border-t border-gray-200 mt-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800 bg-gradient-to-r from-violet-600 to-violet-800 bg-clip-text ">
              Quick Actions
            </h3>
            <p className="text-sm text-gray-500 mt-1">Access your most used features</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="group relative flex items-center gap-4 px-4 py-5 bg-white hover:bg-gradient-to-r hover:from-white hover:to-violet-50 border border-gray-200 hover:border-violet-200 rounded-md transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className={`flex items-center justify-center w-14 h-14 rounded-md bg-gradient-to-br ${action.color} group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-white transform group-hover:rotate-12 transition-transform duration-300 text-xl">
                  {action.icon}
                </span>
              </div>
              <div className="flex flex-col items-start flex-grow">
                <span className="text-base font-semibold text-gray-700 group-hover:text-violet-700 transition-colors duration-200">
                  {action.label}
                </span>
                <span className="text-sm text-gray-500 group-hover:text-violet-500 transition-colors duration-200">
                  {action.description}
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-md bg-gray-50 group-hover:bg-violet-50 flex items-center justify-center transition-colors duration-200">
                  <svg 
                    className="w-5 h-5 text-gray-400 group-hover:text-violet-500 transform group-hover:translate-x-1 transition-all duration-200" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <div className="absolute inset-0 rounded-md bg-gradient-to-r from-violet-500/0 to-violet-500/0 group-hover:from-violet-500/5 group-hover:to-violet-500/10 transition-all duration-300" />
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default MainInfo;
