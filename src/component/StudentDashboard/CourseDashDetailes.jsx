import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../Loader/Loader';

export default function CourseDashDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

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


  const price = course?.price || 49;
  const lessonsCount = course?.lessonInfo?.length || 0;

  // Helper to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
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
                  <span className="ml-1 text-gray-600">Teacher: {course.teacherName || 'Not specified'}</span>
                </div>
              </div>
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
                Lessons
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
                {course.lessonInfo && course.lessonInfo.length > 0 ? (
                  course.lessonInfo.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                      onClick={() => navigate(`lesson/${lesson.id}`)}
                    >
                      <div className="flex items-center justify-between p-4">
                        <span className="text-gray-900">{lesson.title}</span>
                        <span className="text-xs text-blue-600 ml-2">View Assignments</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">No lessons available for this course.</div>
                )}
              </div>
            )}
          </div>
        </div>

              {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Student Comments</h2>
          {course.commentInfo && course.commentInfo.length > 0 ? (
            <div className="space-y-6">
              {[...course.commentInfo]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 3)
                .map((comment) => (
                  <div
                    key={comment.id}
                    className="flex items-start gap-4 bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                        {comment.studentName ? comment.studentName[0].toUpperCase() : 'S'}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-indigo-700">{comment.studentName || 'Student'}</span>
                        <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-700 text-base">{comment.content}</p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500">No comments yet for this course.</p>
          )}
        </div>
      </div>
    </div>
  );
}