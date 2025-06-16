import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function LessonDetails() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState({});
  const [submittedAssignments, setSubmittedAssignments] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Comments
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [commentSuccess, setCommentSuccess] = useState('');

  // Quiz
  const [quiz, setQuiz] = useState(null);
  const [quizLoading, setQuizLoading] = useState(true);

  const studentId = localStorage.getItem('guestId');

  // Quiz submission state (persisted)
  const quizSubmissionKey = `quiz_submitted_${studentId}_${lessonId}`;
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(
    !!localStorage.getItem(quizSubmissionKey)
  );

  // Save courseId to localStorage for consistency (optional)
  useEffect(() => {
    if (courseId) {
      localStorage.setItem('currentCourseId', courseId);
    }
  }, [courseId]);

  // Load submitted assignments from localStorage on mount
  useEffect(() => {
    if (studentId && lessonId) {
      const key = `submittedAssignments_${studentId}_${lessonId}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        setSubmittedAssignments(JSON.parse(saved));
      }
    }
  }, [studentId, lessonId]);

  // Save submitted assignments to localStorage whenever they change
  useEffect(() => {
    if (studentId && lessonId) {
      const key = `submittedAssignments_${studentId}_${lessonId}`;
      localStorage.setItem(key, JSON.stringify(submittedAssignments));
    }
  }, [submittedAssignments, studentId, lessonId]);

  // Fetch materials and assignments for this lesson
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const res = await axios.get(
          `https://e-learn-v1.runasp.net/api/Material/GetMaterialsByLessonId/GetMaterialsByLessonId/${lessonId}`
        );
        if (res.data.succeeded && Array.isArray(res.data.data)) {
          setMaterials(res.data.data.filter((mat) => mat.type === 'Normal'));
          setAssignments(res.data.data.filter((mat) => mat.type === 'Assignment'));
        } else {
          setMaterials([]);
          setAssignments([]);
        }
      } catch (err) {
        setErrorMsg('Failed to load lesson data.');
        setMaterials([]);
        setAssignments([]);
      }
      setLoading(false);
    };
    fetchData();
  }, [lessonId]);

  // Fetch comments for this lesson
  const fetchComments = async () => {
    setCommentLoading(true);
    setCommentError('');
    try {
      const res = await axios.get(
        `https://e-learn-v1.runasp.net/api/Comment/lesson/${lessonId}`
      );
      if (res.data.succeeded && Array.isArray(res.data.data)) {
        setComments(res.data.data);
      } else {
        setComments([]);
      }
    } catch (err) {
      setCommentError('Failed to load comments.');
      setComments([]);
    }
    setCommentLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, [lessonId]);

  // Fetch quiz for this lesson
  useEffect(() => {
    const fetchQuiz = async () => {
      setQuizLoading(true);
      try {
        const res = await axios.get(
          `https://e-learn-v1.runasp.net/api/Quize/GetQuizeByLessoinId?lessonId=${lessonId}`
        );
        if (Array.isArray(res.data) && res.data.length > 0) {
          setQuiz(res.data[0]);
        } else {
          setQuiz(null);
        }
      } catch (err) {
        setQuiz(null);
      }
      setQuizLoading(false);
    };
    fetchQuiz();
  }, [lessonId]);

  // Watch for quiz submission in localStorage (in case it changes after quiz page submit)
  useEffect(() => {
    const checkQuizSubmission = () => {
      setIsQuizSubmitted(!!localStorage.getItem(quizSubmissionKey));
    };
    window.addEventListener('storage', checkQuizSubmission);
    // Also check on mount
    checkQuizSubmission();
    return () => window.removeEventListener('storage', checkQuizSubmission);
  }, [quizSubmissionKey]);

  // Handle file input change for each assignment
  const handleFileChange = (assignmentId, file) => {
    setSelectedFile((prev) => ({
      ...prev,
      [assignmentId]: file,
    }));
  };

  // Handle upload for a specific assignment
  const handleUpload = async (assignmentId) => {
    setUploadingId(assignmentId);
    setSuccessMsg('');
    setErrorMsg('');
    if (!studentId) {
      setErrorMsg('You must be logged in as a student to upload.');
      setUploadingId(null);
      return;
    }
    const file = selectedFile[assignmentId];
    if (!file) {
      setErrorMsg('Please select a file to upload.');
      setUploadingId(null);
      return;
    }
    const formData = new FormData();
    formData.append('File', file);
    formData.append('StudentId', studentId);
    formData.append('LessonId', lessonId);

    try {
      const res = await axios.post(
        'https://e-learn-v1.runasp.net/api/Assignment/upload/assignment',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      if (res.data.succeeded) {
        setSuccessMsg('Assignment uploaded successfully!');
        setSubmittedAssignments((prev) => ({
          ...prev,
          [assignmentId]: true,
        }));
        setSelectedFile((prev) => ({
          ...prev,
          [assignmentId]: null,
        }));
      } else {
        setErrorMsg(res.data.massage || 'Upload failed.');
      }
    } catch (err) {
      setErrorMsg('Upload failed. Please try again.');
    }
    setUploadingId(null);
  };

  // Handle comment submit
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError('');
    setCommentSuccess('');
    if (!studentId) {
      setCommentError('You must be logged in as a student to comment.');
      return;
    }
    if (!commentContent.trim()) {
      setCommentError('Comment cannot be empty.');
      return;
    }
    if (!courseId) {
      setCommentError('Course ID is missing.');
      return;
    }
    try {
      setCommentLoading(true);
      const res = await axios.post(
        'https://e-learn-v1.runasp.net/api/Comment/create',
        {
          content: commentContent,
          lessonId: Number(lessonId),
          studentId: Number(studentId),
          courseId: Number(courseId),
        }
      );
      if (res.data.succeeded) {
        setCommentSuccess('Comment added successfully!');
        setCommentContent('');
        fetchComments();
      } else {
        setCommentError(res.data.massage || 'Failed to add comment.');
      }
    } catch (err) {
      setCommentError('Failed to add comment.');
    }
    setCommentLoading(false);
  };

  // Go to quiz page
  const handleStartQuiz = () => {
    if (lessonId) {
      navigate(`/studentdashboard/quiz/${lessonId}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-indigo-700 text-center">Lesson Materials & Assignments</h1>
      {loading ? (
        <div className="text-center text-gray-500">Loading lesson data...</div>
      ) : (
        <div className="space-y-10">
          {/* Materials */}
          <section className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600 flex items-center">
              <i className="fa fa-file-alt mr-2" /> Lesson Materials
            </h2>
            {materials.length === 0 ? (
              <div className="text-gray-500">No materials for this lesson.</div>
            ) : (
              <div className="space-y-4">
                {materials.map((material) => (
                  <div key={material.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-center mb-1">
                      <span className="font-semibold text-lg">{material.title}</span>
                      <span className="ml-2 px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                        Material
                      </span>
                    </div>
                    <div className="mb-2 text-gray-700">{material.content}</div>
                    {material.data && material.data.startsWith('http') && (
                      <a
                        href={material.data}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-indigo-600 hover:underline text-sm"
                      >
                        View/Download Material
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Assignments */}
          <section className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600 flex items-center">
              <i className="fa fa-tasks mr-2" /> Assignments
            </h2>
            {assignments.length === 0 ? (
              <div className="text-gray-500">No assignments for this lesson.</div>
            ) : (
              <div className="space-y-6">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-center mb-1">
                      <span className="font-semibold text-lg">{assignment.title}</span>
                      <span className="ml-2 px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                        Assignment
                      </span>
                    </div>
                    <div className="mb-2 text-gray-700">{assignment.content}</div>
                    {assignment.data && assignment.data.startsWith('http') && (
                      <a
                        href={assignment.data}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mb-2 text-indigo-600 hover:underline text-sm"
                      >
                        View/Download Assignment
                      </a>
                    )}
                    <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
                      {submittedAssignments[assignment.id] ? (
                        <span className="text-green-600 font-semibold">Submitted</span>
                      ) : (
                        <>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.txt,.zip,.rar"
                            onChange={(e) => handleFileChange(assignment.id, e.target.files[0])}
                            className="border rounded px-2 py-1"
                            disabled={uploadingId === assignment.id}
                          />
                          <button
                            onClick={() => handleUpload(assignment.id)}
                            disabled={uploadingId === assignment.id}
                            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
                          >
                            {uploadingId === assignment.id ? 'Uploading...' : 'Submit'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Quiz Section */}
          <section className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600 flex items-center">
              <i className="fa fa-question-circle mr-2" /> Quiz
            </h2>
            <div className="flex gap-4 mt-4 items-start justify-start">
            <button
              onClick={() => navigate(`/studentdashboard/lesson/${lessonId}/quiz`)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Take Quiz
            </button>
          </div>
            {quizLoading ? (
              <div className="text-gray-500">Loading quiz...</div>
            ) : quiz ? (
              <div>
                <div className="mb-2">
                  <span className="font-semibold">Title:</span> {quiz.title}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Description:</span> {quiz.description}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Duration:</span> {quiz.durationMinutes} minutes
                </div>
                {isQuizSubmitted ? (
                  <span className="text-green-600 font-semibold">Submitted</span>
                ) : (
                  <button
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition mt-2"
                    onClick={handleStartQuiz}
                  >
                    Start Quiz
                  </button>
                )}
              </div>
            ) : (
              <div className="text-gray-500"></div>
            )}
          </section>

          {/* Comments Section */}
          <section className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600 flex items-center">
              <i className="fa fa-comments mr-2" /> Comments
            </h2>
            {/* Add Comment */}
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <textarea
                className="w-full border rounded-md p-3 text-gray-700 focus:ring-2 focus:ring-indigo-200 focus:outline-none resize-none"
                rows={3}
                placeholder="Add a comment about this lesson..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                disabled={commentLoading}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
                  disabled={commentLoading}
                >
                  {commentLoading ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
              {commentError && (
                <div className="mt-2 text-red-600 font-semibold text-sm">{commentError}</div>
              )}
              {commentSuccess && (
                <div className="mt-2 text-green-600 font-semibold text-sm">{commentSuccess}</div>
              )}
            </form>
            {/* All Comments */}
            <div>
              {commentLoading && comments.length === 0 ? (
                <div className="text-gray-500">Loading comments...</div>
              ) : comments.length === 0 ? (
                <div className="text-gray-500">No comments yet for this lesson.</div>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                      <div className="flex items-center mb-1">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-base mr-3">
                          {comment.studentName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-800">{comment.studentName}</span>
                      </div>
                      <div className="ml-11 text-gray-700">{comment.content}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

        </div>
      )}
      {/* Global Success/Error */}
      {successMsg && (
        <div className="mt-6 text-green-600 font-semibold text-center">{successMsg}</div>
      )}
      {errorMsg && (
        <div className="mt-6 text-red-600 font-semibold text-center">{errorMsg}</div>
      )}
    </div>
  );
}