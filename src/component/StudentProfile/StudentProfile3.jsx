import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaPhone,
  FaTachometerAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaFilePdf,
  FaFileImage,
  FaFileAlt,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';
import axios from 'axios';

export default function StudentProfile3() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  // Show more/less state for assignments and quizzes
  const [showAllAssignments, setShowAllAssignments] = useState(false);
  const [showAllQuizzes, setShowAllQuizzes] = useState(false);

  const studentId = localStorage.getItem('guestId') || 160;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(
          `https://e-learn-v1.runasp.net/api/Student/GetStudentProfile/profile/${studentId}`
        );
        if (res.data && res.data.succeeded) {
          setProfile(res.data.data);
        } else {
          setError('Failed to fetch profile data');
        }
      } catch (err) {
        setError('Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [studentId]);

  const handleGoToDashboard = () => {
    navigate('/studentdashboard');
  };

  const handleEditProfile = () => {
    navigate('/studentprofile/edit-profile');
  };

  // Helper to get file icon
  const getFileIcon = (path) => {
    if (!path) return <FaFileAlt />;
    if (path.endsWith('.pdf')) return <FaFilePdf className="text-red-500" />;
    if (/\.(jpg|jpeg|png|gif)$/i.test(path)) return <FaFileImage className="text-blue-500" />;
    return <FaFileAlt />;
  };

  // Helper to render a progress bar for percentage
  const renderProgressBar = (percent, color = 'indigo') => (
    <div className="w-full flex items-center gap-2">
      <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${color === 'green'
            ? 'bg-green-500'
            : color === 'yellow'
            ? 'bg-yellow-400'
            : 'bg-indigo-500'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="ml-2 text-xs font-semibold" style={{ minWidth: 32 }}>
        {percent}%
      </span>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7fa]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7fa]">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold">{error || "No profile data found."}</p>
          <p className="text-sm mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  const { studentInfo, assignments, quizzes, attendance } = profile;

  // Only show first 5 unless showAll is true
  const assignmentsToShow = showAllAssignments ? assignments : assignments.slice(0, 5);
  const quizzesToShow = showAllQuizzes ? quizzes : quizzes.slice(0, 5);

  return (
    <div className="bg-[#f4f7fa] min-h-screen px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white border rounded-2xl p-8 shadow-lg mb-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative group">
              <img
                src={studentInfo.imageUrl}
                alt={studentInfo.name}
                className="w-36 h-36 rounded-full object-cover border-4 border-indigo-200 shadow-md transition-transform duration-300 group-hover:scale-105"
              />
              <button
                onClick={handleEditProfile}
                className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
                title="Edit Profile Picture"
              >
                <i className="fa fa-camera"></i>
              </button>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-extrabold text-indigo-700 mb-2">{studentInfo.name}</h1>
              <p className="text-gray-500 mb-2">{studentInfo.email}</p>
              <p className="text-gray-700 flex items-center gap-2 justify-center md:justify-start mb-4">
                <FaPhone className="text-indigo-600" /> {studentInfo.phone}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <button
                  onClick={handleEditProfile}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg font-semibold shadow hover:from-indigo-600 hover:to-blue-600 transition-all"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleGoToDashboard}
                  className="flex items-center gap-2 px-6 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-semibold shadow hover:bg-indigo-100 border border-indigo-200 transition-all"
                  title="Go to Dashboard"
                >
                  <FaTachometerAlt className="text-lg" />
                  Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Assignments Section */}
        <div className="bg-white border rounded-2xl p-6 shadow mb-10">
          <h2 className="text-xl font-bold text-indigo-700 mb-4">Assignments</h2>
          {assignments && assignments.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-indigo-50">
                      <th className="py-2 px-4 text-left">#</th>
                      <th className="py-2 px-4 text-left">Course</th>
                      <th className="py-2 px-4 text-left">Lesson</th>
                      <th className="py-2 px-4 text-left">File</th>
                      <th className="py-2 px-4 text-left">Degree %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignmentsToShow.map((a, idx) => (
                      <tr key={a.id} className="border-b last:border-b-0">
                        <td className="py-2 px-4">{showAllAssignments ? idx + 1 : idx + 1}</td>
                        <td className="py-2 px-4">{a.courseName}</td>
                        <td className="py-2 px-4">{a.lessonName}</td>
                        <td className="py-2 px-4">
                          <a
                            href={a.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-indigo-600 hover:underline"
                          >
                            {getFileIcon(a.path)}
                            View
                          </a>
                        </td>
                        <td className="py-2 px-4 min-w-[120px]">
                          {renderProgressBar(
                            a.degreePercentage,
                            a.degreePercentage === 100
                              ? 'green'
                              : a.degreePercentage > 0
                              ? 'yellow'
                              : 'indigo'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {assignments.length > 5 && (
                <div className="flex justify-center mt-3">
                  <button
                    className="flex items-center gap-1 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-semibold shadow hover:bg-indigo-100 border border-indigo-200 transition-all"
                    onClick={() => setShowAllAssignments((prev) => !prev)}
                  >
                    {showAllAssignments ? (
                      <>
                        Show Less <FaChevronUp />
                      </>
                    ) : (
                      <>
                        Show All <FaChevronDown />
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-gray-500">No assignments found.</div>
          )}
        </div>

        {/* Quizzes Section */}
        <div className="bg-white border rounded-2xl p-6 shadow mb-10">
          <h2 className="text-xl font-bold text-indigo-700 mb-4">Quizzes</h2>
          {quizzes && quizzes.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-indigo-50">
                      <th className="py-2 px-4 text-left">#</th>
                      <th className="py-2 px-4 text-left">Quiz Title</th>
                      <th className="py-2 px-4 text-left">Score</th>
                      <th className="py-2 px-4 text-left">Passed</th>
                      <th className="py-2 px-4 text-left">Grade %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizzesToShow.map((q, idx) => (
                      <tr key={q.quizId} className="border-b last:border-b-0">
                        <td className="py-2 px-4">{showAllQuizzes ? idx + 1 : idx + 1}</td>
                        <td className="py-2 px-4">{q.quizTitle}</td>
                        <td className="py-2 px-4">{q.score !== null ? q.score : '-'}</td>
                        <td className="py-2 px-4">
                          {q.isPassed === true ? (
                            <span className="flex items-center gap-1 text-green-600 font-semibold">
                              <FaCheckCircle /> Yes
                            </span>
                          ) : q.isPassed === false ? (
                            <span className="flex items-center gap-1 text-red-600 font-semibold">
                              <FaTimesCircle /> No
                            </span>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>
                        <td className="py-2 px-4 min-w-[120px]">
                          {q.gradingRating !== null ? (
                            renderProgressBar(
                              q.gradingRating,
                              q.gradingRating === 100
                                ? 'green'
                                : q.gradingRating > 0
                                ? 'yellow'
                                : 'indigo'
                            )
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {quizzes.length > 5 && (
                <div className="flex justify-center mt-3">
                  <button
                    className="flex items-center gap-1 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-semibold shadow hover:bg-indigo-100 border border-indigo-200 transition-all"
                    onClick={() => setShowAllQuizzes((prev) => !prev)}
                  >
                    {showAllQuizzes ? (
                      <>
                        Show Less <FaChevronUp />
                      </>
                    ) : (
                      <>
                        Show All <FaChevronDown />
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-gray-500">No quizzes found.</div>
          )}
        </div>

        {/* Attendance Section */}
        <div className="bg-white border rounded-2xl p-6 shadow mb-10">
          <h2 className="text-xl font-bold text-indigo-700 mb-4">Attendance</h2>
          {attendance && attendance.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-indigo-50">
                    <th className="py-2 px-4 text-left">#</th>
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((att, idx) => (
                    <tr key={att.id || idx} className="border-b last:border-b-0">
                      <td className="py-2 px-4">{idx + 1}</td>
                      <td className="py-2 px-4">{att.date || '-'}</td>
                      <td className="py-2 px-4">
                        {att.status || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-gray-500">No attendance records found.</div>
          )}
        </div>
      </div>
    </div>
  );
}