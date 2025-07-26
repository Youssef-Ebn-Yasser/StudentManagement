import React, { useState } from 'react';

const studentsData = [
    {
        id: 1,
        enrollmentNumber: '2147483647',
        studentName: 'Ahmed Helmy AbdElSadek',
        seatingNumber: '1001',
        nationalId: '12345678901234',
        attendanceStatus: 'present',
        note: ''
    },
    {
        id: 2,
        enrollmentNumber: '311686097',
        studentName: 'Mahmoud Mohamed Kamel',
        seatingNumber: '1002',
        nationalId: '98765432109876',
        attendanceStatus: 'absent',
        note: ''
    },
    {
        id: 3,
        enrollmentNumber: '311673123',
        studentName: 'Hossam Hatem Gaber',
        seatingNumber: '1003',
        nationalId: '11223344556677',
        attendanceStatus: 'excused',
        note: ''
    },
    {
        id: 4,
        enrollmentNumber: '311680934',
        studentName: 'Ahmed Elsayed Ahmed',
        seatingNumber: '1004',
        nationalId: '55443322110099',
        attendanceStatus: 'half_day',
        note: ''
    },
    {
        id: 5,
        enrollmentNumber: '400012345',
        studentName: 'Fatima Zahra',
        seatingNumber: '1005',
        nationalId: '67890123456789',
        attendanceStatus: 'present',
        note: ''
    }
];

const StudentAttendanceTable = () => {
    const [students, setStudents] = useState(studentsData);

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

    const handleSaveAttendance = () => {
        // In a real application, you would send the 'students' data to your backend API here.
        // For this static page, we'll just log it and show a confirmation.
        console.log("Saving attendance:", students);
        alert('Attendance saved successfully!'); // Using alert for demonstration as per original code, but a custom modal is recommended for production.
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
                <div className="p-6 sm:p-8 lg:p-10">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-10">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-0 leading-tight">
                            Student Attendance
                        </h1>
                        {/* Removed "Set Holiday" button */}
                    </div>

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
                                    {/* Removed Email column header */}
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
                                        {/* Removed Email column data */}
                                        <td className="px-4 py-4 text-sm text-gray-800">
                                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                                <label className="inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded-full transition duration-150 ease-in-out"
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
                                                        className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded-full transition duration-150 ease-in-out"
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
                                                        className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded-full transition duration-150 ease-in-out"
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
                                                        className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded-full transition duration-150 ease-in-out"
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

                    {/* New Save Attendance Button */}
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={handleSaveAttendance}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-75"
                        >
                            Save Attendance
                        </button>
                    </div>
                </div>
            </div>
            {/* Custom scrollbar style for better appearance */}
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
