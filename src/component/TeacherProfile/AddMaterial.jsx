import React, { useState, useEffect } from 'react';
import { courseService } from '../../services/courseService';
import { toast } from 'react-toastify';
import Loader from '../Loader/Loader';
import { useNavigate } from 'react-router-dom';
import { FaBook, FaFileUpload, FaCheck, FaTimes, FaClipboardList, FaHeading, FaAlignLeft, FaFileAlt } from 'react-icons/fa';
import "./CreateCourse.css";

const AddMaterial = ({ teacherId }) => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [isAssignment, setIsAssignment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const response = await courseService.getCourseLessons();
        if (response.succeeded) {
          setLessons(response.data);
        } else {
          throw new Error(response.messages?.[0] || 'Failed to load lessons');
        }
      } catch (error) {
        console.error('Error fetching lessons:', error);
        setError(error.message || 'Failed to load lessons');
        toast.error(error.message || 'Failed to load lessons');
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedLesson) {
      toast.error('Please select a lesson');
      return;
    }

    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!content.trim()) {
      toast.error('Please enter content');
      return;
    }

    if (!file) {
      toast.error('Please select a file');
      return;
    }

    try {
      setLoading(true);
      const materialData = {
        title: title.trim(),
        content: content.trim(),
        lessonId: parseInt(selectedLesson),
        file: file,
        isAssignment: isAssignment
      };

      const response = await courseService.uploadLessonMaterial(materialData);
      
      if (response.succeeded) {
        toast.success('Material uploaded successfully');
        // Reset form
        setTitle('');
        setContent('');
        setFile(null);
        setSelectedLesson('');
        setIsAssignment(false);
        // Navigate back to course details
        navigate(-1);
      } else {
        throw new Error(response.messages?.[0] || 'Failed to upload material');
      }
    } catch (error) {
      console.error('Error uploading material:', error);
      toast.error(error.message || 'Failed to upload material');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="scale-[2.5]">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold text-gray-900">Upload Course Material</h2>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="form-group">
              <label htmlFor="lesson" className="form-label">Select Lesson</label>
              <select
                id="lesson"
                value={selectedLesson}
                onChange={(e) => setSelectedLesson(e.target.value)}
                className="form-select block w-full px-4 py-3 text-base text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-200 appearance-none hover:border-[var(--primary-dark)] cursor-pointer"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg fill=\'none\' stroke=\'%236B7280\' stroke-width=\'2\' viewBox=\'0 0 24 24\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em 1.5em' }}
                required
              >
                <option value="">Select a lesson</option>
                {lessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="title" className="form-label">Title</label>
              <div className="relative">
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input pl-10"
                  placeholder="Enter material title"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="content" className="form-label">Content</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="form-textarea pl-10"
                placeholder="Enter material content"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="file" className="form-label">File</label>
              <div className="file-input-container group">
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="file-input"
                  required
                />
                <div className="file-input-label group-hover:bg-blue-50 transition-colors duration-200">
                  <span className="text-gray-700">{file ? file.name : 'Choose a file'}</span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="flex items-center justify-between w-full cursor-pointer px-4 py-2 rounded-full border transition-all duration-200 shadow-sm bg-gray-50 border-gray-200 group hover:bg-blue-100 focus-within:bg-blue-100">
                <span
                  className={`font-semibold transition-colors duration-200
                    ${isAssignment ? 'text-blue-700' : 'text-gray-800'}
                    group-hover:text-blue-700`}
                >
                  This is an assignment
                </span>
                <span className="relative inline-block w-16 h-9 align-middle select-none" style={{ marginLeft: '29rem' }}>
                  <input
                    type="checkbox"
                    checked={isAssignment}
                    onChange={(e) => setIsAssignment(e.target.checked)}
                    className="sr-only peer"
                    id="assignment-toggle"
                    aria-checked={isAssignment}
                  />
                  <span
                    className="block w-16 h-9 rounded-full transition-colors duration-300
                      bg-gray-300 peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-[var(--primary-color)] border border-gray-300 peer-checked:border-blue-600"
                  ></span>
                  <span
                    className="absolute left-1 top-1 w-7 h-7 rounded-full bg-white shadow-md transition-transform duration-300 flex items-center justify-center
                      peer-checked:translate-x-7 peer-checked:bg-blue-500"
                  >
                    {isAssignment && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                </span>
              </label>
            </div>

            <div className="form-actions pt-4">
              <button
                type="submit"
                disabled={loading}
                className="ml-auto flex items-center py-2 px-6 rounded-lg font-bold text-white bg-gradient-to-r from-[var(--primary-dark)] to-[var(--primary-color)] shadow-md hover:opacity-90 hover:shadow-lg transition-all duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <Loader className="w-5 h-5 mr-2" />
                    Uploading...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <FaCheck className="mr-2 group-hover:scale-110 transition-transform duration-200" />
                    Upload Material
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMaterial;
