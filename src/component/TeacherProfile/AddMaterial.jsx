import React, { useState, useEffect, useRef } from 'react';
import { courseService } from '../../services/courseService';
import "./CreateCourse.css";

const AddMaterial = () => {
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [editingMaterialId, setEditingMaterialId] = useState(null);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const materialTypes = {
    FILE: 'file',
    VIDEO: 'video',
    URL: 'url'
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await courseService.getAllCourses();
        setCourses(response?.data || []);
      } catch (error) {
        setError(error.message || 'Failed to load courses');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const getCourseMaterials = async (courseId) => {
    try {
      const courseDetails = await courseService.getCourseDetails(courseId);
      return courseDetails.materials || [];
    } catch (error) {
      setError(error.message || 'Failed to load materials');
      return [];
    }
  };

  const handleUploadMaterial = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(e.target);
      const materialData = {
        title: formData.get('title'),
        description: formData.get('description'),
        type: formData.get('type'),
        file: formData.get('file'),
      };

      const newMaterial = await courseService.uploadMaterial(editingCourseId, materialData);
      setMaterials([...materials, newMaterial]);
      e.target.reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setError(error.message || 'Failed to upload material');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMaterial = (material) => {
    setEditingMaterial(material);
    setEditingMaterialId(material.id);
  };

  const handleUpdateMaterial = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(e.target);
      const materialData = {
        title: formData.get('title'),
        description: formData.get('description'),
        type: formData.get('type'),
        file: formData.get('file'),
      };

      const updatedMaterial = await courseService.updateMaterial(editingCourseId, editingMaterialId, materialData);
      setMaterials(materials.map(material =>
        material.id === editingMaterialId ? updatedMaterial : material
      ));
      setEditingMaterial(null);
      setEditingMaterialId(null);
      e.target.reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setError(error.message || 'Failed to update material');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        setIsLoading(true);
        await courseService.deleteMaterial(editingCourseId, materialId);
        setMaterials(materials.filter(material => material.id !== materialId));
      } catch (error) {
        setError(error.message || 'Failed to delete material');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingMaterial(null);
    setEditingMaterialId(null);
  };

  const MaterialForm = ({ material, onSubmit, onCancel, submitText }) => {
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const validationErrors = {};
      
      if (!formData.get('title')) validationErrors.title = 'Title is required';
      if (!formData.get('description')) validationErrors.description = 'Description is required';
      if (!formData.get('type')) validationErrors.type = 'Type is required';
      if (!formData.get('file') && formData.get('type') !== 'url') validationErrors.file = 'File is required';
      
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      onSubmit(e);
    };

    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="required-field">Title</label>
          <input
            type="text"
            name="title"
            required
            defaultValue={material?.title}
            placeholder="Enter material title"
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label className="required-field">Type</label>
          <select 
            name="type" 
            required 
            className={`category-select ${errors.type ? 'error' : ''}`}
            defaultValue={material?.type}
          >
            <option value="">Select type</option>
            {Object.entries(materialTypes).map(([key, value]) => (
              <option key={key} value={value}>{value}</option>
            ))}
          </select>
          {errors.type && <span className="error-message">{errors.type}</span>}
        </div>

        <div className="form-group file-input">
          <label className="required-field">File</label>
          <input
            type="file"
            name="file"
            ref={fileInputRef}
            accept=".pdf,.doc,.docx,.txt,video/*"
            className={errors.file ? 'error' : ''}
          />
          {errors.file && <span className="error-message">{errors.file}</span>}
          <p className="help-text">Supported formats: PDF, DOC, DOCX, TXT, and video files</p>
        </div>

        <div className="form-group">
          <label className="required-field">Description</label>
          <textarea
            name="description"
            required
            defaultValue={material?.description}
            placeholder="Enter material description"
            rows="3"
            className={errors.description ? 'error' : ''}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="form-actions">
          {onCancel && (
            <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
          )}
          <button type="submit" className="save-button">{submitText}</button>
        </div>
      </form>
    );
  };

  return (
    <div className="form-container">
      {error && (
        <div className="error-message" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', zIndex: 2000, background: '#fee2e2', color: '#b91c1c', padding: '16px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <p style={{ margin: 0 }}>{error}</p>
          <button onClick={() => setError(null)} style={{ marginLeft: 16, background: '#b91c1c', color: 'white', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer' }}>Dismiss</button>
        </div>
      )}

      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      {editingMaterial ? (
        <>
          <h2>Edit Material</h2>
          <MaterialForm
            material={editingMaterial}
            onSubmit={handleUpdateMaterial}
            onCancel={handleCancelEdit}
            submitText="Update Material"
          />
        </>
      ) : (
        <>
          <h2>Upload Material</h2>
          <div className="form-group">
            <label className="required-field">Select Course</label>
            <select
              name="courseId"
              required
              className="category-select"
              value={editingCourseId || ''}
              onChange={(e) => {
                setEditingCourseId(e.target.value);
                if (e.target.value) {
                  getCourseMaterials(e.target.value).then(materials => setMaterials(materials));
                }
              }}
            >
              <option value="">Choose a course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
          {editingCourseId && (
            <>
              <MaterialForm
                onSubmit={handleUploadMaterial}
                submitText="Upload Material"
              />
              <div className="items-list">
                <h3>Course Materials</h3>
                {isLoading ? (
                  <div className="loading">Loading materials...</div>
                ) : materials.length > 0 ? (
                  materials.map(material => (
                    <div key={material.id} className="material-card">
                      <div className="card-header">
                        <h5>{material.title}</h5>
                        <span className="material-type">{material.type}</span>
                      </div>
                      <p>{material.description}</p>
                      {material.file && (
                        <div className="material-file">
                          <a 
                            href={material.file} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="view-content-btn"
                          >
                            View Content
                          </a>
                        </div>
                      )}
                      <div className="card-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEditMaterial(material)}
                          title="Edit Material"
                        >
                          ✎
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteMaterial(material.id)}
                          title="Delete Material"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No materials available for this course.</p>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AddMaterial; 