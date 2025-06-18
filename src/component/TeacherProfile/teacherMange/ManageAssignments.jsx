import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Alert, TextField } from '@mui/material';
import { courseService } from '@/services/courseService';
import { assignmentService } from '@/services/assignmentService';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Loader from '@/component/Loader/Loader';
import { toast } from 'react-toastify';

const ManageAssignments = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignmentDetails, setAssignmentDetails] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [degreePercentage, setDegreePercentage] = useState('');

  // Fetch courses when component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (!user?.id) {
          throw new Error('Teacher ID is required');
        }
        const response = await courseService.getTeacherCourses(user.id);
        if (response.succeeded) {
          setCourses(response.data || []);
        } else {
          throw new Error(response.messages?.[0] || 'Failed to load courses');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError(error.message || 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [user?.id]);

  // Fetch lessons when a course is selected
  useEffect(() => {
    if (selectedCourse) {
      const loadLessons = async () => {
        try {
          setLoading(true);
          const response = await courseService.getCourseDetails(selectedCourse);
          setLessons(response.data?.lessonInfo || []);
        } catch (error) {
          setError(error.message || 'Failed to load lessons');
        } finally {
          setLoading(false);
        }
      };
      loadLessons();
    }
  }, [selectedCourse]);

  // Fetch assignments when a lesson is selected
  useEffect(() => {
    if (selectedLesson) {
      const fetchAssignments = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await assignmentService.getAssignmentsByLessonId(selectedLesson);
          if (response.succeeded) {
            setAssignments(response.data || []);
          } else {
            throw new Error(response.messages?.[0] || 'Failed to load assignments');
          }
        } catch (err) {
          console.error('Error in fetchAssignments:', err);
          setError(err.message || 'Failed to load assignments');
        } finally {
          setLoading(false);
        }
      };
      fetchAssignments();
    }
  }, [selectedLesson]);

  const handleViewAssignment = async (assignmentId) => {
    try {
      setLoading(true);
      const response = await assignmentService.getAssignmentForCorrection(assignmentId);
      if (response.succeeded) {
        setAssignmentDetails(response.data);
        // Set initial degree percentage if available, otherwise empty
        setDegreePercentage(response.data?.degreePercentage !== undefined ? String(response.data.degreePercentage) : '');
        setOpenDialog(true);
      } else {
        throw new Error(response.messages?.[0] || 'Failed to load assignment details');
      }
    } catch (err) {
      console.error('Error loading assignment details:', err);
      setError(err.message || 'Failed to load assignment details');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGrade = async () => {
    if (assignmentDetails?.studentAssignmentId === undefined) {
      toast.error('Assignment ID is missing.');
      return;
    }
    const parsedDegree = parseFloat(degreePercentage);
    if (isNaN(parsedDegree) || parsedDegree < 0 || parsedDegree > 100) {
      toast.error('Please enter a valid percentage between 0 and 100.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await assignmentService.saveStudentDegreeInAssignment(assignmentDetails.studentAssignmentId, parsedDegree);
      if (response.succeeded) {
        toast.success('Grade saved successfully!');
        // Update the displayed degree percentage in the dialog
        setAssignmentDetails(prev => ({ ...prev, degreePercentage: parsedDegree }));

        // Update the specific assignment in the assignments list
        setAssignments(prevAssignments => 
          prevAssignments.map(assignment => 
            assignment.id === assignmentDetails.studentAssignmentId
              ? { ...assignment, degreePercentage: parsedDegree } // Assuming 'id' in assignments list matches 'studentAssignmentId' from details
              : assignment
          )
        );
        // Optionally, close dialog
        setOpenDialog(false);
      } else {
        throw new Error(response.messages?.[0] || 'Failed to save grade.');
      }
    } catch (err) {
      console.error('Error saving grade:', err);
      toast.error(err.message || 'Failed to save grade.');
      setError(err.message || 'Failed to save grade.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<FaArrowLeft />}
        onClick={() => navigate('/teacher/profile')}
        sx={{
          mb: 3,
          color: 'var(--primary-color)',
          '&:hover': {
            bgcolor: 'rgba(0, 0, 0, 0.04)',
          }
        }}
      >
        Back to Profile
      </Button>

      <Typography variant="h4" gutterBottom sx={{ 
        color: 'var(--primary-color)',
        fontWeight: 'bold',
        mb: 4,
        textAlign: 'center'
      }}>
        Manage Assignments
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select Course</InputLabel>
          <Select
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              setSelectedLesson('');
              setAssignments([]);
            }}
            label="Select Course"
          >
            <MenuItem value="">
              <em>Select a course</em>
            </MenuItem>
            {courses.map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedCourse && (
          <FormControl fullWidth>
            <InputLabel>Select Lesson</InputLabel>
            <Select
              value={selectedLesson}
              onChange={(e) => setSelectedLesson(e.target.value)}
              label="Select Lesson"
            >
              <MenuItem value="">
                <em>Select a lesson</em>
              </MenuItem>
              {lessons.map((lesson) => (
                <MenuItem key={lesson.id} value={lesson.id}>
                  {lesson.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Paper>

      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : assignments.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">
            {selectedLesson 
              ? 'No assignments submitted for this lesson.'
              : 'Please select a course and lesson to view assignments.'}
          </Typography>
        </Paper>
      ) : (
        assignments.map((assignment) => (
          <Paper key={assignment.id} sx={{ p: 3, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Student: {assignment.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {assignment.degreePercentage !== undefined && assignment.degreePercentage !== null ? `Grade: ${assignment.degreePercentage}%` : ''}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleViewAssignment(assignment.id)}
            >
              View Assignment
            </Button>
          </Paper>
        ))
      )}

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {assignmentDetails && (
          <>
            <DialogTitle>
              Assignment Details
            </DialogTitle>
            <DialogContent>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Student: {assignmentDetails.studentName}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Course: {assignmentDetails.courseName}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Lesson: {assignmentDetails.lessonName}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Grade: {assignmentDetails.degreePercentage}%
                </Typography>
                {assignmentDetails.path && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Assignment File:
                    </Typography>
                    <a
                      href={assignmentDetails.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
                    >
                      <img 
                        src={assignmentDetails.path} 
                        alt="Assignment submission"
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                    </a>
                  </Box>
                )}

                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>Grade Assignment</Typography>
                  <TextField
                    label="Degree Percentage (0-100)"
                    type="number"
                    fullWidth
                    value={degreePercentage}
                    onChange={(e) => setDegreePercentage(e.target.value)}
                    inputProps={{
                      min: 0,
                      max: 100,
                      step: 1
                    }}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleSaveGrade}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Save Grade'}
                  </Button>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ManageAssignments; 