import React, { useState, useEffect } from 'react';
import { quizService } from '@/services/quizService';
import { courseService } from '@/services/courseService';
import { Box, Typography, Paper, CircularProgress, Alert, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Loader from '@/component/Loader/Loader';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const ReviewStudentAnswers = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [quizzesToCorrect, setQuizzesToCorrect] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('');

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

  // Fetch quizzes when a lesson is selected
  useEffect(() => {
    if (selectedLesson) {
      const fetchQuizzes = async () => {
        try {
          setLoading(true);
          setError(null);
          console.log('Fetching quizzes to correct for lesson:', selectedLesson);
          const response = await quizService.getToCorrectQuizzes(selectedLesson);
          console.log('Received response:', response);
          setQuizzesToCorrect(response || []);
        } catch (err) {
          console.error('Error in fetchQuizzes:', err);
          setError(err.message || 'Failed to load quizzes for correction.');
        } finally {
          setLoading(false);
        }
      };
      fetchQuizzes();
    }
  }, [selectedLesson]);

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
        Review Student Answers
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select Course</InputLabel>
          <Select
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              setSelectedLesson('');
              setQuizzesToCorrect([]);
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
      ) : quizzesToCorrect.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">
            {selectedLesson 
              ? 'No quizzes currently require manual correction for this lesson.'
              : 'Please select a course and lesson to view quizzes that need correction.'}
          </Typography>
        </Paper>
      ) : (
        quizzesToCorrect.map((quiz) => (
          <Paper key={quiz.studentQuizAnswerId} sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quiz: {quiz.quizName}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Student: {quiz.studentName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Answer ID: {quiz.studentQuizAnswerId}
            </Typography>
            {/* Add more quiz details and student answers here */}
          </Paper>
        ))
      )}
    </Box>
  );
};

export default ReviewStudentAnswers; 