import { useState, useEffect } from "react";
import MainInfo from "./MainInfo";
import './TeacherProfile.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faCheck, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { faSellcast } from '@fortawesome/free-brands-svg-icons';
import Sidebar from "./Sidebar";
import TeacherCourses from "./TeacherCourses";
import CreateCourse from "./CreateCourse";
import AddLesson from "./AddLesson";
import AddMaterial from "./AddMaterial";
import AccountSettings from "./settingsPage/AccountSettings";
import { courseService } from '../../services/courseService';
import Loader from '../Loader/Loader';

function TeacherProfile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [teacherData, setTeacherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setIsLoading(true);
        const response = await courseService.getTeacherStats(5);
        setTeacherData(response.data);
      } catch (error) {
        setError(error.message || 'Failed to load teacher data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeacherData();
  }, []);

  const stats = [
    {
      name: 'Enrolled Courses',
      number: teacherData?.enrolledCourses || 0,
      iconType: faVideo,
    },
    {
      name: 'Active Courses',
      number: teacherData?.activeCourses || 0,
      iconType: faCheck,
    },
    {
      name: 'Students',
      number: teacherData?.students || 0,
      iconType: faGraduationCap,
    },
    {
      name: 'Course Sold',
      number: teacherData?.courseSold || 0,
      iconType: faSellcast,
    },
  ];

  const handleProfileUpdate = (updatedData) => {
    setTeacherData(prev => ({
      ...prev,
      ...updatedData
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <>
            <div className="h-60 w-full">
              <img
                src={teacherData?.coverImage || '../../../public/csscode.jpg'}
                alt="cover"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="teacherprofile-content">
              <div className="container px-4">
                <div className="flex flex-wrap px-4 gap-5">
                  <div className="w-full mt-10">
                    <MainInfo teacherId={5} teacherData={teacherData} />
                  </div>
                  <div className="w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                      {stats.map((stat) => (
                        <div key={stat.name} className="box grid grid-flow-col grid-rows-3 gap-4 bg-[#EBEBFF] flex rounded-md hover:bg-[#e9e9f5]">
                          <div className="row-span-3 flex">
                            <FontAwesomeIcon icon={stat.iconType} className="text-[#564FFD] text-3xl w-24 self-center" />
                          </div>
                          <div className="col-span-2 self-center pt-2 text-black text-2xl">{stat.number}</div>
                          <div className="col-span-2 row-span-2 self-center text-[#4E5566] text-2xl">{stat.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 'courses':
        return <TeacherCourses teacherId={5} setActiveTab={setActiveTab} />;
      case 'create-course':
        return <CreateCourse teacherId={5} />;
      case 'lessons':
        return <AddLesson teacherId={5} />;
      case 'materials':
        return <AddMaterial teacherId={5} />;
      case 'settings':
        return <AccountSettings teacherData={{...teacherData, id: 5}} onUpdate={handleProfileUpdate} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="scale-[2.5]">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-600">{error}</div>;
  }

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default TeacherProfile;
