import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { allStudent } from '@/Redux/features/allStudents/allStudents'
import {allTeachers} from '@/Redux/features/allTeachers/allTeachers'
import {allCourses} from '@/Redux/features/allCourses/allCourses'
import stuImg from '../../assets/audience.png'
import courseImg from '../../assets/online-lesson.png'
import teaImg from '../../assets/teachers-day.png'
import Loader from '../Loader/Loader'
import studentImg from '../../assets/student.png'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import styles from './AdminDashboard.module.css'



function AdminDashboard() {

    let dispatch= useDispatch()
    const {students,loading}= useSelector((state)=>state.allStudents)
    const {teachers}= useSelector((state)=>state.allTeachers)
    const {courses}= useSelector((state)=>state.allCourses)


        useEffect(()=>{
            try {
                dispatch(allStudent())
                dispatch(allTeachers())
                dispatch(allCourses())

            } catch (error) {
                toast.error('wait!')
            }},[dispatch])
           
    

    return <>
        <div className='grid grid-cols-1 gap-2 p-5'>
        <h1 className='text-3xl font-medium text-black text-center italic'>Admin Dashboard</h1>
            <main className='hover:shadow-2xl transition-all duration-300 ease rounded-2xl shadow p-3 mb-3'>
                <h2 className='text-2xl font-medium text-black text-center pb-3 '>OverView</h2>
                <div className='grid lg:grid-cols-3 md-grid-cols-1 sm:grid-cols-1 gap-3 text-center'>
                    <a href="#students"><div className='shadow-lg p-0 shadow-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-violet-300 transition-all duration-300 ease'>
                        <div className='pt-10 text-2xl'>
                            <h3> Students</h3>
                            <p>{!loading?(<>{students.length}</>):<Loader/>}<img className='w-7 inline m-2' src={stuImg} alt="stuImg" /></p>
                        </div>
                        <svg className='p-0' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#6366F1" fill-opacity="1" d="M0,192L80,170.7C160,149,320,107,480,122.7C640,139,800,213,960,240C1120,267,1280,245,1360,234.7L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path></svg>
                    </div>
                    </a>
                    <a href="#teachers"><div className='shadow-lg rounded-2xl overflow-hidden cursor-pointer hover:shadow-violet-300 transition-all duration-300 ease'>
                        <div className='pt-10 text-2xl'>
                            <h3 > Teachers</h3>
                            <p>{!loading?(<>{teachers.length}</>):<Loader/>}<img className='w-7 inline m-2' src={teaImg} alt="stuImg" /></p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#6366F1" fill-opacity="1" d="M0,192L80,170.7C160,149,320,107,480,122.7C640,139,800,213,960,240C1120,267,1280,245,1360,234.7L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path></svg>
                    </div>
                    </a>
                    
                    <a href="#courses"><div className='shadow-lg rounded-2xl cursor-pointer overflow-hidden hover:shadow-violet-300 transition-all duration-300 ease'>
                    <div className='pt-10 text-2xl'>
                        <h3 className='text-xl'> Courses</h3>
                        <p>{!loading?(<>{courses.length}</>):<Loader/>}<img className='w-7 inline m-2' src={courseImg} alt="stuImg" /></p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#6366F1" fill-opacity="1" d="M0,192L80,170.7C160,149,320,107,480,122.7C640,139,800,213,960,240C1120,267,1280,245,1360,234.7L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path></svg>
                    </div>
                    </a>

                </div>
            </main>

            <section id='students' className='   transition-all duration-300 ease rounded-2xl shadow p-3 mb-3'>
            <h2 className='text-2xl font-medium text-black text-center py-3'>Our Students</h2>

                <div  className='grid lg:grid-cols-7 md:grid-cols-4 grid-cols-1 gap-5 text-center mx-auto hover:cursor-pointer transition-all duration-300 ease'>
                {!loading?
                (
                    <>
                    {students && students.length >0 ?
                    (
                        students.map((student)=>{
                            return(
                                <>
                                     <div key={student.id} className="relative shadow rounded-lg p-2 bg-white hover:bg-[#7D5CE3] hover:text-white transition-all duration-300 ease">
                                     <img className='w-7 inline m-2' src={studentImg} alt="stuImg" />
                                    <h2 className=" font-semibold mt-2">{student.name}</h2>
                                    
                                    <p className=" text-red-500 font-semibold mt-2">Id : {student.id}</p>
                                   
                                </div>
                                </>
                            )
                        })
                    ):'No Students'
                    }
                    </>
                ):<Loader/>}
                </div>
                <div className='flex flex-row justify-center items-center mt-4'>
                <Link to={'/admin/students'}>
                    <button className='cursor-pointer text-xl shadow-2xl shadow-violet-200 p-3 rounded-full hover:scale-[1.1] focus:outline-none focus:ring-1 focus:ring-violet-500 focus:bg-violet-300 focus:text-white  transition-all duration-300 ease'>View More</button>
                </Link>

                </div>
                
            </section>

            <section id='teachers' className=' transition-all duration-300 ease rounded-2xl shadow p-3 mb-3'>
            <h2 className='text-2xl font-medium text-black text-center py-3'>Our Teachers</h2>

                <div  className='grid lg:grid-cols-7 md:grid-cols-4 grid-cols-1 gap-5 text-center mx-auto hover:cursor-pointer transition-all duration-300 ease'>
                {!loading?
                (
                    <>
                    {teachers && teachers.length >0 ?
                    (
                        teachers.map((teacher)=>{
                            return(
                                <>
                                     <div key={teacher.id} className="relative shadow rounded-lg p-2 bg-white hover:bg-[#4BBC94] hover:text-white transition-all duration-300 ease">
                                     <img className='w-7 inline m-2' src={teaImg} alt="stuImg" />
                                    <h2 className=" font-semibold mt-2">{teacher.name}</h2>
                                    
                                    <p className=" text-red-500 font-semibold mt-2">Id : {teacher.id}</p>
                                   
                                </div>
                                </>
                            )
                        })
                    ):'No Teachers'
                    }
                    </>
                ):<Loader/>}
                </div>
                <div className='flex flex-row justify-center items-center mt-4'>
                <Link to={'/admin/addteacher'}>
                    <button className='cursor-pointer text-xl shadow-2xl shadow-violet-200 p-3 rounded-full hover:scale-[1.1] focus:outline-none focus:ring-1 focus:ring-violet-500 focus:bg-violet-300 focus:text-white  transition-all duration-300 ease'>View More</button>
                </Link>

                </div>
                
            </section>

            <section id='courses' className='  transition-all duration-300 ease rounded-2xl shadow p-3 mb-3'>
            <h2 className='text-2xl font-medium text-black text-center py-3'>Our Courses</h2>

                <div  className='grid lg:grid-cols-7 md:grid-cols-4 grid-cols-1 gap-5 text-center mx-auto hover:cursor-pointer transition-all duration-300 ease'>
                {!loading?
                (
                    <>
                    {courses && courses.length >0 ?
                    (
                        courses.map((course)=>{
                            return(
                                <>
                                     <div key={course.id} className="relative shadow rounded-lg p-2 bg-white hover:bg-[#458DE8] hover:text-white transition-all duration-300 ease">
                                     <img className='w-7 inline m-2' src={courseImg} alt="stuImg" />
                                    <h2 className=" font-semibold mt-2">{course.title}</h2>
                                    
                                    <p className=" text-red-500 font-semibold mt-2">Id : {course.id}</p>
                                   
                                </div>
                                </>
                            )
                        })
                    ):'No Courses'
                    }
                    </>
                ):<Loader/>}
                </div>
                <div className='flex flex-row justify-center items-center mt-4'>
                <Link to={'/admin/addcourse'}>
                    <button className='cursor-pointer text-xl shadow-2xl shadow-violet-200 p-3 rounded-full hover:scale-[1.1] focus:outline-none focus:ring-1 focus:ring-violet-500 focus:bg-violet-300 focus:text-white  transition-all duration-300 ease'>View More</button>
                </Link>

                </div>
                
            </section>
        </div>
    </>
}

export default AdminDashboard
