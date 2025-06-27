import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { allStudent } from '@/Redux/features/allStudents/allStudents'
import stuImg from '../../assets/audience.png'
import Loader from '../Loader/Loader'
import studentImg from '../../assets/student.png'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'



function Students() {

    const { t } = useTranslation();
    let dispatch= useDispatch()
    const [enrolledCourse, setEnrolledCourse]= useState({})
    const {students,loading}= useSelector((state)=>state.allStudents)
    let [searchItem, setSearchItem]=useState('')
    const [searchType, setSearchType] = useState('name');
    
    const filteredstudent = students && students.length > 0
      ? students.filter ((item)=>{
        const value = searchItem.toLowerCase()
        if(searchType === 'name'){
            return item.name?.toLowerCase().includes(value);
        }else if (searchType === 'id'){
            return item.id?.toString().includes(value);
        }else if (searchType === 'email'){
            return item.email?.toLowerCase().includes(value);
        }
        return false
      }):[];

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

    async function handleEnrolledCourse(studentId){
        axios.get('https://e-learn-v1.runasp.net/api/Student/GetAllEnrolledStudentCourses/GetAllEnrolledStudentCourses',{
            params: { studentId }
        }).then(response => {
            console.log(`Courses for student ${studentId}:`, response.data);
            setEnrolledCourse(prev => ({
                ...prev,
                [studentId]: response.data.data
              }));
          })
          .catch(error => {
            console.error('Error:', error);
          });
    }

    useEffect(()=>{
        dispatch(allStudent())
    },[])
    
    useEffect(() => {
        if (students && students.length > 0) {
          students.forEach((student) => {
            handleEnrolledCourse(student.id);
          });
        }
      }, [students]);

    return <>
        <div className='bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8'>
            <div className="container mx-auto">
                <h1 className='text-3xl font-bold text-gray-800 mb-8 flex items-center'>
                    <img src={stuImg} alt="Students Icon" className='w-8 h-8 mr-3' />
                    {t("our-stu")}
                </h1>

                {/* Search Section */}
                <div className="mb-8 p-4 bg-white rounded-lg shadow-md flex flex-col sm:flex-row items-center gap-4">
                    <input 
                        className='flex-grow form-input rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 p-3 w-full sm:w-auto'
                        type="text" 
                        placeholder={`${t("search-students-by")} ${searchType}...`} 
                        onChange={(e) => setSearchItem(e.target.value)}
                    />
                    <select
                        className="form-select rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 py-3 px-4 w-full sm:w-auto"
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}>
                        <option value={t("Name")}>{t("Name")}</option>
                        <option value={t("ID")}>{t("ID")}</option>
                        <option value={t("Email")}>{t("Email")}</option>
                    </select>
                </div>

                {/* Student List / Search Results */}
                {loading && (!searchItem || searchItem.length === 0) ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader />
                    </div>
                ) : (
                    <>
                        {searchItem && searchItem.length > 0 && (
                            <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
                                <i className="fa-solid fa-magnifying-glass px-2 text-violet-500 text-lg"></i>
                                {t("search-results")}
                            </h2>
                        )}

                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                            {(searchItem && searchItem.length > 0 ? filteredstudent : students).length > 0 ? (
                                (searchItem && searchItem.length > 0 ? filteredstudent : students).map((student) => (
                                    <div 
                                        key={student.id} 
                                        className="relative bg-white shadow-xl rounded-xl p-4 sm:p-5 text-center flex flex-col items-center transform transition-all duration-300 ease-in-out hover:scale-105"
                                    >
                                        <Link to={`/admin/studentDetails/${student.id}`} className="w-full flex flex-col items-center">
                                            <img 
                                                src={student.imagePath || studentImg} 
                                                alt={student.name || 'Student'} 
                                                className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-full border-4 border-violet-200 shadow-md mb-4" 
                                            />
                                            <h2 className="text-lg font-bold text-gray-800 mb-1 truncate w-full" title={student.name}>
                                                {student.name}
                                            </h2>
                                            <p className="text-xs text-gray-500 mb-1">ID: {student.id}</p>
                                            <p className="text-sm text-violet-600 hover:text-violet-700 hover:underline mb-3 truncate w-full" title={student.email}>
                                                <a href={`mailto:${student.email}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                                                    {student.email}
                                                </a>
                                            </p>
                                        </Link>

                                        <div className="w-full mt-2 pt-3 border-t border-gray-200 text-left">
                                            <h4 className="text-xs font-semibold text-gray-600 mb-1">{t("enrolled-courses")}:</h4>
                                            {enrolledCourse[student.id] ? (
                                                enrolledCourse[student.id].length > 0 ? (
                                                    <ul className="text-xs text-gray-500 space-y-0.5 max-h-20 overflow-y-auto">
                                                        {enrolledCourse[student.id].map((course) => (
                                                            <li key={course.id} className='truncate' title={course.title}>
                                                                <i className="fas fa-book-reader text-violet-400 mr-1.5"></i>
                                                                {course.title || `Course ID: ${course.id}`}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-xs text-gray-400">{t("no-courses")}</p>
                                                )
                                            ) : (
                                                <p className="text-xs text-gray-400">{t("loading")}...</p>
                                            )}
                                        </div>
                                        
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent Link navigation
                                                handleRemovestudent(student.id);
                                            }}
                                            title="Delete Student"
                                            className='absolute top-3 right-3 text-red-500 hover:text-red-700 bg-white rounded-full p-2 w-8 h-8 flex items-center justify-center shadow-md hover:bg-red-50 transition-colors duration-200 ease-in-out'
                                        >
                                            <i className="fa-solid fa-trash-alt text-sm"></i>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-10">
                                    {loading && searchItem && searchItem.length > 0 ? (
                                         <Loader />
                                    ) : (
                                        <p className='text-gray-600 text-lg'>
                                            {searchItem && searchItem.length > 0 ? t("no-matching-students") : "No students available."}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    </>
}

export default Students



{/* Previous structure for reference / if needed to revert parts - kept for thought process
    {searchItem && searchItem.length>0? (
        // ... search results rendering ...
    ):(<>
        <div className='grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-5 p-5 text-center mx-auto hover:cursor-pointer transition-all duration-300 ease'>
                        {!loading?
                        (<>
                            {students && students.length > 0 ? (
                                students.map((student) => (
                                    <Link to={`/admin/studentDetails/${student.id}`}>
                                        <div key={student.id} className="relative shadow rounded p-2 bg-white hover:shadow-xl hover:shadow-violet-200 ">
                                            <img src={student.imagePath ||studentImg} alt={student.name} className="w-full h-48 object-fill rounded " />
                                            <h2 className="text-lg font-semibold mt-2">Student Name : {student.name}</h2>
                                            <p className="text-lg text-red-500 font-semibold mt-2">Id : {student.id}</p>
                                        
                                            <div className='text-center'>
                                            {enrolledCourse[student.id] ? (
                                                    enrolledCourse[student.id].length > 0 ? (
                                                        <ul className="text-center list-disc list-inside text-gray-500">
                                                            {enrolledCourse[student.id].map((course) => (
                                                                // Added key and displaying title (assuming it exists)
                                                                <li className='list-none' key={course.id} ><span className='text-black'> Enrolled Courses : </span>{course.title || `Course ID: ${course.id}`}</li>
                                                            ))}
                                                        </ul>
                                                    ) : (<p className="text-xs text-gray-400 text-left ml-1">No Erolled Courses</p>)
                                                ) : (<p className="text-xs text-gray-400 text-left ml-1">Loading courses...</p>)}

                                            </div>
                                            <p className="text-gray-500 hover:text-blue-500 hover:underline transition-all duration-300 ease">
                                                <a href={`mailto:${student.email}`} 
                                                target='_blank' rel="noreferrer">{student.email}</a>
                                            </p>
                                            
                                            <div className='text-red-500 absolute top-5 right-7 bg-white rounded-full p-3 hover:cursor-pointer hover:bg-gray-200 transition-all duration-300 ease'>
                                                <button  onClick={()=>{handleRemovestudent(student.id)}}>
                                                    <i className="fa-solid fa-trash-can hover:cursor-pointer"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                
                                ))
                            ) : (   
                                <p className='text-red-600'>No students available.</p>
                            )}</>
                        ):<Loader/>}
                          
                    </div>
    </>)}
*/}
