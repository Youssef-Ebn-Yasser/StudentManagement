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
  console.log('TeacherProfile component mounted');
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('profile');
  const [teacherData, setTeacherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const localTeacherId = user?.id || Number(localStorage.getItem('guestId'));

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
        if (!localTeacherId) {
          console.error('Teacher ID not found in user object or localStorage');
          throw new Error('Teacher ID not found');
        }
        const response = await courseService.getTeacherDetails(localTeacherId);
        console.log('Full teacher response:', JSON.stringify(response, null, 2));
        console.log('Response data:', response.data);
        
        // Check for successful response
        if (response && response.data) {
          console.log('Setting teacher data:', response.data);
          setTeacherData(response.data);
        } else {
          console.error('Response structure:', {
            hasResponse: !!response,
            hasData: !!response?.data,
            responseKeys: response ? Object.keys(response) : 'No response object'
          });
          throw new Error('Failed to load teacher data');
        }
      } catch (error) {
        console.error('Error in fetchTeacherData:', error);
        setError(error.message || 'Failed to load teacher data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeacherData();
  }, [localTeacherId]);

  const handleProfileUpdate = (updatedData) => {
    setTeacherData(prev => ({
      ...prev,
      ...updatedData
    }));
  };

  const renderContent = () => {
    console.log('renderContent called, activeTab:', activeTab);
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
        console.log('Rendering TeacherCourses with teacherId:', localTeacherId);
        return <TeacherCourses setActiveTab={setActiveTab} />;
      case 'create-course':
        return <CreateCourse teacherId={localTeacherId} />;
      case 'lessons':
        return <AddLesson teacherId={localTeacherId} />;
      case 'materials':
        return <AddMaterial teacherId={localTeacherId} />;
      case 'settings':
        console.log('teacherData:', teacherData);
        console.log('localTeacherId:', localTeacherId);
        if (isLoading) {
          return <Loader />;
        }
        if (!teacherData || !localTeacherId) {
          return <div className="text-red-600 text-center mt-10">Teacher ID is missing. Please log in again.</div>;
        }
        return <AccountSettings teacherData={{...teacherData, id: localTeacherId}} onUpdate={handleProfileUpdate} />;
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
