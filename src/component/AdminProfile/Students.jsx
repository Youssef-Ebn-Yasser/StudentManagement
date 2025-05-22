import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { allStudent } from '@/Redux/features/allStudents/allStudents'
import stuImg from '../../assets/audience.png'
import Loader from '../Loader/Loader'
import studentImg from '../../assets/student.png'
import axios from 'axios'
import toast from 'react-hot-toast'


function Students() {

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
        <div className='p-2'>
                <h1 className='font-medium text-2xl'><img src={stuImg} alt="stuImg" className='w-7 inline m-2' />Our Students</h1>

                            <div className=" p-4 ">
                                <input className='border-1 rounded-3xl border-gray-200 p-2 hover:shadow-lg hover:shadow-gray-400 w-[50%] transition-all duration-300 ease ms-3'
                                type="text" placeholder={`Search students by ${searchType}`} onChange={(e)=>setSearchItem(e.target.value)}/>
                                <select
                                    className="p-1"
                                    value={searchType}
                                    onChange={(e) => setSearchType(e.target.value)}
                                >
                                    <option value="name">Name</option>
                                    <option value="id">ID</option>
                                    <option value="email">Email</option>
                                </select>
                            </div>

                            {searchItem && (
                        <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-5 p-5 text-center mx-auto hover:cursor-pointer transition-all duration-300 ease">
                            {!loading ? (
                            <>
                                <h1 className=" text-2xl col-span-full">
                                <i className="fa-solid fa-magnifying-glass px-2 text-red-500 text-lg"></i>
                                Search Results
                                </h1>

                                {filteredstudent.length > 0 ? (
                                filteredstudent.map((student, index) => (
                                    <div
                                    key={student.id}
                                    className="relative shadow rounded p-2 bg-white hover:shadow-xl hover:shadow-violet-200"
                                    >
                                    <img
                                        src={student.imagePath || studentImg}
                                        alt={student.name}
                                        className="w-full h-48 object-fill rounded"
                                    />
                                    <h2 className="text-lg font-semibold mt-2">
                                        Student Name: {student.name}
                                    </h2>
                                    <p className="text-lg text-red-500 font-semibold mt-2">
                                        Id: {student.id}
                                    </p>

                                    <div className="text-center">
                                        {enrolledCourse && enrolledCourse[student.id] ? (
                                        enrolledCourse[student.id].length > 0 ? (
                                            <ul className="text-center list-disc list-inside text-gray-500">
                                            {enrolledCourse[student.id].map((course) => (
                                                <li className="list-none" key={course.id}>
                                                <span className="text-black">Enrolled Courses: </span>
                                                {course.title || `Course ID: ${course.id}`}
                                                </li>
                                            ))}
                                            </ul>
                                        ) : (
                                            <p className="text-xs text-gray-400 text-left ml-1">
                                            No Enrolled Courses
                                            </p>
                                        )
                            ) : (
                            <p className="text-xs text-gray-400 text-left ml-1">
                                Loading courses...
                            </p>
                            )}
                        </div>

                        <p className="text-gray-500 hover:text-blue-500 hover:underline transition-all duration-300 ease">
                            <a href={`mailto:${student.email}`} target="_blank" rel="noreferrer">
                            {student.email}
                            </a>
                        </p>

                        <div className="text-red-500 absolute top-5 right-7 bg-white rounded-full p-3 hover:cursor-pointer hover:bg-gray-200 transition-all duration-300 ease">
                            <button onClick={() => handleRemovestudent(student.id)}>
                            <i className="fa-solid fa-trash-can hover:cursor-pointer"></i>
                            </button>
                        </div>
                        </div>
                            ))
                            ) : (
                            <p className="text-gray-500 text-center col-span-full">No matching students found.</p>
                            )}
                        </>
                        ) : (
                        <p className="text-center col-span-full text-gray-500">Loading students...</p>
                        )}
                    </div>
                    )}



                    <div className='grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-5 p-5 text-center mx-auto hover:cursor-pointer transition-all duration-300 ease'>
                        {!loading?
                        (<>
                            {students && students.length > 0 ? (
                                students.map((student) => (
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
                                ))
                            ) : (   
                                <p className='text-red-600'>No students available.</p>
                            )}</>
                        ):<Loader/>}
                          
                    </div>
        </div>
    </>
}

export default Students
