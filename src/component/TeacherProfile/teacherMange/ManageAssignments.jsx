import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Alert, TextField } from '@mui/material';
import { courseService } from '@/services/courseService';
import { assignmentService } from '@/services/assignmentService';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Loader from '@/component/Loader/Loader';
import { toast } from 'react-toastify';
import { useCombobox } from 'downshift';
import { useTranslation } from 'react-i18next';
import ContentWrapper from '@/component/ContentWrapper/ContentWrapper';

const ManageAssignments = () => {

  const { t } = useTranslation();
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
  const [apiResponse, setApiResponse] = useState(null);

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
      console.log('Assignment Details API Response:', response);
      setApiResponse(response);
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
      console.log('Save Grade API Response:', response);
      setApiResponse(response);
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

  const courseCombobox = useCombobox({
    items: courses,
    itemToString: (item) => (item ? item.title : ''),
    onSelectedItemChange: ({ selectedItem }) => {
      setSelectedCourse(selectedItem ? selectedItem.id : '');
      setSelectedLesson('');
      setAssignments([]);
    },
    selectedItem: courses.find(course => course.id === selectedCourse) || null,
    stateReducer: (state, actionAndChanges) => {
      const { changes, type } = actionAndChanges;
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: false,
            inputValue: changes.selectedItem ? changes.selectedItem.title : '',
          };
        default:
          return changes;
      }
    },
  });

  const lessonCombobox = useCombobox({
    items: lessons,
    itemToString: (item) => (item ? item.title : ''),
    onSelectedItemChange: ({ selectedItem }) => {
      setSelectedLesson(selectedItem ? selectedItem.id : '');
    },
    selectedItem: lessons.find(lesson => lesson.id === selectedLesson) || null,
    stateReducer: (state, actionAndChanges) => {
      const { changes, type } = actionAndChanges;
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: false,
            inputValue: changes.selectedItem ? changes.selectedItem.title : '',
          };
        default:
          return changes;
      }
    },
  });

  if (loading) {
    return (
    <> 
    {loading && <Loader visible={loading} />}
    <ContentWrapper $loading={loading}>
        <Loader />
    </ContentWrapper></>);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 sm:p-10">
      <button
        onClick={() => navigate('/teacher/profile')}
        className="flex items-center text-blue-700 hover:text-blue-900 font-medium mb-8 transition-all duration-300 transform hover:-translate-x-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
      >
        <FaArrowLeft className="mr-2 text-xl" />
        <span className="text-lg">{t("back-to-profile")}</span>
      </button>

      <h1 className="text-5xl font-extrabold text-gray-900 mb-10 text-center leading-tight">
        {t("manage-assignments")}
      </h1>

      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 mb-10 border border-blue-200 animate-fade-in-slow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          <div>
            <label {...courseCombobox.getLabelProps()} className="block text-lg font-semibold text-gray-800 mb-2">{t("select-course")}</label>
            <div className="relative group">
              <div
                className="flex items-center border border-gray-300 rounded-xl shadow-sm transition-all duration-300 ease-in-out cursor-pointer"
                aria-activedescendant={courseCombobox.activeDescendant}
                aria-labelledby={courseCombobox.labelId}
                id={courseCombobox.comboboxId}
                role="combobox"
                aria-expanded={courseCombobox.isOpen}
              >
                <input
                  {...courseCombobox.getInputProps({
                    onFocus: () => courseCombobox.openMenu(),
                  })}
                  className="flex-grow px-5 py-3 text-lg text-gray-800 bg-transparent outline-none placeholder-gray-500"
                  placeholder={t("select-course")}
                />
                <button
                  {...courseCombobox.getToggleButtonProps()}
                  aria-label="toggle menu"
                  className="px-4 py-3 text-gray-700 transition-colors duration-300 outline-none rounded-md"
                >
                  <svg className="fill-current h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </button>
              </div>
              <ul
                {...courseCombobox.getMenuProps()}
                className="absolute z-10 w-full bg-white border border-gray-300 rounded-xl shadow-xl mt-1 max-h-60 overflow-auto"
              >
                {courseCombobox.isOpen &&
                  courses.map((item, index) => (
                    <li
                      className={`px-5 py-3 text-lg text-gray-800 cursor-pointer transition-colors duration-300
                        ${courseCombobox.highlightedIndex === index ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-500' : ''}
                        ${courseCombobox.selectedItem && courseCombobox.selectedItem.id === item.id ? 'bg-blue-200 text-blue-900 font-bold' : ''}`}
                      key={item.id}
                      {...courseCombobox.getItemProps({ item, index })}
                    >
                      {item.title}
                    </li>
            ))}
              </ul>
            </div>
          </div>

        {selectedCourse && (
            <div>
              <label {...lessonCombobox.getLabelProps()} className="block text-lg font-semibold text-gray-800 mb-2">{t("select-lesson")}</label>
              <div className="relative group">
                <div
                  className="flex items-center border border-gray-300 rounded-xl shadow-sm transition-all duration-300 ease-in-out cursor-pointer"
                  aria-activedescendant={lessonCombobox.activeDescendant}
                  aria-labelledby={lessonCombobox.labelId}
                  id={lessonCombobox.comboboxId}
                  role="combobox"
                  aria-expanded={lessonCombobox.isOpen}
                >
                  <input
                    {...lessonCombobox.getInputProps({
                      onFocus: () => lessonCombobox.openMenu(),
                    })}
                    className="flex-grow px-5 py-3 text-lg text-gray-800 bg-transparent outline-none placeholder-gray-500"
                    placeholder={t("select-lesson")}
                  />
                  <button
                    {...lessonCombobox.getToggleButtonProps()}
                    aria-label="toggle menu"
                    className="px-4 py-3 text-gray-700 transition-colors duration-300 outline-none rounded-md"
                  >
                    <svg className="fill-current h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </button>
                </div>
                <ul
                  {...lessonCombobox.getMenuProps()}
                  className="absolute z-10 w-full bg-white border border-gray-300 rounded-xl shadow-xl mt-1 max-h-60 overflow-auto"
                >
                  {lessonCombobox.isOpen &&
                    lessons.map((item, index) => (
                      <li
                        className={`px-5 py-3 text-lg text-gray-800 cursor-pointer transition-colors duration-300
                          ${lessonCombobox.highlightedIndex === index ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-500' : ''}
                          ${lessonCombobox.selectedItem && lessonCombobox.selectedItem.id === item.id ? 'bg-blue-200 text-blue-900 font-bold' : ''}`}
                        key={item.id}
                        {...lessonCombobox.getItemProps({ item, index })}
                      >
                        {item.title}
                      </li>
              ))}
                </ul>
              </div>
            </div>
        )}
        </div>
      </div>

      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl relative mb-8 shadow-md flex items-center animate-fade-in" role="alert">
          <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
          <strong className="font-bold text-xl">{t("error")}!</strong>
          <span className="block sm:inline ml-2 text-lg"> {error}</span>
        </div>
      ) : assignments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-10 text-center text-gray-600 border border-gray-200 flex flex-col items-center justify-center animate-fade-in">
          <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
          <p className="text-2xl font-medium mb-4">
            {selectedLesson 
              ? `${t("no-assignments-submitted")}`
              : `${t("no-quizzes-to-correct")}`}
          </p>
          <p className="text-gray-500 text-lg">
            {t("assignment-prompt")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("assignment")}: {assignment.title}</h2>
              <p className="text-gray-600 text-md mb-2">{t("Students")}: <span className="font-semibold text-gray-800">{assignment.name}</span></p>
              {assignment.degreePercentage !== undefined && assignment.degreePercentage !== null && (
                <p className="text-gray-600 text-md mb-4">{t("grade")}: <span className="font-semibold text-gray-800">{assignment.degreePercentage}%</span></p>
              )}
              <button
              onClick={() => handleViewAssignment(assignment.id)}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {t("view-assignment")}
              </button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>{t("correct-assignment")}</DialogTitle>
        <DialogContent>
        {assignmentDetails && (
            <div className="space-y-4 p-4 bg-white rounded-lg shadow">
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <p className="text-sm text-gray-600 font-medium">{t("student-name")}</p>
                <p className="text-lg font-semibold text-gray-900">{assignmentDetails.studentName}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <p className="text-sm text-gray-600 font-medium">{t("course-name")}</p>
                <p className="text-lg font-semibold text-gray-900">{assignmentDetails.courseName}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <p className="text-sm text-gray-600 font-medium">{t("lesson-name")}</p>
                <p className="text-lg font-semibold text-gray-900">{assignmentDetails.lessonName}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <p className="text-sm text-gray-600 font-medium">{t("assignment-title")}</p>
                <p className="text-lg font-semibold text-gray-900">{assignmentDetails.assignmentTitle}</p>
              </div>
                {assignmentDetails.path && (
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <p className="text-sm text-gray-600 font-medium">{t("attachment")}</p>
                    <a
                      href={assignmentDetails.path}
                      target="_blank"
                      rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-lg font-semibold"
                  >
                    {t("view-attachment")}
                  </a>
                </div>
              )}
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <p className="text-sm text-gray-600 font-medium">{t("current-grade")}</p>
                <p className="text-lg font-semibold text-gray-900">
                  {assignmentDetails.degreePercentage !== undefined && assignmentDetails.degreePercentage !== null 
                    ? `${assignmentDetails.degreePercentage}%` 
                    : 'N/A'}
                </p>
              </div>

                  <TextField
                label="Degree Percentage"
                    type="number"
                    fullWidth
                    value={degreePercentage}
                    onChange={(e) => setDegreePercentage(e.target.value)}
                margin="normal"
                inputProps={{ min: 0, max: 100 }}
                  />
            </div>
          )}
            </DialogContent>
            <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>{t('cancel')}</Button>
          <Button onClick={handleSaveGrade} color="primary">{t("save-grade")}</Button>
            </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageAssignments; 