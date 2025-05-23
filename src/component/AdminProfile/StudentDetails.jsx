import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { allStudent } from '@/Redux/features/allStudents/allStudents'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast'
import Loader from '../Loader/Loader'
import studentImg from '../../assets/student.png'



function StudentDetails() {

    let {id}= useParams()
    let dispatch= useDispatch()
    const [enrolledCourse, setEnrolledCourse]= useState({})

    const[details, setDetails]= useState(null)
    let [isloading, setLoading]= useState(true)
    let [error, setError]= useState()
    const {students,loading}= useSelector((state)=>state.allStudents)
    const [studentAssignments, setStudentAssignments] = useState({});


    function getStudentDetails(){
        axios.get(`https://e-learn-v1.runasp.net/api/Student/GetById/GetById/${id}`)
        .then((response)=>{
            console.log(response.data);
            setDetails(response.data)
            setLoading(false)
        }).catch((error)=>{
            console.log(error);
            setError(error)
            setLoading(false)
        })
    }

    async function handleRemovestudent(id) {
        axios.delete(`https://e-learn-v1.runasp.net/api/Student/Delete/Delete/${id}`)
        .then((response)=>{
            toast.success('Student Deleted')
            console.log("Student deleted");
            dispatch(allStudent())
        }).catch((error)=>{
            console.log(error||'invalid id');
            toast.error('Invalid Id')
            
        })  
    }

    async function getStudentAssignInCourse(id, courseId){
        axios.get(`https://e-learn-v1.runasp.net/api/Assignment/GetStudentAssignmentInCourse`,{
            params:{
                id,
                courseId
            }
        }).then((response)=>{
            console.log(`Assignments for student ${id} in course ${courseId}:`, response.data);
            setStudentAssignments(prev => ({
                ...prev,
                [`${id}-${courseId}`]: response.data.data
            }));
        }).catch((error)=>{
            console.error(`Failed to fetch assignments for course ${courseId}`, error);

        })
    }

    async function handleEnrolledCourse(id){
        axios.get('https://e-learn-v1.runasp.net/api/Student/GetAllEnrolledStudentCourses/GetAllEnrolledStudentCourses',{
            params: { studentId: id }
        }).then(response => {
            console.log(`Courses for student ${id}:`, response.data);
            setEnrolledCourse(prev => ({
                ...prev,
                [id]: response.data.data
              }));
              response.data.data.forEach(course => {
                getStudentAssignInCourse(id, course.id);
              });
          })
          .catch(error => {
            console.error('Error:', error);
          });
    }


    useEffect(() => {
        getStudentDetails();
        handleEnrolledCourse(id);
        // dispatch(allStudent()) // Only needed if you use `students` from Redux here
      }, [id]);
      
    return <>
    {isloading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Loader />
        </div>
    ) : (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            {details && details.data ? (
                <div className="bg-white shadow-2xl rounded-xl p-6 sm:p-8 w-full max-w-md transform transition-all hover:scale-105 duration-300 ease-in-out">
                    {/* Image at the top-middle */}
                    <div className="flex justify-center mb-6">
                        <img
                            src={details.data.imagePath || studentImg} // Use actual imagePath or fallback
                            alt={details.data.name || 'Student'}      // Use student's name for alt text
                            className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-full border-4 border-violet-400 shadow-lg"
                        />
                    </div>

                    {/* Student Information */}
                    <div className="text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">{details.data.name}</h2>
                        <p className="text-sm text-gray-500 mb-2">ID: {details.data.id}</p>
                        <p className="text-md text-violet-600 hover:text-violet-700 hover:underline mb-6">
                            <a href={`mailto:${details.data.email}`} target='_blank' rel="noreferrer">
                                {details.data.email}
                            </a>
                        </p>
                    </div>

                    {/* Enrolled Courses */}
                    <div>
                        <h3 className='text-lg sm:text-xl font-semibold text-gray-700 mb-4 text-center border-t border-gray-200 pt-6 mt-6'>Enrolled Courses:</h3>
                        {enrolledCourse[id] && Array.isArray(enrolledCourse[id]) ? (
                            enrolledCourse[id].length > 0 ? (
                                <ul className="list-none space-y-3">
                                    {enrolledCourse[id].map(course => (
                                        <li key={course.id} className="flex items-center p-3 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out">
                                            <i className="fas fa-book-open text-violet-500 mr-3 text-xl"></i> {/* Using a different icon */}
                                            <span className="font-medium text-gray-700">{course.title}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-center py-3">This student is not enrolled in any courses.</p>
                            )
                        ) : (
                            // This state covers when enrolledCourse[id] is undefined (still loading) or not an array
                            <p className="text-gray-500 text-center py-3">Loading enrolled courses...</p>
                        )}
                    </div>
                    <div>
                    <h3 className='text-lg sm:text-xl font-semibold text-gray-700 mb-4 text-center border-t border-gray-200 pt-6 mt-6'>Assignment In Course:</h3>
                    {Object.entries(studentAssignments).filter(([key]) => key.startsWith(`${id}-`)).length > 0 ? (
                                    Object.entries(studentAssignments)
                                        .filter(([key]) => key.startsWith(`${id}-`))
                                        .map(([key, assigns]) =>
                                            assigns.map(assign => (
                                                <li key={assign.id} className="flex items-center p-3 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out">
                                                    <i className="fas fa-book-open text-violet-500 mr-3 text-xl"></i>
                                                    <span className="font-medium text-gray-700">{assign.title}</span>
                                                </li>
                                            ))
                                        )
                                ) : (
                                    <p className="text-gray-500 text-center py-3">No assignments found for this student.</p>
                                )}
                    </div>
                </div>
            ) : (
                // Fallback UI when details or details.data is not available after loading
                <div className="text-center text-gray-700 p-10 bg-white shadow-xl rounded-lg max-w-md">
                    {error ? (
                        <>
                            <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
                            <p className="text-red-600 text-xl font-semibold">Failed to Load Student Details</p>
                            <p className="text-red-500 mt-2">{error.response?.data?.message || error.message || 'An unknown error occurred.'}</p>
                        </>
                    ) : (
                        <>
                            <i className="fas fa-info-circle text-blue-500 text-4xl mb-4"></i>
                            <p className="text-xl font-semibold">Student Data Not Available</p>
                            <p className="text-gray-600 mt-2">The requested student details could not be found.</p>
                        </>
                    )}
                </div>
            )}
        </div>
    )}
    </>
}

export default StudentDetails
