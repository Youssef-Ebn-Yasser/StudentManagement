import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCog, FaBook, FaPlus, FaChalkboardTeacher, FaFileUpload, FaClipboardList, FaChartBar, FaQuestionCircle, FaTasks } from "react-icons/fa";
import { Users } from "lucide-react";

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
    <aside className="relative top-0 bg-white md:mx-8 lg:mx-4 mb-8 p-6 shadow-md rounded-md -mt-40 relative">
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
            <h3 className="text-xl font-bold text-gray-800">
              Quick Actions
            </h3>
            <p className="text-sm text-gray-500 mt-1">Access your most used features</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="bg-indigo-50 hover:bg-indigo-100 rounded-lg p-6 text-center transition-colors duration-300 flex flex-col items-center justify-center"
              type="button"
            >
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl text-indigo-600">{action.icon}</span>
              </div>
              <h3 className="text-lg font-semibold text-indigo-600 mb-1">{action.label}</h3>
              <span className="text-sm text-gray-500">{action.description}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default MainInfo;
