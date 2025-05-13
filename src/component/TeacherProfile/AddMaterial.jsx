import React, { useState, useEffect } from 'react';
import { courseService } from '../../services/courseService';
import { toast } from 'react-toastify';
import Loader from '../Loader/Loader';

const AddMaterial = ({ teacherId }) => {
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="scale-[2.5]">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Course Material</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="lesson" className="block text-sm font-medium text-gray-700">
                Select Lesson
              </label>
              <select
                id="lesson"
                value={selectedLesson}
                onChange={(e) => setSelectedLesson(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                File
              </label>
              <input
                type="file"
                id="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="mt-1 block w-full"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAssignment"
                checked={isAssignment}
                onChange={(e) => setIsAssignment(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isAssignment" className="ml-2 block text-sm text-gray-900">
                This is an assignment
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Uploading...' : 'Upload Material'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMaterial;
