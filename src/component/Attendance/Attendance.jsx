import React, { useState, useEffect } from 'react';
import axiosInstance from '@/services/axiosInstance';

const StudentAttendanceTable = () => {
    const [courseData, setCourseData] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [selectedLessionId, setSelectedLessionId] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [attendanceTaken, setAttendanceTaken] = useState(false);

    useEffect(() => {
        const fetchCourseAndLessonData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axiosInstance.get('/api/Attendance/filter');
                if (response.data.succeeded) {
                    setCourseData(response.data.data);
                } else {
                    setError(response.data.massage || 'An error occurred while fetching courses.');
                }
            } catch (err) {
                console.error("Error fetching courses:", err);
                setError('Could not connect to the server or fetch course data.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourseAndLessonData();
    }, []);

    useEffect(() => {
        if (selectedCourseId && selectedLessionId) {
            const fetchAttendanceData = async () => {
                try {
                    setLoading(true);
                    setError(null);
                    setAttendanceTaken(false);

                    const response = await axiosInstance.get('/api/Attendance/page', {
                        params: {
                            courseId: selectedCourseId,
                            lessionId: selectedLessionId
                        }
                    });

                    if (response.data.succeeded && response.data.data) {
                        const { attendenceDtos } = response.data.data;
                        const isTaken = attendenceDtos.length > 0 ? attendenceDtos[0].isTaken : false;
                        
                        setAttendanceTaken(isTaken);

                        const formattedStudents = attendenceDtos.map(student => ({
                            id: student.id,
                            studentName: student.studentName,
                            nationalId: student.nationalId,
                            enrollmentNumber: student.email,
                            seatingNumber: 'N/A', 
                            attendanceStatus: getAttendanceStatus(student.attendType),
                            note: student.note
                        }));
                        setStudents(formattedStudents);
                    } else {
                        setStudents([]);
                        setError(response.data.massage || 'No attendance data found for this lesson.');
                    }
                } catch (err) {
                    console.error("Error fetching attendance data:", err);
                    setError('Could not fetch attendance data.');
                } finally {
                    setLoading(false);
                }
            };

            fetchAttendanceData();
        } else {
            setStudents([]);
            setAttendanceTaken(false);
        }
    }, [selectedCourseId, selectedLessionId]);

    const getAttendanceStatus = (attendType) => {
        switch (attendType) {
            case 1:
                return 'present';
            case 2:
                return 'absent';
            case 4:
                return 'excused';
            case 3:
                return 'half_day';
            default:
                return 'present';
        }
    };

    const getAttendType = (status) => {
        switch (status) {
            case 'present':
                return 1;
            case 'absent':
                return 2;
            case 'excused':
                return 4;
            case 'half_day':
                return 3;
            default:
                return 1;
        }
    };

    const handleCourseChange = (e) => {
        const courseId = e.target.value;
        setSelectedCourseId(courseId);
        setSelectedLessionId('');
        setStudents([]);
        setAttendanceTaken(false); 
    };

    const handleLessonChange = (e) => {
        const lessionId = e.target.value;
        setSelectedLessionId(lessionId);
    };

    const handleAttendanceChange = (studentId, status) => {
        setStudents(prevStudents =>
            prevStudents.map(student =>
                student.id === studentId ? { ...student, attendanceStatus: status } : student
            )
        );
    };

    const handleNoteChange = (studentId, note) => {
        setStudents(prevStudents =>
            prevStudents.map(student =>
                student.id === studentId ? { ...student, note: note } : student
            )
        );
    };

    const handleSaveAttendance = async () => {
        try {
            setLoading(true);
            setError(null);
            setAttendanceTaken(false);

            const studentsAttendanceDto = students.map(student => ({
                studentId: student.id,
                attendType: getAttendType(student.attendanceStatus),
                note: student.note
            }));

            const requestBody = {
                lessionId: parseInt(selectedLessionId),
                courseId: parseInt(selectedCourseId),
                studentsAttendanceDto: studentsAttendanceDto
            };

            const response = await axiosInstance.post('/api/Attendance/page', requestBody);

            if (response.data.succeeded) {
                setAttendanceTaken(true);
                alert('Attendance saved successfully!');
            } else {
                setError(response.data.massage || 'An error occurred while saving attendance.');
            }

        } catch (err) {
            console.error("Error saving attendance:", err);
            setError('Failed to save attendance. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const lessons = selectedCourseId ?
        (courseData.find(course => course.courseId === parseInt(selectedCourseId))?.showLessionInfos || []) : [];

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
                <div className="p-6 sm:p-8 lg:p-10">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-10">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-0 leading-tight">
                            Student Attendance
                        </h1>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <div className="flex-1">
                            <label htmlFor="course-select" className="block text-sm font-medium text-gray-700">
                                Select a Course
                            </label>
                            <select
                                id="course-select"
                                value={selectedCourseId}
                                onChange={handleCourseChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            >
                                <option value="" disabled>Choose a course...</option>
                                {courseData.map(course => (
                                    <option key={course.courseId} value={course.courseId}>
                                        {course.courseName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label htmlFor="lesson-select" className="block text-sm font-medium text-gray-700">
                                Select a Lesson
                            </label>
                            <select
                                id="lesson-select"
                                value={selectedLessionId}
                                onChange={handleLessonChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                disabled={!selectedCourseId}
                            >
                                <option value="" disabled>Choose a lesson...</option>
                                {lessons.map(lesson => (
                                    <option key={lesson.lessionId} value={lesson.lessionId}>
                                        {lesson.lessionName || `Lesson ${lesson.lessionId}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {loading && <div className="text-center text-lg text-gray-600">Loading attendance data...</div>}
                    {error && <div className="text-center text-red-600 font-bold">{error}</div>}
                    {!loading && !error && selectedLessionId && attendanceTaken && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Success!</strong>
                            <span className="block sm:inline ml-2">Attendance has already been taken for this lesson.</span>
                        </div>
                    )}
                    {!loading && !error && selectedLessionId && students.length > 0 && (
                        <>
                            <div className="overflow-x-auto custom-scrollbar rounded-lg border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider rounded-tl-lg">
                                                Enrollment No.
                                            </th>
                                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Student Name
                                            </th>
                                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Seating No.
                                            </th>
                                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                National ID
                                            </th>
                                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Attendance
                                            </th>
                                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider rounded-tr-lg">
                                                Note
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {students.map((student, index) => (
                                            <tr key={student.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors duration-200 ease-in-out`}>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {student.enrollmentNumber}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                                                    {student.studentName}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                                                    {student.seatingNumber}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                                                    {student.nationalId}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-800">
                                                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                                                        <label className="inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-full transition duration-150 ease-in-out"
                                                                name={`attendance-${student.id}`}
                                                                value="present"
                                                                checked={student.attendanceStatus === 'present'}
                                                                onChange={() => handleAttendanceChange(student.id, 'present')}
                                                            />
                                                            <span className="ml-2 text-gray-700 text-sm">Present</span>
                                                        </label>
                                                        <label className="inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-full transition duration-150 ease-in-out"
                                                                name={`attendance-${student.id}`}
                                                                value="absent"
                                                                checked={student.attendanceStatus === 'absent'}
                                                                onChange={() => handleAttendanceChange(student.id, 'absent')}
                                                            />
                                                            <span className="ml-2 text-gray-700 text-sm">Absent</span>
                                                        </label>
                                                        <label className="inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-full transition duration-150 ease-in-out"
                                                                name={`attendance-${student.id}`}
                                                                value="excused"
                                                                checked={student.attendanceStatus === 'excused'}
                                                                onChange={() => handleAttendanceChange(student.id, 'excused')}
                                                            />
                                                            <span className="ml-2 text-gray-700 text-sm">Excused</span>
                                                        </label>
                                                        <label className="inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-full transition duration-150 ease-in-out"
                                                                name={`attendance-${student.id}`}
                                                                value="half_day"
                                                                checked={student.attendanceStatus === 'half_day'}
                                                                onChange={() => handleAttendanceChange(student.id, 'half_day')}
                                                            />
                                                            <span className="ml-2 text-gray-700 text-sm">Half Day</span>
                                                        </label>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-800">
                                                    <textarea
                                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y min-h-[80px] transition duration-150 ease-in-out"
                                                        placeholder="Add note here..."
                                                        value={student.note}
                                                        onChange={(e) => handleNoteChange(student.id, e.target.value)}
                                                    ></textarea>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-8 flex justify-center">
                                <button
                                    onClick={handleSaveAttendance}
                                    disabled={loading}
                                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-75 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Saving...' : 'Save Attendance'}
                                </button>
                            </div>
                        </>
                    )}
                    {!selectedLessionId && !loading && !error && (
                        <div className="text-center text-lg text-gray-500 p-8 border border-gray-200 rounded-lg">
                            Please select a course and a lesson to view attendance.
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #a0a0a0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #707070;
                }
            `}</style>
        </div>
    );
};

export default StudentAttendanceTable;