import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserGraduate, FaBookOpen } from 'react-icons/fa';

export default function StudentAndCourses() {
  const [loading, setLoading] = useState(true);
  const [studentCourses, setStudentCourses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudentCourses = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('https://e-learn-v1.runasp.net/Course/GetAllStudentAndCourse');
        if (res.data && res.data.succeeded) {
          // Group by studentId
          const grouped = {};
          res.data.data.forEach((item) => {
            if (!grouped[item.studentId]) {
              grouped[item.studentId] = {
                studentId: item.studentId,
                studentName: item.studentName,
                courses: [],
              };
            }
            grouped[item.studentId].courses.push({
              courseId: item.courseId,
              courseTitle: item.courseTitle,
            });
          });
          setStudentCourses(Object.values(grouped));
        } else {
          setError('Failed to fetch data.');
        }
      } catch (err) {
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };
    fetchStudentCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-8 text-center">
          Students & Their Courses
        </h2>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 font-semibold">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {studentCourses.map((student) => (
              <div
                key={student.studentId}
                className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100 hover:shadow-xl transition"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-indigo-100 text-indigo-700 rounded-full p-3">
                    <FaUserGraduate className="text-2xl" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-indigo-700">
                      {student.studentName}
                    </div>
                    <div className="text-gray-500 text-sm">
                      ID: {student.studentId}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-indigo-600 mb-2 flex items-center gap-2">
                    <FaBookOpen /> Courses:
                  </div>
                  <ul className="space-y-2">
                    {student.courses.map((course) => (
                      <li
                        key={course.courseId}
                        className="bg-indigo-50 rounded-lg px-4 py-2 flex items-center gap-2 text-indigo-800 font-medium shadow-sm border border-indigo-100"
                      >
                        <span className="font-semibold">{course.courseTitle}</span>
                        <span className="ml-auto text-xs text-gray-500">ID: {course.courseId}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}