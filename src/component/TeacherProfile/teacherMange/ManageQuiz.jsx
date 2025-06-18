import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, IconButton, Paper, Divider, Checkbox, FormControlLabel } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { FaTrash, FaPlus, FaQuestionCircle, FaCheck, FaArrowLeft } from 'react-icons/fa';
import { courseService } from '@/services/courseService';
import { quizService } from '@/services/quizService';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Loader from '@/component/Loader/Loader';

const ManageQuiz = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(0);
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [lessonQuiz, setLessonQuiz] = useState({
    lessonId: '',
    title: '',
    description: '',
    startsAt: new Date(),
    durationMinutes: 30,
    questionListDtos: [],
    isAutoCorrect: true
  });

  const [courseQuiz, setCourseQuiz] = useState({
    courseId: '',
    questionListDtos: [],
    isAutoCorrect: true
  });

  const [newQuestion, setNewQuestion] = useState({
    questionText: '',
    questionTypeId: 1,
    points: 1,
    correctAnswer: '',
    options: {}
  });

  const [newOption, setNewOption] = useState('');
  const [questionOptions, setQuestionOptions] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError(null);
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
        toast.error(error.message || 'Failed to load courses');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, [user?.id]);

  useEffect(() => {
    if (selectedCourse) {
      const loadLessons = async () => {
        try {
          setIsLoading(true);
          const response = await courseService.getCourseDetails(selectedCourse);
          setLessons(response.data?.lessonInfo || []);
        } catch (error) {
          setError(error.message || 'Failed to load lessons');
          toast.error(error.message || 'Failed to load lessons');
        } finally {
          setIsLoading(false);
        }
      };
      loadLessons();
    }
  }, [selectedCourse]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const addOption = () => {
    if (!newOption.trim()) {
      toast.error('Option text cannot be empty');
      return;
    }
    // Check for duplicate option text
    if (questionOptions.some(opt => opt.text.toLowerCase() === newOption.trim().toLowerCase())) {
      toast.error('This option already exists');
      setNewOption('');
      return;
    }

    const optionText = newOption.trim();
    setQuestionOptions([...questionOptions, { key: optionText, text: optionText }]);
    setNewQuestion(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [optionText]: false
      }
    }));
    setNewOption('');
  };

  const removeOption = (optionTextToRemove) => {
    setQuestionOptions(questionOptions.filter(opt => opt.text !== optionTextToRemove));
    const newOptions = { ...newQuestion.options };
    delete newOptions[optionTextToRemove];
    setNewQuestion(prev => ({
      ...prev,
      options: newOptions
    }));
    // If the removed option was the correct answer, clear correctAnswer
    if (newQuestion.correctAnswer === optionTextToRemove) {
      setNewQuestion(prev => ({
        ...prev,
        correctAnswer: ''
      }));
    }
  };

  const markAsCorrect = (optionTextToMark) => {
    // First, set all options to false
    const updatedOptions = {};
    questionOptions.forEach(opt => {
      updatedOptions[opt.text] = false;
    });
    // Then set the selected option to true
    updatedOptions[optionTextToMark] = true;

    setNewQuestion(prev => ({
      ...prev,
      options: updatedOptions,
      correctAnswer: optionTextToMark
    }));
  };

  const handleQuestionTypeChange = (typeId) => {
    setNewQuestion({
      ...newQuestion,
      questionTypeId: typeId,
      options: typeId === 1 ? newQuestion.options : {}
    });
    if (typeId !== 1) {
      setQuestionOptions([]);
    }
  };

  const addQuestion = () => {
    if (!newQuestion.questionText.trim()) {
      toast.error('Question text cannot be empty');
      return;
    }

    if (newQuestion.questionTypeId === 1) {
      if (questionOptions.length === 0) {
        toast.error('Please add at least one option for multiple choice question');
        return;
      }

      // Check if any option is marked as correct
      const hasCorrectOption = Object.values(newQuestion.options).some(value => value === true);
      if (!hasCorrectOption) {
        toast.error('Please mark one option as correct');
        return;
      }
    } else {
      if (!newQuestion.correctAnswer.trim()) {
        toast.error('Please provide a correct answer');
        return;
      }
    }

    const questionToAdd = {
      ...newQuestion,
      options: newQuestion.questionTypeId === 1 ? newQuestion.options : {}
    };

    if (activeTab === 0) {
      setLessonQuiz({
        ...lessonQuiz,
        questionListDtos: [...lessonQuiz.questionListDtos, questionToAdd]
      });
    } else {
      setCourseQuiz({
        ...courseQuiz,
        questionListDtos: [...courseQuiz.questionListDtos, questionToAdd]
      });
    }

    // Reset question form
    setNewQuestion({
      questionText: '',
      questionTypeId: 1,
      points: 1,
      correctAnswer: '',
      options: {}
    });
    setQuestionOptions([]);
  };

  const removeQuestion = (index) => {
    if (activeTab === 0) {
      const updatedQuestions = lessonQuiz.questionListDtos.filter((_, i) => i !== index);
      setLessonQuiz({ ...lessonQuiz, questionListDtos: updatedQuestions });
    } else {
      const updatedQuestions = courseQuiz.questionListDtos.filter((_, i) => i !== index);
      setCourseQuiz({ ...courseQuiz, questionListDtos: updatedQuestions });
    }
  };

  const handleSubmit = async () => {
    try {
      if (activeTab === 0 && !selectedLesson) {
        toast.error('Please select a lesson');
        return;
      }

      if (activeTab === 1 && !selectedCourse) {
        toast.error('Please select a course');
        return;
      }

      // Format the questions data
      const formattedQuestions = (activeTab === 0 ? lessonQuiz.questionListDtos : courseQuiz.questionListDtos).map(question => ({
        questionText: question.questionText,
        questionTypeId: question.questionTypeId,
        points: question.points,
        correctAnswer: question.correctAnswer,
        options: question.questionTypeId === 1 
          ? Object.entries(question.options).reduce((acc, [key, value]) => {
              acc[key] = value;
              return acc;
            }, {})
          : {}
      }));

      let response;

      if (activeTab === 0) {
        console.log('Lesson Quiz Data before submission:', lessonQuiz.lessonId);
        // Create Lesson Quiz
        const quizToSubmit = {
          ...lessonQuiz,
          questionListDtos: formattedQuestions,
          isAutoCorrect: lessonQuiz.isAutoCorrect
        };
        response = await quizService.createLessonQuiz(quizToSubmit);
      } else {
        // Create Course Quiz
        const quizToSubmit = {
          ...courseQuiz,
          questionListDtos: formattedQuestions,
          isAutoCorrect: courseQuiz.isAutoCorrect
        };
        response = await quizService.createCourseQuiz(quizToSubmit);
      }

      if (response.succeeded) {
        toast.success('Quiz created successfully!');
        // Reset form
        if (activeTab === 0) {
          setLessonQuiz({
            lessonId: '',
            title: '',
            description: '',
            startsAt: new Date(),
            durationMinutes: 30,
            questionListDtos: [],
            isAutoCorrect: true
          });
          setSelectedLesson('');
        } else {
          setCourseQuiz({
            courseId: '',
            questionListDtos: [],
            isAutoCorrect: true
          });
          setSelectedCourse('');
        }
      } else {
        toast.error(response.messages?.[0] || 'Failed to create quiz');
      }
    } catch (error) {
      console.error('Error creating quiz:', error);
      toast.error(error.message || 'Error creating quiz');
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 3, maxWidth: '1200px', margin: '0 auto' }}>
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

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ 
          color: 'var(--primary-color)',
          fontWeight: 'bold',
          mb: 4,
          textAlign: 'center'
        }}>
          Manage Quiz
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                fontSize: '1.1rem',
                fontWeight: 'medium',
                textTransform: 'none',
                minWidth: 200,
              },
              '& .Mui-selected': {
                color: 'var(--primary-color) !important',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: 'var(--primary-color)',
              }
            }}
          >
            <Tab label="Create Quiz for Lesson" />
            <Tab label="Create Quiz for Course" />
          </Tabs>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/teacher/review-student-answers')}
            sx={{ ml: 2 }}
          >
            Review Student Answers
          </Button>
        </Box>

        {activeTab === 0 ? (
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Paper elevation={1} sx={{ p: 3, borderRadius: 2, bgcolor: '#f8f9fa' }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'var(--primary-color)' }}>
                Course & Lesson Selection
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Course</InputLabel>
                <Select
                  value={selectedCourse}
                  onChange={(e) => {
                    setSelectedCourse(e.target.value);
                    setSelectedLesson('');
                  }}
                  label="Select Course"
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--primary-color)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--primary-color)',
                    }
                  }}
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
                    onChange={(e) => {
                      setSelectedLesson(e.target.value);
                      console.log('Selected lesson ID:', e.target.value);
                      setLessonQuiz(prev => ({ ...prev, lessonId: e.target.value }));
                    }}
                    label="Select Lesson"
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--primary-color)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--primary-color)',
                      }
                    }}
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

            <Paper elevation={1} sx={{ p: 3, borderRadius: 2, bgcolor: '#f8f9fa' }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'var(--primary-color)' }}>
                Quiz Details
              </Typography>
              <TextField
                label="Title"
                value={lessonQuiz.title}
                onChange={(e) => setLessonQuiz({ ...lessonQuiz, title: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Description"
                multiline
                rows={4}
                value={lessonQuiz.description}
                onChange={(e) => setLessonQuiz({ ...lessonQuiz, description: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Start Date and Time"
                    value={lessonQuiz.startsAt}
                    onChange={(newValue) => setLessonQuiz({ ...lessonQuiz, startsAt: newValue })}
                    sx={{ flex: 1 }}
                  />
                </LocalizationProvider>
                <TextField
                  label="Duration (minutes)"
                  type="number"
                  value={lessonQuiz.durationMinutes}
                  onChange={(e) => setLessonQuiz({ ...lessonQuiz, durationMinutes: parseInt(e.target.value) })}
                  sx={{ width: '200px' }}
                />
              </Box>
            </Paper>

            <FormControlLabel
              control={
                <Checkbox
                  checked={lessonQuiz.isAutoCorrect}
                  onChange={(e) => setLessonQuiz(prev => ({ ...prev, isAutoCorrect: e.target.checked }))}
                  color="primary"
                />
              }
              label="Auto Correct Quiz"
              sx={{ mt: 2 }}
            />
          </Box>
        ) : (
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Paper elevation={1} sx={{ p: 3, borderRadius: 2, bgcolor: '#f8f9fa' }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'var(--primary-color)' }}>
                Course Selection
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Select Course</InputLabel>
                <Select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  label="Select Course"
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--primary-color)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--primary-color)',
                    }
                  }}
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
            </Paper>

            <FormControlLabel
              control={
                <Checkbox
                  checked={courseQuiz.isAutoCorrect}
                  onChange={(e) => setCourseQuiz(prev => ({ ...prev, isAutoCorrect: e.target.checked }))}
                  color="primary"
                />
              }
              label="Auto Correct Quiz"
              sx={{ mt: 2 }}
            />
          </Box>
        )}

        <Paper elevation={1} sx={{ p: 3, borderRadius: 2, bgcolor: '#f8f9fa', mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'var(--primary-color)' }}>
            Add Questions
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
            <TextField
              label="Question Text"
              value={newQuestion.questionText}
              onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Question Type</InputLabel>
                <Select
                  value={newQuestion.questionTypeId}
                  onChange={(e) => handleQuestionTypeChange(e.target.value)}
                  label="Question Type"
                >
                  <MenuItem value={1}>Multiple Choice</MenuItem>
                  <MenuItem value={3}>Short Answer</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Points"
                type="number"
                value={newQuestion.points}
                onChange={(e) => setNewQuestion({ ...newQuestion, points: parseInt(e.target.value) })}
                sx={{ width: '150px' }}
              />
            </Box>

            {newQuestion.questionTypeId === 3 ? (
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 1 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, color: 'success.main' }}>
                  Correct Answer
                </Typography>
                <TextField
                  label="Enter Correct Answer"
                  value={newQuestion.correctAnswer}
                  onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: 'success.main',
                      },
                    },
                  }}
                />
              </Paper>
            ) : (
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'white', borderRadius: 1 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, color: 'var(--primary-color)' }}>
                  Question Options
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    label="Add Option"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    fullWidth
                    size="small"
                  />
                  <Button
                    variant="contained"
                    onClick={addOption}
                    startIcon={<FaPlus />}
                    sx={{
                      bgcolor: 'var(--primary-color)',
                      '&:hover': {
                        bgcolor: 'var(--primary-dark)',
                      }
                    }}
                  >
                    Add
                  </Button>
                </Box>

                <div className="space-y-3">
                  {questionOptions.map((option) => (
                    <div key={option.text} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={newQuestion.options[option.text] === true}
                            onChange={() => markAsCorrect(option.text)}
                            name={option.text}
                            color="primary"
                          />
                        }
                        label={option.text}
                      />
                      <IconButton onClick={() => removeOption(option.text)} size="small">
                        <FaTrash className="text-red-500" />
                      </IconButton>
                    </div>
                  ))}
                </div>
              </Paper>
            )}

            <Button
              variant="contained"
              startIcon={<FaPlus />}
              onClick={addQuestion}
              sx={{ 
                mt: 1,
                bgcolor: 'var(--primary-color)',
                '&:hover': {
                  bgcolor: 'var(--primary-dark)',
                }
              }}
            >
              Add Question
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ mb: 2, color: 'var(--primary-color)' }}>
            Added Questions
          </Typography>
          
          {(activeTab === 0 ? lessonQuiz.questionListDtos : courseQuiz.questionListDtos).map((question, index) => (
            <Paper 
              key={index} 
              elevation={1} 
              sx={{ 
                p: 2, 
                mb: 2, 
                display: 'flex', 
                flexDirection: 'column',
                gap: 1,
                bgcolor: 'white',
                '&:hover': {
                  boxShadow: 2,
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FaQuestionCircle style={{ color: 'var(--primary-color)' }} />
                <Typography sx={{ flex: 1 }}>{question.questionText}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {question.questionTypeId === 1 ? 'Multiple Choice' : 'Short Answer'}
                </Typography>
                <IconButton 
                  onClick={() => removeQuestion(index)} 
                  color="error"
                  sx={{
                    '&:hover': {
                      bgcolor: 'rgba(211, 47, 47, 0.1)',
                    }
                  }}
                >
                  <FaTrash />
                </IconButton>
              </Box>
              <Box sx={{ pl: 4 }}>
                {question.questionTypeId === 1 ? (
                  <>
                    <Typography sx={{ color: 'success.main', fontWeight: 'bold', mb: 1 }}>
                      Correct Answer: {question.correctAnswer}
                    </Typography>
                    {Object.entries(question.options).map(([key, isCorrect]) => (
                      <Typography
                        key={key}
                        sx={{
                          color: isCorrect ? 'success.main' : 'text.secondary',
                          fontSize: '0.9rem',
                          ml: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        {isCorrect && <FaCheck size={12} />}
                        {key}
                      </Typography>
                    ))}
                  </>
                ) : (
                  <Typography sx={{ color: 'success.main', fontWeight: 'bold' }}>
                    Correct Answer: {question.correctAnswer}
                  </Typography>
                )}
              </Box>
            </Paper>
          ))}
        </Paper>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ 
            mt: 4,
            py: 1.5,
            bgcolor: 'var(--primary-color)',
            '&:hover': {
              bgcolor: 'var(--primary-dark)',
            }
          }}
          fullWidth
          disabled={isLoading || (activeTab === 0 ? lessonQuiz.questionListDtos.length === 0 : courseQuiz.questionListDtos.length === 0)}
        >
          Create Quiz
        </Button>
      </Paper>
    </Box>
  );
};

export default ManageQuiz; 