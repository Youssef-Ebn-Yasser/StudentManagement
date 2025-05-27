import React from "react";

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
