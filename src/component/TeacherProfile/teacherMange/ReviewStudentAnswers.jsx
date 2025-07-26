import React, { useState, useEffect } from 'react';
import { quizService } from '@/services/quizService';
import { courseService } from '@/services/courseService';
import Loader from '@/component/Loader/Loader';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useCombobox } from 'downshift';
import { useTranslation } from 'react-i18next';
import ContentWrapper from '@/component/ContentWrapper/ContentWrapper';


const ReviewStudentAnswers = () => {

  const { t } = useTranslation();
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

  const handleViewAnswers = (answerId) => {
    navigate(`/teacher/review-student-answers/${answerId}`);
  };

  const courseCombobox = useCombobox({
    items: courses,
    itemToString: (item) => (item ? item.title : ''),
    onSelectedItemChange: ({ selectedItem }) => {
      setSelectedCourse(selectedItem ? selectedItem.id : '');
      setSelectedLesson('');
      setQuizzesToCorrect([]);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 sm:p-10">
      <button
        onClick={() => navigate('/teacher/profile')}
        className="flex items-center text-blue-700 hover:text-blue-900 font-medium mb-8 transition-all duration-300 transform hover:-translate-x-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
      >
        <FaArrowLeft className="mr-2 text-xl" />
        <span className="text-lg">{t("back-to-profile")}</span>
      </button>

      <h1 className="text-5xl font-extrabold text-gray-900 mb-10 text-center leading-tight">
        {t("review-answers")}
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
                  placeholder="Select a course"
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
                    placeholder="Select a lesson"
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
          <strong className="font-bold text-xl">{t('error')}!</strong>
          <span className="block sm:inline ml-2 text-lg"> {error}</span>
        </div>
      ) : quizzesToCorrect.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-10 text-center text-gray-600 border border-gray-200 flex flex-col items-center justify-center animate-fade-in">
          <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
          <p className="text-2xl font-medium mb-4">
            {selectedLesson 
              ? `${t("no-quizzes-to-correct")}`
              : `${t("select-course-lesson-for-correction")}`}
          </p>
          <p className="text-gray-500 text-lg">
            {t("quiz-review-prompt")}

          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {quizzesToCorrect.map((quiz) => (
            <div key={quiz.studentQuizAnswerId} className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('quiz')}: {quiz.quizName}</h2>
              <p className="text-gray-600 text-md mb-2">{t('Student')}: <span className="font-semibold text-gray-800">{quiz.studentName}</span></p>
             
              <button
                onClick={() => handleViewAnswers(quiz.studentQuizAnswerId)}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {t("view-answers")}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewStudentAnswers; 