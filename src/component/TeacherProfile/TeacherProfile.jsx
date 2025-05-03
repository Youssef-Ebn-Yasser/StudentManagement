import { useState } from "react";
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
import AddAssignment from "./AddAssignment";
import AccountSettings from "./settingsPage/AccountSettings";

function TeacherProfile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [batchs, setBatchs]= useState([
    {
    name: 'Enrolled Courses',
    number: 957,
    iconType: faVideo,
    },
    {
    name: 'Active Courses',
    number: 19,
    iconType: faCheck,
    },
    {
    name: 'Students',
    number: 957,
    iconType: faGraduationCap,
    },
    {
    name: 'Course Sold',
    number: 7435,
    iconType: faSellcast,
    },
  ]);

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <>
            <div className="h-60 w-full">
              <img
                src='../../../public/csscode.jpg'
                alt="cover"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="teacherprofile-content">
              <div className="container px-4">
                <div className="flex flex-wrap px-4 gap-5">
                  <div className="w-full mt-10">
                    <MainInfo />
                  </div>
                  <div className="w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                      {batchs.map((batch) => (
                        <div key={batch.name} className="box grid grid-flow-col grid-rows-3 gap-4 bg-[#EBEBFF] flex rounded-md hover:bg-[#e9e9f5]">
                          <div className="row-span-3 flex">
                            <FontAwesomeIcon icon={batch.iconType} className="text-[#564FFD] text-3xl w-24 self-center" />
                          </div>
                          <div className="col-span-2 self-center pt-2 text-black text-2xl">{batch.number}</div>
                          <div className="col-span-2 row-span-2 self-center text-[#4E5566] text-2xl">{batch.name}</div>
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
        return <TeacherCourses />;
      case 'create-course':
        return <CreateCourse />;
      case 'lessons':
        return <AddLesson />;
      case 'materials':
        return <AddMaterial />;
      case 'assignments':
        return <AddAssignment />;
      case 'settings':
        return <AccountSettings />;
      default:
        return null;
    }
  };

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
