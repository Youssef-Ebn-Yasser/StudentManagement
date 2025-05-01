import React, { useState, useEffect } from 'react';
import { courseService } from '../../services/courseService';
import Loader from '../Loader/Loader';
import "./CreateCourse.css";

const AddAssignment = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [editingAssignmentId, setEditingAssignmentId] = useState(null);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const getCourseAssignments = async (courseId) => {
    try {
      const courseDetails = await courseService.getCourseDetails(courseId);
      return courseDetails.assignments || [];
    } catch (error) {
      setError(error.message || 'Failed to load assignments');
      return [];
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(e.target);
      const assignmentData = {
        title: formData.get('title'),
        description: formData.get('description'),
        dueDate: formData.get('dueDate'),
        points: parseInt(formData.get('points')),
        instructions: formData.get('instructions'),
      };

      const newAssignment = await courseService.createAssignment(editingCourseId, assignmentData);
      setAssignments([...assignments, newAssignment]);
      e.target.reset();
    } catch (error) {
      setError(error.message || 'Failed to create assignment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAssignment = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(e.target);
      const assignmentData = {
        title: formData.get('title'),
        description: formData.get('description'),
        dueDate: formData.get('dueDate'),
        points: parseInt(formData.get('points')),
        instructions: formData.get('instructions'),
      };

      const updatedAssignment = await courseService.updateAssignment(editingCourseId, editingAssignmentId, assignmentData);
      setAssignments(assignments.map(assignment =>
        assignment.id === editingAssignmentId ? updatedAssignment : assignment
      ));
      setEditingAssignment(null);
      setEditingAssignmentId(null);
      e.target.reset();
    } catch (error) {
      setError(error.message || 'Failed to update assignment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        setIsLoading(true);
        await courseService.deleteAssignment(editingCourseId, assignmentId);
        setAssignments(assignments.filter(assignment => assignment.id !== assignmentId));
      } catch (error) {
        setError(error.message || 'Failed to delete assignment');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingAssignment(null);
    setEditingAssignmentId(null);
  };

  const AssignmentForm = ({ assignment, onSubmit, onCancel, submitText }) => {
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const validationErrors = {};
      
      if (!formData.get('title')) validationErrors.title = 'Title is required';
      if (!formData.get('description')) validationErrors.description = 'Description is required';
      if (!formData.get('dueDate')) validationErrors.dueDate = 'Due date is required';
      if (!formData.get('points')) validationErrors.points = 'Points is required';
      if (isNaN(parseInt(formData.get('points')))) validationErrors.points = 'Points must be a number';
      if (!formData.get('instructions')) validationErrors.instructions = 'Instructions is required';
      
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
            defaultValue={assignment?.title}
            placeholder="Enter assignment title"
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label className="required-field">Description</label>
          <textarea
            name="description"
            required
            defaultValue={assignment?.description}
            placeholder="Enter assignment description"
            rows="4"
            className={errors.description ? 'error' : ''}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label className="required-field">Due Date</label>
          <input
            type="datetime-local"
            name="dueDate"
            required
            defaultValue={assignment?.dueDate}
            className={errors.dueDate ? 'error' : ''}
          />
          {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
        </div>

        <div className="form-group">
          <label className="required-field">Points</label>
          <input
            type="number"
            name="points"
            required
            min="1"
            defaultValue={assignment?.points}
            placeholder="Enter maximum points"
            className={errors.points ? 'error' : ''}
          />
          {errors.points && <span className="error-message">{errors.points}</span>}
        </div>

        <div className="form-group">
          <label className="required-field">Instructions</label>
          <textarea
            name="instructions"
            required
            defaultValue={assignment?.instructions}
            placeholder="Enter assignment instructions"
            rows="4"
            className={errors.instructions ? 'error' : ''}
          />
          {errors.instructions && <span className="error-message">{errors.instructions}</span>}
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

      {isLoading ? (
        <div className="flex items-center justify-center h-[calc(100vh-300px)]">
          <div className="scale-[2.5]">
            <Loader />
          </div>
        </div>
      ) : (
        <>
          <h2>Add New Assignment</h2>
          <div className="form-group">
            <label className="required-field">Select Course</label>
            <select 
              name="courseId" 
              required 
              className="category-select"
              value={editingCourseId || ''}
              onChange={(e) => setEditingCourseId(e.target.value)}
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
              {editingAssignment ? (
                <>
                  <h2>Edit Assignment</h2>
                  <AssignmentForm
                    assignment={editingAssignment}
                    onSubmit={handleUpdateAssignment}
                    onCancel={handleCancelEdit}
                    submitText="Update Assignment"
                  />
                </>
              ) : (
                <>
                  <AssignmentForm
                    onSubmit={handleCreateAssignment}
                    submitText="Create Assignment"
                  />
                </>
              )}

              <div className="items-list">
                <h3>Course Assignments</h3>
                {assignments.length > 0 ? (
                  assignments.map(assignment => (
                    <div key={assignment.id} className="assignment-card">
                      <div className="card-header">
                        <h5>{assignment.title}</h5>
                        <span className="assignment-type">{assignment.type}</span>
                      </div>
                      <p>{assignment.description}</p>
                      <div className="card-stats">
                        <span>Due Date: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                        <span>Points: {assignment.points}</span>
                      </div>
                      <div className="card-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEditAssignment(assignment)}
                          title="Edit Assignment"
                        >
                          ✎
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteAssignment(assignment.id)}
                          title="Delete Assignment"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No assignments available for this course.</p>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AddAssignment; 