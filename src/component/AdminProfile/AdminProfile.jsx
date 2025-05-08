import React, { useEffect, useState } from 'react'
import img from '../../assets/teacherEx.png'
import axios from 'axios'
import teaImg from '../../assets/teachers-day.png'
import stuImg from '../../assets/audience.png'
import gateImg from '../../assets/gategory.png'
import courseImg from '../../assets/online-lesson.png'
import assignmentImg from '../../assets/assignment.png'
import lessonImg from '../../assets/lesson.png'
import profilePhoto from '../../assets/wallpaperflare.jpg'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { allStudent } from '@/Redux/features/allStudents/allStudents'
import { allTeachers } from '@/Redux/features/allTeachers/allTeachers'
import { allCourses } from '@/Redux/features/allCourses/allCourses'

function AdminProfile() {

    // let [profilePhoto, setProfilePhoto]= useState("../../assets/wallpaperflare.jpg")
    let dispatch= useDispatch()

    const {students}= useSelector((state)=>state.allStudents)
    const {teachers}= useSelector((state)=>state.allTeachers)
    const {courses}= useSelector((state)=>state.allCourses)


    
    useEffect(()=>{
        dispatch(allStudent())
        dispatch(allTeachers())
        dispatch(allCourses())
    },[])


    return <>
        <div className='flex flex-col justify-center'>
            <div className='flex flex-col h-full relative'>
                <img src={profilePhoto} alt="cover" className='w-lvw h-[300px] object-cover' />
                <div className='adminCard relative w-[100%] bg-white rounded-xl shadow-lg p-6 mt-[-75px] z-10 flex flex-col items-center'>
                        <img src={img} alt="adminImg" className='w-80 h-80 rounded-full border-4 border-white -mt-16 z-20 '/>
                        <h1 className='text-black text-center text-2xl -mt-1 z-20 font-medium'>Admin Name</h1>
                        <p className='text-gray-600'>E-learning Admin Owner</p>
                        <p>
                            <img src={stuImg} alt="stuImg" className='w-5 inline' /><span className='text-indigo-500 font-medium'>{students.length}</span> Students &nbsp;
                            <img src={teaImg} alt="stuImg" className='w-5 inline' /><span className='text-indigo-500 font-medium'>{teachers.length}</span> Teachers &nbsp;
                            <img src={courseImg} alt="stuImg" className='w-5 inline' /><span className='text-indigo-500 font-medium'>{courses.length}</span> Courses &nbsp;

                        </p>
                        <p className='flex lg:flex-row md:flex-row sm:flex-col gap-2 py-2'>
                            <a href='#' className='bg-violet-100 text-violet-600 px-3 rounded-sm hover:shadow-lg hover:shadow-gray-300'><i class="fa-brands fa-facebook-f"></i></a>
                            <a href='#' className='bg-violet-100 text-violet-600 px-3 rounded-sm hover:shadow-lg hover:shadow-gray-300'><i class="fa-brands fa-github"></i></a>
                            <a href='#' className='bg-violet-100 text-violet-600 px-3 rounded-sm hover:shadow-lg hover:shadow-gray-300'><i class="fa-brands fa-linkedin-in"></i></a>
                            <a href='#' className='bg-violet-100 text-violet-600 px-3 rounded-sm hover:shadow-lg hover:shadow-gray-300'><i class="fa-brands fa-instagram"></i></a>
                            <a href='#' className='bg-violet-100 text-violet-600 px-3 rounded-sm hover:shadow-lg hover:shadow-gray-300'><i class="fa-brands fa-linkedin-in"></i></a>
                            <a href='#' className='bg-violet-100 text-violet-600 px-3 rounded-sm hover:shadow-lg hover:shadow-gray-300'><i class="fa-brands fa-x-twitter"></i></a>
                        </p>
                </div>
                <div className='p-5'>
                    <h2 className='text-black text-2xl -mt-1 z-20 font-medium'>About Me</h2>
                    <p className='text-gray-400 text-lg'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem, fugiat aliquam. Placeat architecto neque nesciunt aliquam aut. Obcaecati eum possimus tenetur harum, qui consequatur ipsum doloribus nemo fugiat explicabo et. Laborum nostrum dicta veniam, sapiente nisi porro accusantium hic deleniti, asperiores, recusandae aliquam suscipit maxime aut ullam ipsam. Nam sed eligendi illum dignissimos deleniti deserunt quas, dolore est quo animi quia, soluta corrupti excepturi? Maiores expedita, sit ea exercitationem illo, molestias voluptate deleniti tempora, consectetur quisquam explicabo quam! Ullam voluptatum molestias maiores officia ea, possimus magnam quaerat quo dolorum corporis error in, qui obcaecati blanditiis odit. Vel nesciunt consequuntur at.</p>
                </div>
                
            </div>

            <div className='grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-5 p-5 text-center'>
                
                <Link to={'/admin/addteacher'}>
                    <div className='bg-violet-100 text-violet-600 rounded-2xl p-5 text-2xl hover:shadow-lg hover:shadow-violet-200 transition-all duration-300 ease'>
                        <span><img src={teaImg} alt="stuImg" className='w-7 inline m-2' /></span><h3>Add Teacher</h3>
                    </div>
                </Link>
                <Link to={'/admin/addgategory'}>
                    <div className='bg-violet-100 text-violet-600 rounded-2xl p-5 text-2xl hover:shadow-lg hover:shadow-violet-200 transition-all duration-300 ease'>
                        <span><img src={gateImg} alt="stuImg" className='w-7 inline m-2' /></span><h3>Add Gategory</h3>
                    </div>
                </Link>
                <Link to={'/admin/addcourse'}>
                    <div className='bg-violet-100 text-violet-600 rounded-2xl p-5 text-2xl hover:shadow-lg hover:shadow-violet-200 transition-all duration-300 ease'>
                        <span><img src={courseImg} alt="stuImg" className='w-7 inline m-2' /></span><h3>Add Course</h3>
                    </div>
                </Link>
                <Link to={'/admin/students'}>
                    <div className='bg-violet-100 text-violet-600 rounded-2xl p-5 text-2xl hover:shadow-lg hover:shadow-violet-200 transition-all duration-300 ease'>
                        <span><img src={stuImg} alt="stuImg" className='w-7 inline m-2' /></span><h3>Students</h3>
                    </div>
                </Link>
                <Link to={'/admin/lessons'} className='col-span-2'>
                    <div className='bg-violet-100 text-violet-600 rounded-2xl p-5 text-2xl hover:shadow-lg hover:shadow-violet-200 transition-all duration-300 ease'>
                        <span><img src={lessonImg} alt="stuImg" className='w-7 inline m-2' /></span><h3>Lessons</h3>
                    </div>
                </Link>
                     

            </div>
        </div>
        
    </>
}

export default AdminProfile
