import React, { useState } from 'react';
import axios from 'axios';

export default function EnrollStudentCourse() {
  const [studentId, setStudentId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await axios.post(
        'https://e-learn-v1.runasp.net/api/Student/EnrollToCourse/EnrollToCourse',
        {
          studentId: Number(studentId),
          courseId: Number(courseId),
        }
      );
      if (res.data && res.data.succeeded) {
        setSuccessMsg(res.data.data || 'Enroll Success');
        setStudentId('');
        setCourseId('');
      } else {
        setErrorMsg(res.data.massage || 'Failed to enroll student.');
      }
    } catch (err) {
      setErrorMsg('Failed to enroll student. Please check the IDs and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
          Enroll Student to Course
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="studentId">
              Student ID
            </label>
            <input
              id="studentId"
              type="number"
              min="1"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
              placeholder="Enter Student ID"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="courseId">
              Course ID
            </label>
            <input
              id="courseId"
              type="number"
              min="1"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              required
              placeholder="Enter Course ID"
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Enrolling...' : 'Enroll Student'}
          </button>
        </form>
        {successMsg && (
          <div className="mt-4 text-green-600 font-semibold text-center">{successMsg}</div>
        )}
        {errorMsg && (
          <div className="mt-4 text-red-600 font-semibold text-center">{errorMsg}</div>
        )}
      </div>
    </div>
  );
}