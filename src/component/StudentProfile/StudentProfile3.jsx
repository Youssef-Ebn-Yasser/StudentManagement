import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import axiosInstance from '../../services/axiosInstance';
import { useSelector } from 'react-redux';

export default function StudentProfile3() {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  // Show more/less state for assignments and quizzes
  const [showAllAssignments, setShowAllAssignments] = useState(false);
  const [showAllQuizzes, setShowAllQuizzes] = useState(false);

  const studentId = user?.id;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!studentId) {
        setError('Student ID not found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('StudentProfile3 - Fetching profile for studentId:', studentId);
        const res = await axiosInstance.get(
          `/api/Studentprofile/${studentId}`
        );
        if (res.data && res.data.succeeded) {
          setProfile(res.data.data);
        } else {
          setError(t('fetch-profile-fail'));
        }
      } catch (err) {
        console.error('StudentProfile3 - Error fetching profile:', err);
        if (err.response?.status === 401) {
          setError('Authentication failed. Please log in again.');
        } else if (err.response?.status === 403) {
          setError('Access denied. You do not have permission to view this profile.');
        } else if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError(t('fetch-profile-fail'));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [studentId, t]);

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
          <p className="text-xl font-semibold">{error || t('no-profile-data')}</p>
          <p className="text-sm mt-2">{t('refresh-page')}</p>
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
                title={t('edit-profile-picture')}
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
                  {t('edit-profile')}
                </button>
                <button
                  onClick={handleGoToDashboard}
                  className="flex items-center gap-2 px-6 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-semibold shadow hover:bg-indigo-100 border border-indigo-200 transition-all"
                  title={t('go-to-dashboard')}
                >
                  <FaTachometerAlt className="text-lg" />
                  {t('dashboard')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Assignments Section */}
        <div className="bg-white border rounded-2xl p-6 shadow mb-10">
          <h2 className="text-xl font-bold text-indigo-700 mb-4">{t('assignments')}</h2>
          {assignments && assignments.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-indigo-50">
                      <th className="py-2 px-4 text-left">#</th>
                      <th className="py-2 px-4 text-left">{t('course')}</th>
                      <th className="py-2 px-4 text-left">{t('lesson')}</th>
                      <th className="py-2 px-4 text-left">{t('file')}</th>
                      <th className="py-2 px-4 text-left">{t('degree-percent')}</th>
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
                            {t('view')}
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
                        {t('show-less')} <FaChevronUp />
                      </>
                    ) : (
                      <>
                        {t('show-all')} <FaChevronDown />
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-gray-500">{t('no-assignments-found')}</div>
          )}
        </div>

        {/* Quizzes Section */}
        <div className="bg-white border rounded-2xl p-6 shadow mb-10">
          <h2 className="text-xl font-bold text-indigo-700 mb-4">{t('quizzes')}</h2>
          {quizzes && quizzes.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-indigo-50">
                      <th className="py-2 px-4 text-left">#</th>
                      <th className="py-2 px-4 text-left">{t('quiz-title')}</th>
                      <th className="py-2 px-4 text-left">{t('score')}</th>
                      <th className="py-2 px-4 text-left">{t('passed')}</th>
                      <th className="py-2 px-4 text-left">{t('grade-percent')}</th>
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
                              <FaCheckCircle /> {t('yes')}
                            </span>
                          ) : q.isPassed === false ? (
                            <span className="flex items-center gap-1 text-red-600 font-semibold">
                              <FaTimesCircle /> {t('no')}
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
                        {t('show-less')} <FaChevronUp />
                      </>
                    ) : (
                      <>
                        {t('show-all')} <FaChevronDown />
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-gray-500">{t('no-quizzes-found')}</div>
          )}
        </div>

        {/* Attendance Section */}
        <div className="bg-white border rounded-2xl p-6 shadow mb-10">
          <h2 className="text-xl font-bold text-indigo-700 mb-4">{t('attendance')}</h2>
          {attendance && attendance.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-indigo-50">
                    <th className="py-2 px-4 text-left">#</th>
                    <th className="py-2 px-4 text-left">{t('date')}</th>
                    <th className="py-2 px-4 text-left">{t('status')}</th>
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
            <div className="text-gray-500">{t('no-attendance-records-found')}</div>
          )}
        </div>
      </div>
    </div>
  );
}