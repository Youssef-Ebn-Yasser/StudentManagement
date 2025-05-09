import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { allCourses } from '@/Redux/features/allCourses/allCourses';
import { allLessons } from '@/Redux/features/allLessons/allLessons';
import Loader from '../Loader/Loader';
import axios from 'axios';
import { API_URL } from '@/config';
import { FaBook, FaChalkboardTeacher, FaUsers, FaFileAlt } from 'react-icons/fa';

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const { courses, loading: coursesLoading } = useSelector((state) => state.allCourses);
  const { lessons, loading: lessonsLoading } = useSelector((state) => state.allLessons);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalMaterials: 0,
    averageRating: 0
  });

  useEffect(() => {
    dispatch(allCourses());
    dispatch(allLessons());
    fetchTeacherStats();
  }, [dispatch]);

  const fetchTeacherStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/Teacher/Stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching teacher stats:', error);
    }
  };

  if (coursesLoading || lessonsLoading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaBook className="text-2xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Total Courses</h3>
              <p className="text-2xl font-semibold">{courses?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaChalkboardTeacher className="text-2xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Total Lessons</h3>
              <p className="text-2xl font-semibold">{lessons?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FaUsers className="text-2xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Total Students</h3>
              <p className="text-2xl font-semibold">{stats.totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FaFileAlt className="text-2xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Total Materials</h3>
              <p className="text-2xl font-semibold">{stats.totalMaterials}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Courses */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Courses</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses?.slice(0, 5).map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{course.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{course.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{course.studentsCount || 0}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{course.rating || 'N/A'}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Lessons */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Lessons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons?.slice(0, 6).map((lesson) => (
            <div key={lesson.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-medium text-lg mb-2">{lesson.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{lesson.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Duration: {lesson.duration} min</span>
                <span>Materials: {lesson.materialsCount || 0}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard; 