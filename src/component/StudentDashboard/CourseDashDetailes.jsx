import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import Loader from '../Loader/Loader';

export default function CourseDashDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [assignmentsByLesson, setAssignmentsByLesson] = useState({});
  const [openLesson, setOpenLesson] = useState(null);
  const [uploading, setUploading] = useState({});
  const [uploadSuccess, setUploadSuccess] = useState({});
  const [uploadError, setUploadError] = useState({});

  // Replace with your actual studentId
  const studentId = 85;

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://e-learn-v1.runasp.net/Course/Get/${id}`);
        if (response.data.succeeded) {
          setCourse(response.data.data);
        } else {
          throw new Error(response.data.massage || 'Failed to load course details');
        }
      } catch (err) {
        setError(err.message || 'Failed to load course details');
        console.error('Error fetching course details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, [id]);

  // Fetch assignments for this course using static studentName "yousef"
  useEffect(() => {
    const fetchAssignments = async () => {
      if (!course?.title) return;
      try {
        const res = await axios.get(
          `https://e-learn-v1.runasp.net/api/Assignment/GetAllAssignmentOfCourse?courseName=${encodeURIComponent(
            course.title
          )}&studentName=yousef`
        );
        if (res.data.succeeded && Array.isArray(res.data.data)) {
          // Group assignments by lessonName
          const grouped = {};
          res.data.data.forEach((a) => {
            if (!grouped[a.lessonName]) grouped[a.lessonName] = [];
            grouped[a.lessonName].push(a);
          });
          setAssignmentsByLesson(grouped);
        }
      } catch (err) {
        setAssignmentsByLesson({});
      }
    };
    fetchAssignments();
  }, [course]);

  const handleFileChange = (lessonId, assignmentIdx, e) => {
    const file = e.target.files[0];
    if (!file) return;
    uploadAssignment(lessonId, file, assignmentIdx);
  };

  const uploadAssignment = async (lessonId, file, assignmentIdx) => {
    setUploading((prev) => ({ ...prev, [lessonId]: true }));
    setUploadSuccess((prev) => ({ ...prev, [lessonId]: false }));
    setUploadError((prev) => ({ ...prev, [lessonId]: null }));

    const formData = new FormData();
    formData.append('file', file);
    formData.append('studentId', studentId);
    formData.append('lessonId', lessonId);

    try {
      await axios.post(
        'https://e-learn-v1.runasp.net/api/Assignment/upload/assignment',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setUploadSuccess((prev) => ({ ...prev, [lessonId]: true }));
    } catch (err) {
      setUploadError((prev) => ({
        ...prev,
        [lessonId]:
          err.response?.data?.title ||
          err.response?.data?.errors?.dto?.[0] ||
          'Upload failed',
      }));
    } finally {
      setUploading((prev) => ({ ...prev, [lessonId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-xl mb-4">Course not found</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const rating = 4.5;
  const price = course.price || 49;
  const lessonsCount = course.lessonInfo?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Course Image */}
            <div className="w-full md:w-1/2">
              <img
                src={course.imagePath}
                alt={course.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            {/* Course Info */}
            <div className="w-full md:w-1/2">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
              <p className="text-gray-600 mb-6">{course.description}</p>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  {rating}
                  <FaStar className="text-yellow-400 ml-1" />
                  <span className="ml-2 text-gray-600">{lessonsCount} lessons</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-1 text-gray-600">{course.hours} hours</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                  <span className="ml-1 text-gray-600">
                    Teacher:{' '}
                    <button
                      onClick={() => navigate(`/courses/teacher/${course.teacherName}`)}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {course.teacherName || 'Not specified'}
                    </button>
                  </span>
                </div>
              </div>

              <div className="text-3xl font-bold text-gray-900">${price}</div>
            </div>
          </div>
        </div>

        {/* Course Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`${
                  activeTab === 'description'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('curriculum')}
                className={`${
                  activeTab === 'curriculum'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Curriculum
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-600">{course.description}</p>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div className="space-y-4">
                {course.lessonInfo.map((lesson) => {
                  const hasAssignments = assignmentsByLesson[lesson.title] && assignmentsByLesson[lesson.title].length > 0;
                  return (
                    <div key={lesson.id} className="bg-gray-50 rounded-lg">
                      <div
                        className={`flex items-center justify-between p-4 cursor-pointer ${hasAssignments ? 'hover:bg-gray-100' : ''}`}
                        onClick={() => hasAssignments ? setOpenLesson(openLesson === lesson.id ? null : lesson.id) : null}
                      >
                        <span className="text-gray-900">{lesson.title}</span>
                        {hasAssignments && (
                          <span className="text-xs text-blue-600 ml-2">
                            {openLesson === lesson.id ? 'Hide Assignment' : 'Show Assignment'}
                          </span>
                        )}
                      </div>
                      {hasAssignments && openLesson === lesson.id && (
                        <div className="pl-8 pb-4">
                          {assignmentsByLesson[lesson.title].map((a, idx) => (
                            <div
                              key={idx}
                              className="mb-2 flex flex-col md:flex-row md:items-center gap-2 md:gap-0"
                            >
                              <div className="flex-1 flex items-center gap-2">
                                <a
                                  href={a.path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-indigo-600 underline"
                                >
                                  {a.title || 'View Assignment'}
                                </a>
                                {uploadSuccess[lesson.id] && (
                                  <span className="text-green-600 text-xs ml-2">Uploaded!</span>
                                )}
                                {uploadError[lesson.id] && (
                                  <span className="text-red-600 text-xs ml-2">{uploadError[lesson.id]}</span>
                                )}
                              </div>
                              <form
                                onSubmit={e => {
                                  e.preventDefault();
                                  const fileInput = e.target.elements[`file-${lesson.id}-${idx}`];
                                  if (fileInput.files.length > 0) {
                                    handleFileChange(lesson.id, idx, { target: { files: fileInput.files } });
                                  }
                                }}
                                className="flex items-center gap-2 ml-auto"
                                style={{ minWidth: 200, justifyContent: 'flex-end' }}
                              >
                                <label
                                  htmlFor={`file-${lesson.id}-${idx}`}
                                  className="inline-flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded cursor-pointer hover:bg-gray-300 transition"
                                  style={{ minWidth: 120 }}
                                >
                                  <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                                  </svg>
                                  {uploading[lesson.id] ? 'Uploading...' : 'Choose File'}
                                  <input
                                    id={`file-${lesson.id}-${idx}`}
                                    type="file"
                                    name={`file-${lesson.id}-${idx}`}
                                    accept="application/pdf"
                                    className="hidden"
                                    disabled={uploading[lesson.id]}
                                  />
                                </label>
                                <button
                                  type="submit"
                                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
                                  disabled={uploading[lesson.id]}
                                >
                                  Upload Answer
                                </button>
                              </form>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}