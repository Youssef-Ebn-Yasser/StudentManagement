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
  const [data, setData] = useState(null);
  const [type, setType] = useState(1); // 1 for regular material, 2 for assignment
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const response = await courseService.getAllLessons();
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

    if (!data) {
      toast.error('Please select a file');
      return;
    }

    try {
      setLoading(true);
      const materialData = {
        title: title.trim(),
        content: content.trim(),
        lessonId: parseInt(selectedLesson),
        data: data,
        type: type
      };

      const response = await courseService.uploadLessonMaterial(materialData);
      
      if (response.succeeded) {
        toast.success('Material uploaded successfully');
        // Reset form
        setTitle('');
        setContent('');
        setData(null);
        setSelectedLesson('');
        setType(1);
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setData(selectedFile);
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="w-full min-h-screen bg-white p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload Course Material</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="form-group">
            <label htmlFor="lesson" className="form-label">Select Lesson</label>
            <select
              id="lesson"
              value={selectedLesson}
              onChange={(e) => setSelectedLesson(e.target.value)}
              className="form-select block w-full px-4 py-3 text-base text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-200 appearance-none hover:border-[var(--primary-dark)] cursor-pointer"
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
            <label htmlFor="data" className="form-label">File</label>
            <div className="file-input-container group">
              <input
                type="file"
                id="data"
                onChange={handleFileChange}
                className="file-input"
                required
              />
              <div className="file-input-label group-hover:bg-blue-50 transition-colors duration-200">
                <span className="text-gray-700">{data ? data.name : 'Choose a file'}</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Material Type</label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value={1}
                  checked={type === 1}
                  onChange={(e) => setType(parseInt(e.target.value))}
                  className="form-radio"
                />
                <span className="ml-2">Regular Material</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value={2}
                  checked={type === 2}
                  onChange={(e) => setType(parseInt(e.target.value))}
                  className="form-radio"
                />
                <span className="ml-2">Assignment</span>
              </label>
            </div>
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
  );
};

export default AddMaterial;
