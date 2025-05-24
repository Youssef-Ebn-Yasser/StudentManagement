import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaBook, FaSpinner, FaExclamationTriangle, FaSearch, FaArrowLeft } from 'react-icons/fa';
import { courseService } from '../../services/courseService';
import { useNavigate } from 'react-router-dom';

const StudentAssignments = () => {
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [selectedLessonId, setSelectedLessonId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorType, setErrorType] = useState(null);

    useEffect(() => {
        fetchLessons();
    }, []);

    useEffect(() => {
        if (selectedLessonId) {
            fetchAssignments();
        } else {
            setAssignments([]);
        }
    }, [selectedLessonId]);

    const getErrorMessage = (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 404:
                    return "The requested resource was not found. Please check if the lesson exists.";
                case 401:
                    return "You are not authorized to view this content. Please log in again.";
                case 403:
                    return "You don't have permission to access this content.";
                case 500:
                    return "An internal server error occurred. Please try again later.";
                default:
                    return error.response.data?.message || "An error occurred while fetching data.";
            }
        }
        return error.message || "An unexpected error occurred.";
    };

    const fetchLessons = async () => {
        try {
            setError(null);
            setErrorType(null);
            const response = await courseService.getAllLessons();
            if (Array.isArray(response)) {
                setLessons(response);
            } else if (response && Array.isArray(response.data)) {
                setLessons(response.data);
            } else {
                setLessons([]);
                setError('Invalid lessons data format received');
                setErrorType('data');
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching lessons:', err);
            setError(getErrorMessage(err));
            setErrorType(err.response?.status === 404 ? 'notFound' : 'error');
            setLessons([]);
            setLoading(false);
        }
    };

    const fetchAssignments = async () => {
        try {
            setError(null);
            setErrorType(null);
            setLoading(true);
            const response = await courseService.getStudentAssignments(selectedLessonId);
            if (response && response.succeeded) {
                setAssignments(Array.isArray(response.data) ? response.data : [response.data]);
            } else {
                setAssignments([]);
                setError('No assignments found for this lesson');
                setErrorType('empty');
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching assignments:', err);
            setError(getErrorMessage(err));
            setErrorType(err.response?.status === 404 ? 'notFound' : 'error');
            setAssignments([]);
            setLoading(false);
        }
    };

    const handleViewAssignment = (path) => {
        window.open(path, '_blank');
    };

    const renderError = () => {
        switch (errorType) {
            case 'notFound':
                return (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md shadow-sm">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <FaSearch className="h-5 w-5 text-yellow-400" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800">Resource Not Found</h3>
                                <p className="text-sm text-yellow-700 mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                );
            case 'empty':
                return (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md shadow-sm">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <FaBook className="h-5 w-5 text-blue-400" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">No Assignments</h3>
                                <p className="text-sm text-blue-700 mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                );
            case 'data':
                return (
                    <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-md shadow-sm">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <FaExclamationTriangle className="h-5 w-5 text-orange-400" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-orange-800">Data Format Error</h3>
                                <p className="text-sm text-orange-700 mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <FaExclamationTriangle className="h-5 w-5 text-red-500" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Error</h3>
                                <p className="text-sm text-red-700 mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    if (loading && !selectedLessonId) {
        return (
            <div className="flex justify-center items-center h-[200px]">
                <FaSpinner className="animate-spin text-4xl text-indigo-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4">
                <button
                    onClick={() => navigate('/teacher/profile')}
                    className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 flex items-center"
                >
                    <FaArrowLeft className="mr-2" />
                    Back to Profile
                </button>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xl font-semibold text-white flex items-center">
                                <FaBook className="mr-2" />
                                Student Assignments
                            </h4>
                        </div>
                    </div>
                    <div className="p-6">
                        {renderError()}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 pt-10">
            <button
                onClick={() => navigate('/teacher/profile')}
                className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 flex items-center"
            >
                <FaArrowLeft className="mr-2" />
                Back to Profile
            </button>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-xl font-semibold text-white flex items-center">
                            <FaBook className="mr-2" />
                            Student Assignments
                        </h4>
                    </div>
                </div>
                <div className="p-6">
                    <div className="mb-6">
                        <label htmlFor="lessonSelect" className="block text-sm font-medium text-gray-700 mb-2">
                            Select Lesson
                        </label>
                        <select
                            id="lessonSelect"
                            value={selectedLessonId}
                            onChange={(e) => setSelectedLessonId(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                        >
                            <option value="">Choose a lesson</option>
                            {Array.isArray(lessons) && lessons.map((lesson) => (
                                <option key={lesson.id} value={lesson.id}>
                                    {lesson.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedLessonId && (
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Student Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Lesson Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            View Assignment
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-4 text-center">
                                                <div className="flex justify-center">
                                                    <FaSpinner className="animate-spin text-2xl text-indigo-600" />
                                                </div>
                                            </td>
                                        </tr>
                                    ) : assignments.length > 0 ? (
                                        assignments.map((assignment, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {assignment.studentName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {assignment.lessonName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <button
                                                        onClick={() => handleViewAssignment(assignment.path)}
                                                        className="inline-flex items-center px-4 py-2 border border-indigo-500 text-indigo-500 rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
                                                    >
                                                        <FaFilePdf className="mr-2" />
                                                        View Assignment
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-8 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-500">
                                                    <FaBook className="text-4xl mb-2 text-gray-400" />
                                                    <p className="text-lg font-medium">No assignments found</p>
                                                    <p className="text-sm text-gray-400">There are no assignments submitted for this lesson yet.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentAssignments; 