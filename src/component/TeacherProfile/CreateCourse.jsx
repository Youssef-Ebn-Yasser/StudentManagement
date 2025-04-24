import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./CearteCourse.css"

const CreateCourse = () => {
  // ====================== Navigation and State Hooks ======================
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('courses');
  const fileInputRef = useRef(null);
  
  // ====================== Constants and Enums ======================
  const courseCategories = {
    PROGRAMMING: 'Programming',
    DESIGN: 'Design',
    BUSINESS: 'Business',
    MARKETING: 'Marketing',
    SCIENCE: 'Science',
    MATHEMATICS: 'Mathematics',
    LANGUAGES: 'Languages',
    ARTS: 'Arts',
    OTHER: 'Other'
  };

  const contentTypes = {
    VIDEO: 'video',
    DOCUMENT: 'document',
    QUIZ: 'quiz',
    ASSIGNMENT: 'assignment',
    URL: 'url'
  };

  const materialTypes = {
    FILE: 'file',
    VIDEO: 'video',
    URL: 'url'
  };

  const lessonTypes = {
    LECTURE: 'lecture',
    PRACTICE: 'practice',
    QUIZ: 'quiz',
    ASSIGNMENT: 'assignment'
  };

  // ====================== State Management ======================
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [viewingMaterials, setViewingMaterials] = useState(null);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [editingMaterialId, setEditingMaterialId] = useState(null);

  // ====================== Loading States ======================
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ====================== Data Initialization ======================
  useEffect(() => {
    // TODO: API CALL - Fetch Initial Data
    // const fetchInitialData = async () => {
    //   try {
    //     const [coursesRes, lessonsRes, materialsRes, assignmentsRes] = await Promise.all([
    //       fetch('/api/courses'),
    //       fetch('/api/lessons'),
    //       fetch('/api/materials'),
    //       fetch('/api/assignments')
    //     ]);
    //     
    //     const coursesData = await coursesRes.json();
    //     const lessonsData = await lessonsRes.json();
    //     const materialsData = await materialsRes.json();
    //     const assignmentsData = await assignmentsRes.json();
    //     
    //     setCourses(coursesData);
    //     setLessons(lessonsData);
    //     setMaterials(materialsData);
    //     setAssignments(assignmentsData);
    //   } catch (error) {
    //     console.error('Error fetching initial data:', error);
    //   }
    // };
    // fetchInitialData();
  }, []);

  // ====================== Helper Functions ======================
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCourseMaterials = (courseId) => {
    // TODO: API CALL - Get Course Materials
    // const fetchCourseMaterials = async () => {
    //   const response = await fetch(`/api/courses/${courseId}/materials`);
    //   const data = await response.json();
    //   return data;
    // };
    return materials.filter(material => material.courseId === courseId);
  };

  const getCourseAssignments = (courseId) => {
    // TODO: API CALL - Get Course Assignments
    // const fetchCourseAssignments = async () => {
    //   const response = await fetch(`/api/courses/${courseId}/assignments`);
    //   const data = await response.json();
    //   return data;
    // };
    return assignments.filter(assignment => assignment.courseId === courseId);
  };

  const getCourseLessons = (courseId) => {
    // TODO: API CALL - Get Course Lessons
    // const fetchCourseLessons = async () => {
    //   const response = await fetch(`/api/courses/${courseId}/lessons`);
    //   const data = await response.json();
    //   return data;
    // };
    return lessons.filter(lesson => lesson.courseId === courseId);
  };

  const getCategoryColor = (category) => {
    const colors = {
      [courseCategories.PROGRAMMING]: '#6366F1',
      [courseCategories.DESIGN]: '#EC4899',
      [courseCategories.BUSINESS]: '#14B8A6',
      [courseCategories.MARKETING]: '#F59E0B',
      [courseCategories.SCIENCE]: '#10B981',
      [courseCategories.MATHEMATICS]: '#3B82F6',
      [courseCategories.LANGUAGES]: '#8B5CF6',
      [courseCategories.ARTS]: '#EF4444',
      [courseCategories.OTHER]: '#6B7280'
    };
    return colors[category] || colors[courseCategories.OTHER];
  };

  const getCoursesByCategory = () => {
    const grouped = {};
    Object.values(courseCategories).forEach(category => {
      grouped[category] = courses.filter(course => course.category === category);
    });
    return grouped;
  };

  // ====================== Error Handling ======================
  const handleApiError = (error) => {
    console.error('API Error:', error);
    setError(error.message || 'An error occurred');
    // TODO: Show error notification to user
    // showNotification('error', error.message || 'An error occurred');
  };

  // ====================== API Configuration ======================
  const API_BASE_URL = '/api';
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add authentication token
      // 'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  };

  // ====================== API Response Handlers ======================
  const handleApiResponse = async (response) => {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }
    return response.json();
  };

  // ====================== Course Search API ======================
  const searchCourses = async (query) => {
    // TODO: API CALL - Search Courses
    // try {
    //   setIsLoading(true);
    //   const response = await fetch(`${API_BASE_URL}/courses/search?q=${encodeURIComponent(query)}`, {
    //     ...API_CONFIG
    //   });
    //   const data = await handleApiResponse(response);
    //   return data;
    // } catch (error) {
    //   handleApiError(error);
    //   return [];
    // } finally {
    //   setIsLoading(false);
    // }
    return courses.filter(course => 
      course.title.toLowerCase().includes(query.toLowerCase()) ||
      course.description.toLowerCase().includes(query.toLowerCase())
    );
  };

  // ====================== Course Enrollment API ======================
  const handleEnrollStudent = async (courseId, studentId) => {
    // TODO: API CALL - Enroll Student
    // try {
    //   setIsLoading(true);
    //   const response = await fetch(`${API_BASE_URL}/courses/${courseId}/enroll`, {
    //     method: 'POST',
    //     ...API_CONFIG,
    //     body: JSON.stringify({ studentId })
    //   });
    //   const data = await handleApiResponse(response);
    //   return data;
    // } catch (error) {
    //   handleApiError(error);
    //   return null;
    // } finally {
    //   setIsLoading(false);
    // }
      setCourses(courses.map(course => {
        if (course.id === courseId) {
          return {
            ...course,
          students: [...course.students, studentId]
          };
        }
        return course;
      }));
  };

  // ====================== Course Progress API ======================
  const updateCourseProgress = async (courseId, progress) => {
    // TODO: API CALL - Update Course Progress
    // try {
    //   setIsLoading(true);
    //   const response = await fetch(`${API_BASE_URL}/courses/${courseId}/progress`, {
    //     method: 'PUT',
    //     ...API_CONFIG,
    //     body: JSON.stringify({ progress })
    //   });
    //   const data = await handleApiResponse(response);
    //   return data;
    // } catch (error) {
    //   handleApiError(error);
    //   return null;
    // } finally {
    //   setIsLoading(false);
    // }
  };

  // ====================== Material Download API ======================
  const downloadMaterial = async (materialId) => {
    // TODO: API CALL - Download Material
    // try {
    //   setIsLoading(true);
    //   const response = await fetch(`${API_BASE_URL}/materials/${materialId}/download`, {
    //     ...API_CONFIG
    //   });
    //   const blob = await response.blob();
    //   const url = window.URL.createObjectURL(blob);
    //   const a = document.createElement('a');
    //   a.href = url;
    //   a.download = `material-${materialId}`;
    //   document.body.appendChild(a);
    //   a.click();
    //   window.URL.revokeObjectURL(url);
    //   document.body.removeChild(a);
    // } catch (error) {
    //   handleApiError(error);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  // ====================== Assignment Submission API ======================
  const submitAssignment = async (assignmentId, submission) => {
    // TODO: API CALL - Submit Assignment
    // try {
    //   setIsLoading(true);
    //   const formData = new FormData();
    //   formData.append('submission', submission.file);
    //   formData.append('data', JSON.stringify(submission));
    //   
    //   const response = await fetch(`${API_BASE_URL}/assignments/${assignmentId}/submit`, {
    //     method: 'POST',
    //     body: formData
    //   });
    //   const data = await handleApiResponse(response);
    //   return data;
    // } catch (error) {
    //   handleApiError(error);
    //   return null;
    // } finally {
    //   setIsLoading(false);
    // }
  };

  // ====================== Course Analytics API ======================
  const getCourseAnalytics = async (courseId) => {
    // TODO: API CALL - Get Course Analytics
    // try {
    //   setIsLoading(true);
    //   const response = await fetch(`${API_BASE_URL}/courses/${courseId}/analytics`, {
    //     ...API_CONFIG
    //   });
    //   const data = await handleApiResponse(response);
    //   return data;
    // } catch (error) {
    //   handleApiError(error);
    //   return null;
    // } finally {
    //   setIsLoading(false);
    // }
    return {
      totalEnrollments: courses.find(c => c.id === courseId)?.students.length || 0,
      completionRate: 0,
      averageScore: 0,
      popularLessons: []
    };
  };

  // ====================== Course Management Functions ======================
  const handleCreateCourse = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const file = formData.get('image');
    let imageUrl = '';

    if (file) {
      imageUrl = URL.createObjectURL(file);
    }

    const newCourse = {
      id: Date.now().toString(),
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      price: parseFloat(formData.get('price')),
      imageUrl,
      materials: [],
      students: [],
      assignments: [],
      contentTypes: [
        { type: contentTypes.VIDEO, count: 0 },
        { type: contentTypes.DOCUMENT, count: 0 },
        { type: contentTypes.QUIZ, count: 0 },
        { type: contentTypes.ASSIGNMENT, count: 0 }
      ],
      createdAt: new Date().toISOString()
    };

    // TODO: API CALL - Create Course
    // await fetch('/api/courses', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(newCourse)
    // });

    setCourses([...courses, newCourse]);
    setActiveTab('lessons');
    e.target.reset();
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
  };

  const handleUpdateCourse = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const file = formData.get('image');
    let imageUrl = editingCourse.imageUrl;

    if (file) {
      imageUrl = URL.createObjectURL(file);
    }

    const updatedCourse = {
      ...editingCourse,
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      price: parseFloat(formData.get('price')),
      imageUrl
    };

    // TODO: API CALL - Update Course
    // await fetch(`/api/courses/${updatedCourse.id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(updatedCourse)
    // });

    setCourses(courses.map(course =>
      course.id === updatedCourse.id ? updatedCourse : course
    ));
    setEditingCourse(null);
    e.target.reset();
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm('Are you sure you want to delete this course? This will also delete all associated materials and assignments.')) {
      // TODO: API CALL - Delete Course
      // await fetch(`/api/courses/${courseId}`, {
      //   method: 'DELETE'
      // });

      setMaterials(materials.filter(material => material.courseId !== courseId));
      setAssignments(assignments.filter(assignment => assignment.courseId !== courseId));
      setCourses(courses.filter(course => course.id !== courseId));
    }
  };

  // ====================== Lesson Management Functions ======================
  const handleCreateLesson = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const courseId = formData.get('courseId');

    if (!courseId) {
      alert('Please select a course');
      return;
    }

    const newLesson = {
      id: Date.now().toString(),
      courseId,
      title: formData.get('title'),
      description: formData.get('description'),
      type: formData.get('type'),
      link: formData.get('link'),
      materials: [],
      order: lessons.filter(l => l.courseId === courseId).length + 1,
      createdAt: new Date().toISOString()
    };

    // TODO: API CALL - Create Lesson
    // await fetch('/api/lessons', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(newLesson)
    // });

    setLessons([...lessons, newLesson]);
    setCourses(courses.map(course => {
      if (course.id === courseId) {
        return {
          ...course,
          lessons: [...course.lessons, newLesson.id]
        };
      }
      return course;
    }));

    setViewingMaterials(courseId);
    setActiveTab('materials');

    setTimeout(() => {
      const courseSelect = document.querySelector('select[name="courseId"]');
      const lessonSelect = document.querySelector('select[name="lessonId"]');
      if (courseSelect && lessonSelect) {
        courseSelect.value = courseId;
        const event = new Event('change', { bubbles: true });
        courseSelect.dispatchEvent(event);
        
        setTimeout(() => {
          lessonSelect.value = newLesson.id;
        }, 100);
      }
    }, 0);

    e.target.reset();
  };

  const handleEditLesson = (lesson) => {
    setEditingLesson(lesson);
  };

  const handleUpdateLesson = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const updatedLesson = {
      ...editingLesson,
      title: formData.get('title'),
      description: formData.get('description'),
      type: formData.get('type'),
      link: formData.get('link')
    };

    // TODO: API CALL - Update Lesson
    // await fetch(`/api/lessons/${updatedLesson.id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(updatedLesson)
    // });

    setLessons(lessons.map(lesson =>
      lesson.id === updatedLesson.id ? updatedLesson : lesson
    ));
    setEditingLesson(null);
    e.target.reset();
  };

  const handleDeleteLesson = (lessonId, courseId) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      // TODO: API CALL - Delete Lesson
      // await fetch(`/api/lessons/${lessonId}`, {
      //   method: 'DELETE'
      // });

      setLessons(lessons.filter(lesson => lesson.id !== lessonId));
      setCourses(courses.map(course => {
        if (course.id === courseId) {
          return {
            ...course,
            lessons: course.lessons.filter(id => id !== lessonId)
          };
        }
        return course;
      }));
    }
  };

  // ====================== Material Management Functions ======================
  const handleUploadMaterial = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const materialType = formData.get('materialType');
    const file = formData.get('file');
    const courseId = formData.get('courseId');
    const lessonId = formData.get('lessonId');
    
    if (!courseId) {
      alert('Please select a course');
      return;
    }

    if (!lessonId) {
      alert('Please select a lesson');
      return;
    }

    let content = '';
    let fileUrl = '';
    let fileType = '';
    let fileSize = 0;

    if (materialType === materialTypes.FILE || materialType === materialTypes.VIDEO) {
      if (file) {
        fileUrl = URL.createObjectURL(file);
        fileType = file.type;
        fileSize = file.size;
        content = `File: ${file.name}`;
      }
    } else if (materialType === materialTypes.URL) {
      content = formData.get('url');
      fileUrl = content;
    }

    const newMaterial = {
      id: Date.now().toString(),
      courseId,
      lessonId,
      title: formData.get('title'),
      description: formData.get('description'),
      materialType,
      content,
      fileUrl,
      fileType,
      fileSize,
      uploadDate: new Date().toISOString()
    };

    // TODO: API CALL - Upload Material
    // const formDataToSend = new FormData();
    // formDataToSend.append('file', file);
    // formDataToSend.append('data', JSON.stringify(newMaterial));
    // await fetch('/api/materials', {
    //   method: 'POST',
    //   body: formDataToSend
    // });

    setMaterials([...materials, newMaterial]);
    setCourses(courses.map(course => {
      if (course.id === courseId) {
        const updatedContentTypes = course.contentTypes.map(ct => {
          if (materialType === materialTypes.VIDEO && ct.type === contentTypes.VIDEO) {
            return { ...ct, count: ct.count + 1 };
          }
          if (materialType === materialTypes.FILE && ct.type === contentTypes.DOCUMENT) {
            return { ...ct, count: ct.count + 1 };
          }
          return ct;
        });

        return {
          ...course,
          materials: [...course.materials, newMaterial.id],
          contentTypes: updatedContentTypes
        };
      }
      return course;
    }));

    e.target.reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEditMaterial = (material) => {
    setEditingMaterial(material);
  };

  const handleUpdateMaterial = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const materialType = formData.get('materialType');
    const file = formData.get('file');
    const courseId = formData.get('courseId');

    let content = '';
    let fileUrl = editingMaterial.fileUrl;
    let fileType = editingMaterial.fileType;
    let fileSize = editingMaterial.fileSize;

    if (materialType === materialTypes.FILE || materialType === materialTypes.VIDEO) {
      if (file) {
        fileUrl = URL.createObjectURL(file);
        fileType = file.type;
        fileSize = file.size;
        content = `File: ${file.name}`;
      } else {
        content = editingMaterial.content;
      }
    } else if (materialType === materialTypes.URL) {
      content = formData.get('url');
      fileUrl = content;
    }

    const updatedMaterial = {
      ...editingMaterial,
      courseId,
      title: formData.get('title'),
      description: formData.get('description'),
      materialType,
      content,
      fileUrl,
      fileType,
      fileSize
    };

    // TODO: API CALL - Update Material
    // const formDataToSend = new FormData();
    // formDataToSend.append('file', file);
    // formDataToSend.append('data', JSON.stringify(updatedMaterial));
    // await fetch(`/api/materials/${updatedMaterial.id}`, {
    //   method: 'PUT',
    //   body: formDataToSend
    // });

    setMaterials(materials.map(material =>
      material.id === updatedMaterial.id ? updatedMaterial : material
    ));
    setEditingMaterial(null);
    e.target.reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteMaterial = (materialId, courseId) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      // TODO: API CALL - Delete Material
      // await fetch(`/api/materials/${materialId}`, {
      //   method: 'DELETE'
      // });

      setMaterials(materials.filter(material => material.id !== materialId));
      setCourses(courses.map(course => {
        if (course.id === courseId) {
          const materialToDelete = materials.find(m => m.id === materialId);
          const updatedContentTypes = course.contentTypes.map(ct => {
            if (materialToDelete.materialType === materialTypes.VIDEO && ct.type === contentTypes.VIDEO) {
              return { ...ct, count: Math.max(0, ct.count - 1) };
            }
            if (materialToDelete.materialType === materialTypes.FILE && ct.type === contentTypes.DOCUMENT) {
              return { ...ct, count: Math.max(0, ct.count - 1) };
            }
            return ct;
          });

          return {
            ...course,
            materials: course.materials.filter(id => id !== materialId),
            contentTypes: updatedContentTypes
          };
        }
        return course;
      }));
    }
  };

  // ====================== Assignment Management Functions ======================
  const handleCreateAssignment = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const courseId = formData.get('courseId');

    if (!courseId) {
      alert('Please select a course');
      return;
    }

    const newAssignment = {
      id: Date.now().toString(),
      courseId,
      title: formData.get('title'),
      description: formData.get('description'),
      deadline: formData.get('deadline'),
      type: contentTypes.ASSIGNMENT,
      maxScore: parseInt(formData.get('maxScore') || '100', 10),
      createdAt: new Date().toISOString()
    };

    // TODO: API CALL - Create Assignment
    // await fetch('/api/assignments', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(newAssignment)
    // });

    setAssignments([...assignments, newAssignment]);
    setCourses(courses.map(course => {
      if (course.id === courseId) {
        return {
          ...course,
          assignments: [...course.assignments, newAssignment.id],
          contentTypes: course.contentTypes.map(ct =>
            ct.type === contentTypes.ASSIGNMENT
              ? { ...ct, count: ct.count + 1 }
              : ct
          )
        };
      }
      return course;
    }));

    e.target.reset();
  };

  const handleDeleteAssignment = (assignmentId, courseId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      // TODO: API CALL - Delete Assignment
      // await fetch(`/api/assignments/${assignmentId}`, {
      //   method: 'DELETE'
      // });

      setAssignments(assignments.filter(assignment => assignment.id !== assignmentId));
      setCourses(courses.map(course => {
        if (course.id === courseId) {
          return {
            ...course,
            assignments: course.assignments.filter(id => id !== assignmentId),
            contentTypes: course.contentTypes.map(ct =>
              ct.type === contentTypes.ASSIGNMENT
                ? { ...ct, count: Math.max(0, ct.count - 1) }
                : ct
            )
          };
        }
        return course;
      }));
    }
  };

  // ====================== View Materials Handler ======================
  const handleViewMaterials = (courseId) => {
    // TODO: API CALL - Get Course Materials
    // const fetchCourseMaterials = async () => {
    //   const response = await fetch(`/api/courses/${courseId}/materials`);
    //   const data = await response.json();
    //   setMaterials(data);
    // };
    // fetchCourseMaterials();

    setViewingMaterials(courseId);
    setActiveTab('materials');
    
    const courseSelect = document.querySelector('select[name="courseId"]');
    if (courseSelect) {
      courseSelect.value = courseId;
      const event = new Event('change', { bubbles: true });
      courseSelect.dispatchEvent(event);
    }
  };

  // ====================== Cancel Handlers ======================
  const handleCancelEdit = () => {
    setEditingCourse(null);
  };

  const handleCancelLessonEdit = () => {
    setEditingLesson(null);
  };

  const handleCancelMaterialEdit = () => {
    setEditingMaterial(null);
  };

  // ====================== Course Form Component ======================
  const CourseForm = ({ course, onSubmit, onCancel, submitText }) => (
    <form onSubmit={onSubmit}>
      {/* TODO: Add API validation for form fields */}
              <div className="form-group">
                <label className="required-field">Title</label>
                <input
                  type="text"
                  name="title"
                  required
          defaultValue={course?.title}
                  placeholder="Enter course title"
          // TODO: Add API validation
          // onBlur={async (e) => {
          //   const response = await fetch(`/api/courses/validate-title?title=${encodeURIComponent(e.target.value)}`);
          //   const { valid } = await response.json();
          //   if (!valid) {
          //     // Show error message
          //   }
          // }}
                />
              </div>
      <div className="form-group">
        <label>Course Image</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          className="image-input"
          // TODO: Add API validation for file size and type
          // onChange={async (e) => {
          //   const file = e.target.files[0];
          //   const response = await fetch('/api/validate-image', {
          //     method: 'POST',
          //     body: file
          //   });
          //   const { valid } = await response.json();
          //   if (!valid) {
          //     // Show error message
          //   }
          // }}
        />
        {course?.imageUrl && (
          <div className="image-preview">
            <img src={course.imageUrl} alt="Course preview" />
          </div>
        )}
      </div>
              <div className="form-group">
                <label className="required-field">Category</label>
        <select name="category" required className="category-select" defaultValue={course?.category}>
                  <option value="">Select a category</option>
                  {Object.entries(courseCategories).map(([key, value]) => (
                    <option key={key} value={value}>{value}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="required-field">Description</label>
                <textarea
                  name="description"
                  required
          defaultValue={course?.description}
                  placeholder="Enter course description"
                  rows="4"
                />
              </div>
      <div className="form-group">
        <label className="required-field">Price</label>
        <input
          type="number"
          name="price"
          required
          min="0"
          step="0.01"
          defaultValue={course?.price}
          placeholder="Enter course price"
        />
      </div>
      <div className="form-actions">
        {onCancel && (
          <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
        )}
        <button type="submit" className="save-button">{submitText}</button>
      </div>
            </form>
  );

  // ====================== Main Render ======================
  return (
    <div className="app-container">
      {/* TODO: Add API authentication check */}
      {/* {!isAuthenticated && <Redirect to="/login" />} */}
      
      <nav className="sidebar">
        <div className="logo-gradient">
          <svg xmlns="http://www.w3.org/2000/svg" className="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="sidebar-text">E-Learning</span>
        </div>
        <ul>
          <li 
            className={`sidebar-item ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="sidebar-text">Create Course</span>
          </li>
          <li
            className={`sidebar-item ${activeTab === 'lessons' ? 'active' : ''}`}
            onClick={() => setActiveTab('lessons')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="sidebar-text">Add Lesson</span>
          </li>
          <li 
            className={`sidebar-item ${activeTab === 'materials' ? 'active' : ''}`}
            onClick={() => setActiveTab('materials')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="sidebar-text">Upload Material</span>
          </li>
          <li 
            className={`sidebar-item ${activeTab === 'assignments' ? 'active' : ''}`}
            onClick={() => setActiveTab('assignments')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="sidebar-text">Create Assignment</span>
          </li>
          <li
            className={`sidebar-item ${activeTab === 'editCourse' ? 'active' : ''}`}
            onClick={() => setActiveTab('editCourse')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="sidebar-text">Edit Course</span>
          </li>
        </ul>
      </nav>

      <main className="main-content">
        {/* TODO: Add API loading state */}
        {/* {isLoading && <LoadingSpinner />} */}
        
        {/* TODO: Add API error handling */}
        {/* {error && <ErrorMessage message={error} />} */}

        {activeTab === 'courses' && (
          <div className="form-container">
            {editingCourse ? (
              <>
                <h2>Edit Course</h2>
                <CourseForm
                  course={editingCourse}
                  onSubmit={handleUpdateCourse}
                  onCancel={handleCancelEdit}
                  submitText="Update Course"
                />
              </>
            ) : (
              <>
            <h2>Create New Course</h2>
                <CourseForm
                  onSubmit={handleCreateCourse}
                  submitText="Create Course"
                />
            <div className="items-list">
              <h3>Created Courses</h3>
              {Object.entries(getCoursesByCategory()).map(([category, categoryCourses]) => (
                categoryCourses.length > 0 && (
                  <div key={category} className="category-section">
                    <h4 className="category-title" style={{ color: getCategoryColor(category) }}>
                      {category}
                    </h4>
                    <div className="category-courses">
                      {categoryCourses.map(course => (
                        <div key={course.id} className="course-card">
                          <div className="card-header">
                            <h4>{course.title}</h4>
                                <div className="card-actions">
                                  <button
                                    className="edit-btn"
                                    onClick={() => {
                                      setEditingCourse(course);
                                      setEditingCourseId(course.id);
                                      setActiveTab('courses');
                                    }}
                                    title="Edit Course"
                                  >
                                    ✎
                                  </button>
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteCourse(course.id)}
                              title="Delete Course"
                            >
                              ×
                            </button>
                          </div>
                              </div>

                              {course.imageUrl && (
                                <div className="course-image">
                                  <img src={course.imageUrl} alt={course.title} />
                                </div>
                              )}

                          <span 
                            className="category-badge"
                            style={{ 
                              backgroundColor: getCategoryColor(course.category),
                              color: 'white'
                            }}
                          >
                            {course.category}
                          </span>

                          <p>{course.description}</p>

                              <div className="course-details">
                                <div className="course-price">
                                  ${course.price.toFixed(2)}
                                </div>

                                <div className="lessons-list">
                                  <h5>Course Lessons</h5>
                                  {getCourseLessons(course.id).map(lesson => (
                                    <div key={lesson.id} className="lesson-item">
                                      <div className="lesson-info">
                                        <span className="lesson-title">{lesson.title}</span>
                                        <span className="lesson-type">{lesson.type}</span>
                                      </div>
                                      <div className="lesson-actions">
                                        {lesson.link && (
                                          <a
                                            href={lesson.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="lesson-link"
                                          >
                                            View Content
                                          </a>
                                        )}
                                        <button
                                          className="edit-btn small"
                                          onClick={() => {
                                            setEditingLesson(lesson);
                                            setEditingLessonId(lesson.id);
                                            setActiveTab('lessons');
                                          }}
                                          title="Edit Lesson"
                                        >
                                          ✎
                                        </button>
                                        <button
                                          className="delete-btn small"
                                          onClick={() => handleDeleteLesson(lesson.id, course.id)}
                                          title="Delete Lesson"
                                        >
                                          ×
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                          
                          <div className="materials-list">
                            <h5>Course Materials</h5>
                            {getCourseMaterials(course.id).map(material => (
                              <div key={material.id} className="material-item">
                                      <div className="card-header">
                                        <h5>{material.title}</h5>
                                  <span className="material-type">{material.materialType}</span>
                                      </div>
                                      {material.description && (
                                        <p>{material.description}</p>
                                      )}
                                      <div className="card-stats">
                                        <span>Uploaded: {new Date(material.uploadDate).toLocaleDateString()}</span>
                                        {material.fileSize && (
                                          <span>Size: {formatFileSize(material.fileSize)}</span>
                                        )}
                                      </div>
                                      <div className="material-actions">
                                        {material.fileUrl && (
                                          <a 
                                            href={material.fileUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="view-content-btn"
                                          >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            View Content
                                          </a>
                                        )}
                                        <button
                                          className="edit-btn small"
                                          onClick={() => {
                                            setEditingMaterial(material);
                                            setActiveTab('materials');
                                          }}
                                          title="Edit Material"
                                        >
                                          ✎
                                        </button>
                                  <button
                                    className="delete-btn small"
                                    onClick={() => handleDeleteMaterial(material.id, course.id)}
                                    title="Delete Material"
                                  >
                                    ×
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="assignments-list">
                            <h5>Course Assignments</h5>
                            {getCourseAssignments(course.id).map(assignment => (
                              <div key={assignment.id} className="assignment-item">
                                <div className="assignment-info">
                                  <span>{assignment.title}</span>
                                  <span className="assignment-deadline">
                                    Due: {new Date(assignment.deadline).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="assignment-item-actions">
                                  <span className="assignment-score">Max Score: {assignment.maxScore}</span>
                                  <button
                                    className="delete-btn small"
                                    onClick={() => handleDeleteAssignment(assignment.id, course.id)}
                                    title="Delete Assignment"
                                  >
                                    ×
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="card-stats">
                            <span>{course.materials.length} materials</span>
                            <span>{course.assignments.length} assignments</span>
                            <span>{course.students.length} students</span>
                            <span>Content Types: {course.contentTypes.filter(ct => ct.count > 0).length}</span>
                                </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
              </>
            )}
          </div>
        )}

        {/* ====================== Lessons Tab ====================== */}
        {activeTab === 'lessons' && (
          <div className="form-container">
            {editingLesson ? (
              <>
                <h2>Edit Lesson</h2>
                <form onSubmit={handleUpdateLesson}>
                  {/* TODO: Add API validation for lesson fields */}
                  <div className="form-group">
                    <label className="required-field">Lesson Title</label>
                    <input
                      type="text"
                      name="title"
                      required
                      defaultValue={editingLesson.title}
                      placeholder="Enter lesson title"
                      // TODO: Add API validation
                      // onBlur={async (e) => {
                      //   const response = await fetch(`/api/lessons/validate-title?title=${encodeURIComponent(e.target.value)}`);
                      //   const { valid } = await response.json();
                      //   if (!valid) {
                      //     // Show error message
                      //   }
                      // }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="required-field">Lesson Type</label>
                    <select name="type" required className="category-select" defaultValue={editingLesson.type}>
                      <option value="">Select type</option>
                      {Object.entries(lessonTypes).map(([key, value]) => (
                        <option key={key} value={value}>{value}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Lesson Link</label>
                    <input
                      type="url"
                      name="link"
                      defaultValue={editingLesson.link}
                      placeholder="Enter lesson URL (optional)"
                      // TODO: Add API validation for URL
                      // onBlur={async (e) => {
                      //   const response = await fetch(`/api/lessons/validate-url?url=${encodeURIComponent(e.target.value)}`);
                      //   const { valid } = await response.json();
                      //   if (!valid) {
                      //     // Show error message
                      //   }
                      // }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="required-field">Description</label>
                    <textarea
                      name="description"
                      required
                      defaultValue={editingLesson.description}
                      placeholder="Enter lesson description"
                      rows="3"
                    />
                  </div>
                  <div className="form-actions">
                    <button type="button" className="cancel-button" onClick={handleCancelLessonEdit}>Cancel</button>
                    <button type="submit" className="save-button">Update Lesson</button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2>Add New Lesson</h2>
                <form onSubmit={handleCreateLesson}>
                  {/* TODO: Add API validation for new lesson fields */}
              <div className="form-group">
                <label className="required-field">Select Course</label>
                    <select name="courseId" required className="category-select">
                  <option value="">Choose a course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                    <label className="required-field">Lesson Title</label>
                  <input
                    type="text"
                  name="title"
                  required
                      placeholder="Enter lesson title"
                    />
                  </div>
                  <div className="form-group">
                    <label className="required-field">Lesson Type</label>
                    <select name="type" required className="category-select">
                      <option value="">Select type</option>
                      {Object.entries(lessonTypes).map(([key, value]) => (
                        <option key={key} value={value}>{value}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Lesson Link</label>
                    <input
                      type="url"
                      name="link"
                      placeholder="Enter lesson URL (optional)"
                />
                </div>
              <div className="form-group">
                <label className="required-field">Description</label>
                <textarea
                  name="description"
                  required
                      placeholder="Enter lesson description"
                  rows="3"
                    />
                  </div>
                  <button type="submit" className="save-button">Create Lesson</button>
                </form>
              </>
            )}

            {/* TODO: Add API loading state for lessons list */}
            {/* {isLoadingLessons && <LoadingSpinner />} */}
            
            <div className="items-list">
              <h3>Course Lessons</h3>
              {courses.map(course => {
                const courseLessons = getCourseLessons(course.id);
                if (courseLessons.length === 0) return null;

                return (
                  <div key={course.id} className="course-section">
                    <div className="flex justify-between items-center mb-4">
                      <h4>{course.title}</h4>
                    </div>
                    {courseLessons.map(lesson => (
                      <div key={lesson.id} className="lesson-card">
                        <div className="card-header">
                          <h5>{lesson.title}</h5>
                          <span className="lesson-type">{lesson.type}</span>
                        </div>
                        <p>{lesson.description}</p>
                        {lesson.link && (
                          <div className="lesson-link">
                            <a href={lesson.link} target="_blank" rel="noopener noreferrer">
                              View Lesson Content
                            </a>
                          </div>
                        )}
                        <div className="card-stats">
                          <span>Order: {lesson.order}</span>
                          <span>Created: {new Date(lesson.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ====================== Materials Tab ====================== */}
        {activeTab === 'materials' && (
          <div className="form-container">
            <h2>Course Materials</h2>
            <form onSubmit={handleUploadMaterial}>
              {/* TODO: Add API validation for material upload */}
              <div className="form-group">
                <label className="required-field">Select Course</label>
                <select
                  name="courseId"
                  required
                  className="category-select"
                  value={viewingMaterials || ''}
                  onChange={(e) => {
                    const lessonSelect = e.target.form.querySelector('select[name="lessonId"]');
                    const courseLessons = getCourseLessons(e.target.value);
                    lessonSelect.innerHTML = `
                      <option value="">Choose a lesson</option>
                      ${courseLessons.map(lesson => `
                        <option value="${lesson.id}">${lesson.title}</option>
                      `).join('')}
                    `;
                    setViewingMaterials(e.target.value);
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
              <div className="form-group">
                <label className="required-field">Select Lesson</label>
                <select
                  name="lessonId"
                  required
                  className="category-select"
                >
                  <option value="">Choose a lesson</option>
                </select>
              </div>
              <div className="form-group">
                <label className="required-field">Material Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Enter material title"
                />
              </div>
              <div className="form-group">
                <label className="required-field">Material Type</label>
                <select 
                  name="materialType" 
                  required
                  onChange={(e) => {
                    const form = e.target.form;
                    const fileInput = form.querySelector('.file-input');
                    const urlInput = form.querySelector('.url-input');
                    
                    if (e.target.value === materialTypes.URL) {
                      fileInput.style.display = 'none';
                      urlInput.style.display = 'block';
                    } else {
                      fileInput.style.display = 'block';
                      urlInput.style.display = 'none';
                    }
                  }}
                >
                  <option value="">Select type</option>
                  {Object.entries(materialTypes).map(([key, value]) => (
                    <option key={key} value={value}>{value}</option>
                  ))}
                </select>
              </div>
              <div className="form-group file-input">
                <label className="required-field">File</label>
                  <input
                  type="file"
                  name="file"
                  ref={fileInputRef}
                  accept=".pdf,.doc,.docx,.txt,video/*"
                  // TODO: Add API validation for file upload
                  // onChange={async (e) => {
                  //   const file = e.target.files[0];
                  //   const response = await fetch('/api/materials/validate-file', {
                  //     method: 'POST',
                  //     body: file
                  //   });
                  //   const { valid } = await response.json();
                  //   if (!valid) {
                  //     // Show error message
                  //   }
                  // }}
                />
                <p className="help-text">Supported formats: PDF, DOC, DOCX, TXT, and video files</p>
                </div>
              <div className="form-group url-input" style={{ display: 'none' }}>
                <label className="required-field">URL</label>
                <input
                  type="url"
                  name="url"
                  placeholder="Enter resource URL"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  placeholder="Enter material description"
                  rows="3"
                />
              </div>
              <button type="submit" className="save-button">Upload Material</button>
            </form>

            {/* TODO: Add API loading state for materials list */}
            {/* {isLoadingMaterials && <LoadingSpinner />} */}

            <div className="items-list">
              <h3>Course Materials</h3>
              {courses.map(course => {
                if (viewingMaterials && course.id !== viewingMaterials) return null;
                
                const courseLessons = getCourseLessons(course.id);
                if (courseLessons.length === 0) return null;

                return (
                  <div key={course.id} className="course-section">
                    <div className="flex justify-between items-center mb-4">
                      <h4>{course.title}</h4>
                  </div>
                    {courseLessons.map(lesson => {
                      const lessonMaterials = materials.filter(material => 
                        material.courseId === course.id && material.lessonId === lesson.id
                      );
                      if (lessonMaterials.length === 0) return null;

                      return (
                        <div key={lesson.id} className="lesson-section">
                          <h5>{lesson.title}</h5>
                          {lessonMaterials.map(material => (
                            <div key={material.id} className="lesson-card">
                              <div className="flex justify-between items-center">
                                <h5 className="text-lg font-medium">{material.title}</h5>
                                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-sm">
                                  {material.materialType}
                                </span>
                      </div>
                              {material.description && (
                                <p className="text-gray-600 mt-2">{material.description}</p>
                              )}
                              <div className="flex items-center gap-4 mt-4">
                                {material.fileUrl && (
                        <a 
                          href={material.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                                    className="view-content-btn"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    View Content
                                  </a>
                                )}
                      </div>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                <span>Created: {new Date(material.uploadDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ====================== Assignments Tab ====================== */}
        {activeTab === 'assignments' && (
          <div className="form-container">
            <h2>Create New Assignment</h2>
            <form onSubmit={handleCreateAssignment}>
              {/* TODO: Add API validation for assignment fields */}
              <div className="form-group">
                <label className="required-field">Select Course</label>
                <select name="courseId" required>
                  <option value="">Choose a course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                  </select>
              </div>
              <div className="form-group">
                <label className="required-field">Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Enter assignment title"
                />
              </div>
              <div className="form-group">
                <label className="required-field">Description</label>
                <textarea
                  name="description"
                  required
                  placeholder="Enter assignment description"
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label className="required-field">Deadline</label>
                  <input
                  type="datetime-local"
                  name="deadline"
                  required
                />
              </div>
              <div className="form-group">
                <label>Max Score</label>
                <input
                  type="number"
                  name="maxScore"
                  placeholder="Enter maximum score"
                  defaultValue="100"
                />
            </div>
              <button type="submit" className="save-button">Create Assignment</button>
            </form>

            {/* TODO: Add API loading state for assignments list */}
            {/* {isLoadingAssignments && <LoadingSpinner />} */}

            <div className="items-list">
              <h3>All Assignments</h3>
              {assignments.map(assignment => (
                <div key={assignment.id} className="course-card">
                  <div className="card-header">
                    <h4>{assignment.title}</h4>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteAssignment(assignment.id, assignment.courseId)}
                      title="Delete Assignment"
                    >
                      ×
            </button>
          </div>
                  <p>{assignment.description}</p>
                  <p className="course-info">
                    Course: {courses.find(c => c.id === assignment.courseId)?.title || 'Unknown'}
                  </p>
                  <div className="card-stats">
                    <span>Max Score: {assignment.maxScore}</span>
                    <span>Created: {new Date(assignment.createdAt).toLocaleDateString()}</span>
          </div>
                  <p className="deadline">Due: {new Date(assignment.deadline).toLocaleString()}</p>
        </div>
              ))}
          </div>
          </div>
        )}

        {/* ====================== Edit Course Tab ====================== */}
        {activeTab === 'editCourse' && (
          <div className="form-container">
            <h2>Edit Courses</h2>
            <div className="items-list">
              {courses.map(course => (
                <div key={course.id} className="course-card">
                  <div className="card-header">
                    <h4>{course.title}</h4>
                    <div className="card-actions">
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setEditingCourse(course);
                          setEditingCourseId(course.id);
                          setActiveTab('courses');
                        }}
                        title="Edit Course"
                      >
                        ✎
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteCourse(course.id)}
                        title="Delete Course"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {course.imageUrl && (
                    <div className="course-image">
                      <img src={course.imageUrl} alt={course.title} />
                    </div>
                  )}

                  <span
                    className="category-badge"
                    style={{
                      backgroundColor: getCategoryColor(course.category),
                      color: 'white'
                    }}
                  >
                    {course.category}
                  </span>

                  <p>{course.description}</p>

                  <div className="course-details">
                    <div className="course-price">
                      ${course.price.toFixed(2)}
                    </div>

                    <div className="lessons-list">
                      <h5>Course Lessons</h5>
                      {getCourseLessons(course.id).map(lesson => (
                        <div key={lesson.id} className="lesson-item">
                          <div className="lesson-info">
                            <span className="lesson-title">{lesson.title}</span>
                            <span className="lesson-type">{lesson.type}</span>
                          </div>
                          <div className="lesson-actions">
                            {lesson.link && (
                              <a
                                href={lesson.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="lesson-link"
                              >
                                View Content
                              </a>
                            )}
                            <button
                              className="edit-btn small"
                              onClick={() => {
                                setEditingLesson(lesson);
                                setEditingLessonId(lesson.id);
                                setActiveTab('lessons');
                              }}
                              title="Edit Lesson"
                            >
                              ✎
                            </button>
                            <button
                              className="delete-btn small"
                              onClick={() => handleDeleteLesson(lesson.id, course.id)}
                              title="Delete Lesson"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="materials-list">
                      <h5>Course Materials</h5>
                      {materials
                        .filter(material => material.courseId === course.id)
                        .map(material => (
                          <div key={material.id} className="material-item">
                            <div className="card-header">
                              <h5>{material.title}</h5>
                              <span className="material-type">{material.materialType}</span>
                            </div>
                            {material.description && (
                              <p>{material.description}</p>
                            )}
                            <div className="card-stats">
                              <span>Uploaded: {new Date(material.uploadDate).toLocaleDateString()}</span>
                              {material.fileSize && (
                                <span>Size: {formatFileSize(material.fileSize)}</span>
                              )}
                            </div>
                            <div className="material-actions">
                              {material.fileUrl && (
                                <a 
                                  href={material.fileUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="view-content-btn"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  View Content
                                </a>
                              )}
                              <button
                                className="edit-btn small"
                                onClick={() => {
                                  setEditingMaterial(material);
                                  setEditingMaterialId(material.id);
                                  setActiveTab('materials');
                                }}
                                title="Edit Material"
                              >
                                ✎
                              </button>
                              <button
                                className="delete-btn small"
                                onClick={() => handleDeleteMaterial(material.id, course.id)}
                                title="Delete Material"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>

                    <div className="card-stats">
                      <span>{getCourseLessons(course.id).length} lessons</span>
                      <span>{materials.filter(m => m.courseId === course.id).length} materials</span>
                      <span>Created: {new Date(course.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

     
      </main>
    </div>
  );
};

export default CreateCourse; 
