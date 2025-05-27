import React, { useState, useEffect } from 'react';
import { courseService } from '../../services/courseService';
import { toast } from 'react-toastify';
import Loader from '../Loader/Loader';
import { useNavigate, useParams } from 'react-router-dom';
import { FaBook, FaFileUpload, FaCheck, FaTimes, FaClipboardList, FaHeading, FaAlignLeft, FaFileAlt } from 'react-icons/fa';
import "./CreateCourse.css";
import { useSelector } from 'react-redux';
import axios from 'axios';

const AddMaterial = () => {
  const navigate = useNavigate();
  const { courseId, lessonId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const teacherId = user?.id;
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(courseId || '');
  const [selectedLesson, setSelectedLesson] = useState(lessonId || '');
  const [lessons, setLessons] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [data, setData] = useState(null);
  const [type, setType] = useState(1); // 1 for regular material, 2 for assignment
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch teacher's courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        if (!teacherId) {
          throw new Error('Teacher ID is required');
        }
        const response = await courseService.getTeacherCourses(teacherId);
        if (response.succeeded) {
          setCourses(response.data || []);
        } else {
          throw new Error(response.messages?.[0] || 'Failed to load courses');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError(error.message || 'Failed to load courses');
        toast.error(error.message || 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [teacherId]);

  // Fetch lessons when course is selected
  useEffect(() => {
    const fetchLessons = async () => {
      if (!selectedCourse) return;
      
      try {
        setLoading(true);
        const response = await courseService.getCourseDetails(selectedCourse);
        if (response.succeeded) {
          const courseLessons = response.data.lessons || response.data.lessonInfo || [];
          setLessons(courseLessons);
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
  }, [selectedCourse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCourse) {
      toast.error('Please select a course');
      return;
    }

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
      const formData = new FormData();
      formData.append('Title', title.trim());
      formData.append('Content', content.trim());
      formData.append('LessonId', selectedLesson);
      formData.append('Data', data);
      formData.append('Type', type);

      console.log('Sending material data:', {
        Title: title.trim(),
        Content: content.trim(),
        LessonId: selectedLesson,
        Type: type,
        FileName: data.name
      });

      const response = await axios.post(
        'https://e-learn-v1.runasp.net/api/Material/CreateMaterial/CreateMaterial',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      console.log('Upload response:', response);
      
      if (response.data.succeeded) {
        toast.success('Material uploaded successfully!', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        
        setError(null);
        
        // Reset form
        setTitle('');
        setContent('');
        setData(null);
        
        // Wait for 2 seconds to show the success message before navigating
        setTimeout(() => {
          // Navigate back to course details
          navigate(`/teacher/course/${selectedCourse}`);
        }, 2000);
      } else {
        throw new Error(response.data.messages?.[0] || 'Failed to upload material');
      }
    } catch (error) {
      console.error('Error uploading material:', error);
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        toast.error('Upload timed out. Please try again with a smaller file or check your internet connection.');
      } else {
        toast.error(error.response?.data?.message || error.message || 'Failed to upload material');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file size (e.g., 10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (selectedFile.size > maxSize) {
        toast.error('File size exceeds 10MB limit. Please choose a smaller file.');
        e.target.value = ''; // Clear the file input
        return;
      }
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
          <button
            onClick={() => navigate(`/teacher/course/${selectedCourse}`)}
            className="text-gray-600 hover:text-gray-900"
          >
            Back to Course
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="form-group">
            <label htmlFor="course" className="form-label">Select Course</label>
            <select
              id="course"
              value={selectedCourse}
              onChange={(e) => {
                console.log('Selected course:', e.target.value);
                setSelectedCourse(e.target.value);
                setSelectedLesson(''); // Reset lesson selection when course changes
              }}
              className="form-select block w-full px-4 py-3 text-base text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-200 appearance-none hover:border-[var(--primary-dark)] cursor-pointer"
              required
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

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
            <label htmlFor="title" className="form-label">Material Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input block w-full px-4 py-3 text-base text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-200"
              placeholder="Enter material title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content" className="form-label">Material Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="form-textarea block w-full px-4 py-3 text-base text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-200"
              placeholder="Enter material content"
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="type" className="form-label">Material Type</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(parseInt(e.target.value))}
              className="form-select block w-full px-4 py-3 text-base text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-200 appearance-none hover:border-[var(--primary-dark)] cursor-pointer"
            >
              <option value={1}>Regular Material</option>
              <option value={2}>Assignment</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="file" className="form-label">Upload File</label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              className="form-input block w-full px-4 py-3 text-base text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-200"
              required
            />
            <p className="mt-1 text-sm text-gray-500">Maximum file size: 10MB</p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[var(--primary-color)] text-white px-6 py-3 rounded-lg hover:bg-[var(--primary-dark)] transition-colors duration-200 flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader />
                  Uploading...
                </>
              ) : (
                <>
                  <FaFileUpload />
                  Upload Material
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMaterial;
