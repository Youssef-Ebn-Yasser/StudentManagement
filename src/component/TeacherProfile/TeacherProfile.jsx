import { useState, useEffect } from "react";
import MainInfo from "./MainInfo";
import './TeacherProfile.css'
import { useLocation } from 'react-router-dom';

import TeacherCourses from "./TeacherCourses";
import CreateCourse from "./CreateCourse";
import AddLesson from "./AddLesson";
import AddMaterial from "./AddMaterial";
import AccountSettings from "./settingsPage/AccountSettings";
import { courseService } from '../../services/courseService';
import Loader from '../Loader/Loader';
import TeacherDashboard from '../TeacherDashboard/TeacherDashboard';
import { useSelector } from 'react-redux';

function TeacherProfile() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('profile');
  const [teacherData, setTeacherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check for tab parameter in URL
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setIsLoading(true);
        console.log('Current user object:', user);
        if (!user?.id) {
          console.error('Teacher ID not found in user object');
          throw new Error('Teacher ID not found');
        }
        const response = await courseService.getTeacherStats(user.id);
        console.log('Teacher data response:', response);
        if (response.succeeded) {
          setTeacherData(response.data);
        } else {
          throw new Error(response.message || 'Failed to load teacher data');
        }
      } catch (error) {
        console.error('Error in fetchTeacherData:', error);
        setError(error.message || 'Failed to load teacher data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeacherData();
  }, [user?.id]);

  const handleProfileUpdate = (updatedData) => {
    setTeacherData(prev => ({
      ...prev,
      ...updatedData
    }));
  };

  const renderContent = () => {
    console.log('Rendering content with teacherData:', teacherData);
    switch (activeTab) {
      case 'dashboard':
        return <TeacherDashboard />;
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
                    <MainInfo teacherData={teacherData} />
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 'courses':
        console.log('Rendering TeacherCourses with teacherId:', user?.id);
        return <TeacherCourses setActiveTab={setActiveTab} />;
      case 'create-course':
        return <CreateCourse teacherId={user?.id} />;
      case 'lessons':
        return <AddLesson teacherId={user?.id} />;
      case 'materials':
        return <AddMaterial teacherId={user?.id} />;
      case 'settings':
        return <AccountSettings teacherData={{...teacherData, id: user?.id}} onUpdate={handleProfileUpdate} />;
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
    <div className="min-h-screen bg-gray-50">
      <div className="w-full min-h-screen bg-white">
        {renderContent()}
      </div>
    </div>
  );
}

export default TeacherProfile;
