import { useState } from "react";
import MainInfo from "./MainInfo";
import './TeacherProfile.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faCheck, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { faSellcast } from '@fortawesome/free-brands-svg-icons';

function TeacherProfile() {
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
    return (
        <div className=" min-h-screen relative bg-gray-50 pb-10">
            <div className="h-60 w-full">
              <img
                src='../../../public/csscode.jpg'
                alt="cover"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <main className="teacherprofile-content">
                <div className="container px-4">
                    <div className="flex flex-wrap px-4 gap-5">
                        <div className="w-full mt-10">
                          <MainInfo />
                        </div>
                        <div className="w-full ">
                            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                {batchs.map( (batch)=>(
                                  <div className="box grid grid-flow-col grid-rows-3 gap-4 bg-[#EBEBFF] flex rounded-md hover:bg-[#e9e9f5]">
                                      <div className="row-span-3 flex">
                                        <FontAwesomeIcon icon={batch.iconType} className="text-[#564FFD] text-3xl w-24 self-center" />
                                      </div>
                                      <div className="col-span-2 self-center pt-2 text-black text-2xl">{batch.number}</div>
                                      <div className="col-span-2 row-span-2  self-center text-[#4E5566] text-2xl">{batch.name}</div>
                                  </div>
                                ))}
                                
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default TeacherProfile;
