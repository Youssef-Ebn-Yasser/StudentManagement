import React, { useState, useEffect } from 'react';
import { courseService } from '../../services/courseService';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';
import "./CreateCourse.css";
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaFileUpload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { t } from 'i18next';

const AddMaterial = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const teacherId = user?.id;
  const courseId = location.state?.courseId;
  const lessonId = location.state?.lessonId;
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(courseId);
  const [selectedLesson, setSelectedLesson] = useState(lessonId);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [data, setData] = useState(null);
  const [type, setType] = useState(1); // 1 for regular material, 2 for assignment
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        if (!teacherId) {
          throw new Error(`${t("teacher-id-required")}`);
        }
        const response = await courseService.getTeacherCourses(teacherId);
        if (response.succeeded) {
          setCourses(response.data || []);
        } else {
          throw new Error(response.messages?.[0] || `${t("failed-load-courses")}`);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError(error.message || `${t("failed-load-courses")}`);
        toast.error(error.message || `${t("failed-load-courses")}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, [teacherId]);

  useEffect(() => {
    if (selectedCourse) {
      const loadLessons = async () => {
        try {
          setIsLoading(true);
          const response = await courseService.getCourseDetails(selectedCourse);
          setLessons(response.data?.lessonInfo || []);
        } catch (error) {
          setError(error.message || `${t("failed-load-lessons")}`);
          toast.error(error.message || `${t("failed-load-lessons")}`);
        } finally {
          setIsLoading(false);
        }
      };
      loadLessons();
    }
  }, [selectedCourse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCourse) {
      toast.error(`${'please-select-course'}`);
      return;
    }

    if (!selectedLesson) {
      toast.error(`${t("please-select-lesson")}`);
      return;
    }

    if (!title.trim()) {
      toast.error(`${t("enter-title")}`);
      return;
    }

    if (!content.trim()) {
      toast.error(`${t("enter-content")}`);
      return;
    }

    if (!data) {
      toast.error(`${t("select-file")}}`);
      return;
    }

    try {
      setIsLoading(true);
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
        toast.success(`${t("material-update-success")}!`, {
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
          navigate('/teacher/course/details', { state: { courseId: selectedCourse } });
        }, 2000);
      } else {
        throw new Error(response.data.messages?.[0] || 'Failed to upload material');
      }
    } catch (error) {
      console.error('Error uploading material:', error);
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        toast.error(`${t("upload-timeout")}`);
      } else {
        toast.error(error.response?.data?.message || error.message || 'Failed to upload material');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file size (e.g., 10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (selectedFile.size > maxSize) {
        toast.error(`${t("file-too-large")}`);
        e.target.value = ''; // Clear the file input
        return;
      }
      setData(selectedFile);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full min-h-screen bg-white p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t("upload-course-material")}</h1>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-[calc(100vh-300px)]">
            <div className="scale-[2.5]">
              <Loader />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {!courseId && (
              <div className="form-group">
                <label htmlFor="course" className="form-label">{t("select-course")}</label>
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
                  <option value="">{t("select-course")}</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedCourse && (
              <div className="form-group">
                <label htmlFor="lesson" className="form-label">{t("select-lesson")}</label>
                <select 
                  id="lesson"
                  value={selectedLesson}
                  onChange={(e) => setSelectedLesson(e.target.value)}
                  className="form-select block w-full px-4 py-3 text-base text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-200 appearance-none hover:border-[var(--primary-dark)] cursor-pointer"
                  required
                >
                  <option value="">{t("select-lesson")}</option>
                  {lessons.map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="title" className="form-label">{t("material-title")}</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input block w-full px-4 py-3 text-base text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-200"
                placeholder={t("enter-material-title")}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="content" className="form-label">{t("material-content")}</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="form-textarea block w-full px-4 py-3 text-base text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-200"
                placeholder={t("enter-material-content")}
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="type" className="form-label">{t("material-type")}</label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(parseInt(e.target.value))}
                className="form-select block w-full px-4 py-3 text-base text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-200 appearance-none hover:border-[var(--primary-dark)] cursor-pointer"
              >
                <option value={1}>{t("regular-material")}</option>
                <option value={2}>{t("assignment")}</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="file" className="form-label">{t("update-file")}</label>
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                className="form-input block w-full px-4 py-3 text-base text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-200"
                required
              />
              <p className="mt-1 text-sm text-gray-500">{t("max-file-size")}</p>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/teacher/profile')}
                className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 ease-in-out shadow-sm hover:shadow-md"
              >
                {t('cancle')}
              </button>
              <button
                type="submit"
                className="bg-[var(--primary-color)] text-white px-6 py-3 rounded-lg hover:bg-[var(--primary-dark)] transition-colors duration-200 flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader />
                    {t("updating")}...
                  </>
                ) : (
                  <>
                    <FaFileUpload />
                    {t("upload-material")}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddMaterial;
