import React, { useState, useEffect, useRef } from 'react';
import { courseService } from '../../services/courseService';
import Loader from '../Loader/Loader';
import "./CreateCourse.css";

const AddMaterial = () => {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('');
  const [selectedMaterialType, setSelectedMaterialType] = useState('1'); // Default to Normal type
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await courseService.getAllCourses();
        console.log('Courses response:', response);
        setCourses(response?.data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError(error.message || 'Failed to load courses');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchLessons = async () => {
      if (!selectedCourse) {
        setLessons([]);
        return;
      }
      try {
        setIsLoading(true);
        console.log('Fetching lessons for course:', selectedCourse);
        const courseLessons = await courseService.getCourseLessons(selectedCourse);
        console.log('Lessons response:', courseLessons);
        // Ensure we have an array of lessons
        if (Array.isArray(courseLessons)) {
          setLessons(courseLessons);
        } else if (courseLessons?.data) {
          setLessons(Array.isArray(courseLessons.data) ? courseLessons.data : []);
        } else {
          setLessons([]);
        }
      } catch (error) {
        console.error('Error fetching lessons:', error);
        setError(error.message || 'Failed to load lessons');
        setLessons([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLessons();
  }, [selectedCourse]);

  useEffect(() => {
    const fetchMaterials = async () => {
      if (!selectedLesson) {
        setMaterials([]);
        return;
      }
      try {
        setIsLoading(true);
        console.log('Fetching materials for lesson:', selectedLesson);
        const materialsData = await courseService.getLessonMaterials(selectedLesson);
        console.log('Materials response:', materialsData);
        setMaterials(materialsData || []);
      } catch (error) {
        console.error('Error fetching materials:', error);
        setError(error.message || 'Failed to load materials');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMaterials();
  }, [selectedLesson]);

  const handleUploadMaterial = async (e) => {
    e.preventDefault();
    if (!selectedLesson) {
      setError('Please select a lesson first');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const formData = new FormData(e.target);
      const file = formData.get('file');
      
      if (!file || file.size === 0) {
        setError('Please select a file to upload');
        return;
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',  // PDF
        'application/msword',  // DOC
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',  // DOCX
        'text/plain',  // TXT
        'video/mp4',  // MP4
        'video/quicktime',  // MOV
        'video/x-msvideo',  // AVI
        'application/vnd.ms-powerpoint',  // PPT
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'  // PPTX
      ];

      if (!allowedTypes.includes(file.type)) {
        console.log('File type:', file.type);
        setError('Invalid file type. Please upload a PDF, DOC, DOCX, TXT, PPT, PPTX, or video file (MP4, MOV, AVI).');
        return;
      }

      // Validate file size (max 50MB)
      const maxSize = 50 * 1024 * 1024; // 50MB in bytes
      if (file.size > maxSize) {
        setError('File is too large. Maximum size is 50MB.');
        return;
      }

      // Create material data object with exact property names expected by backend
      const materialData = {
        Title: formData.get('title'),
        Content: formData.get('Content'),
        LessonId: parseInt(selectedLesson),
        Data: file,
        Type: parseInt(selectedMaterialType)
      };

      console.log('Uploading material:', {
        Title: materialData.Title,
        Content: materialData.Content,
        LessonId: materialData.LessonId,
        Type: materialData.Type,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      });

      await courseService.uploadLessonMaterial(selectedLesson, materialData);
      
      // Refresh materials list
      const updatedMaterials = await courseService.getLessonMaterials(selectedLesson);
      setMaterials(updatedMaterials || []);
      
      // Reset form
      e.target.reset();
      setSelectedMaterialType('1'); // Reset to Normal type
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading material:', error);
      setError(error.message || 'Failed to upload material');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        setIsLoading(true);
        await courseService.deleteMaterial(materialId);
        setMaterials(materials.filter(material => material.id !== materialId));
      } catch (error) {
        console.error('Error deleting material:', error);
        setError(error.message || 'Failed to delete material');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-300px)]">
        <div className="scale-[2.5]">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      {error && (
        <div className="error-message" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', zIndex: 2000, background: '#fee2e2', color: '#b91c1c', padding: '16px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <p style={{ margin: 0 }}>{error}</p>
          <button onClick={() => setError(null)} style={{ marginLeft: 16, background: '#b91c1c', color: 'white', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer' }}>Dismiss</button>
        </div>
      )}

      <h2>Upload Course Material</h2>
      
      <div className="form-group">
        <label className="required-field">Select Course</label>
        <select 
          value={selectedCourse}
          onChange={(e) => {
            console.log('Selected course:', e.target.value);
            setSelectedCourse(e.target.value);
            setSelectedLesson('');
          }}
          className="category-select"
          required
        >
          <option value="">Choose a course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      {selectedCourse && (
        <div className="form-group">
          <label className="required-field">Select Lesson</label>
          <select 
            value={selectedLesson}
            onChange={(e) => {
              console.log('Selected lesson:', e.target.value);
              setSelectedLesson(e.target.value);
            }}
            className="category-select"
            required
          >
            <option value="">Choose a lesson</option>
            {lessons.map(lesson => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.title?.toString() || 'Untitled Lesson'}
              </option>
            ))}
          </select>
          {lessons.length === 0 && (
            <p className="text-red-500 mt-2">No lessons available for this course.</p>
          )}
        </div>
      )}

      {selectedLesson && (
        <>
          <form onSubmit={handleUploadMaterial} className="space-y-4">
            <div className="form-group">
              <label className="required-field">Material Title</label>
              <input
                type="text"
                name="title"
                required
                className="form-input"
                placeholder="Enter material title"
              />
            </div>

            <div className="form-group">
              <label className="required-field">Description</label>
              <textarea
                name="Content"
                required
                className="form-input"
                rows="3"
                placeholder="Enter material description"
              />
            </div>

            <div className="form-group">
              <label className="required-field">Material Type</label>
              <select
                name="materialType"
                value={selectedMaterialType}
                onChange={(e) => setSelectedMaterialType(e.target.value)}
                className="form-input"
                required
              >
                <option value="1">Normal Material</option>
                <option value="2">Assignment</option>
              </select>
              <p className="help-text">Choose whether this is a regular material or an assignment</p>
            </div>

            <div className="form-group">
              <label className="required-field">Material File</label>
              <input
                type="file"
                name="file"
                ref={fileInputRef}
                required
                className="form-input"
                accept=".pdf,.doc,.docx,.txt,video/*"
              />
              <p className="help-text">Supported formats: PDF, DOC, DOCX, TXT, and video files</p>
            </div>

            <button
              type="submit"
              className="save-button"
              disabled={isLoading}
            >
              {isLoading ? 'Uploading...' : 'Upload Material'}
            </button>
          </form>

          <div className="materials-section">
            <h3>Course Materials</h3>
            {materials.length > 0 ? (
              <div className="materials-list">
                {materials.map(material => (
                  <div key={material.id} className="material-item">
                    <div className="card-header">
                      <h5>{material.title}</h5>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteMaterial(material.id)}
                        title="Delete Material"
                      >
                        ×
                      </button>
                    </div>
                    <p>{material.Content}</p>
                    {material.filePath && (
                      <div className="material-content">
                        <a
                          href={material.filePath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="view-file-btn"
                        >
                          View Material
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No materials available for this lesson.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AddMaterial; 