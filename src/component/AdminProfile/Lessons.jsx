import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { allLessons } from '@/Redux/features/allLessons/allLessons'
import lessonImg from '../../assets/lesson.png'
import Loader from '../Loader/Loader'
import axios from 'axios'
import toast from 'react-hot-toast'


function Lessons() {

    let dispatch= useDispatch()
    const {lessons,loading}= useSelector((state)=>state.allLessons)

    async function handleRemoveLesson(id) {
        axios.delete(`https://e-learn-v1.runasp.net/api/Lesson/DeleteLesson/DeleteLesson/${id}`)
        .then((response)=>{
            console.log("Lesson deleted");
            console.log("Clicked delete for ID:", lessons.id);
            dispatch(allLessons())
            toast.success('Lesson Deleted')
        }).catch((error)=>{
            console.log(error||'invalid id');
            toast.error('Invalid Id')
        })
   
    }

    useEffect(()=>{
        dispatch(allLessons())
    },[])
    return <>
     <div className='p-2'>
                <h1 className='font-medium text-2xl'><img src={lessonImg} alt="stuImg" className='w-7 inline m-2' />Our Courses</h1>
                    <div className='flex flex-col sm:flex-col  md:flex-col lg:flex-col content-center w-[100%] h-full gap-5 p-5 mx-auto hover:cursor-pointer'>
                        {!loading?
                        (<>
                            {lessons && lessons.length > 0 ? (
                                lessons.map((lesson) => (
                                <div key={lesson.id} className="relative shadow p-3 rounded bg-gray-400 hover:shadow-xl hover:shadow-violet-200 ">
                                    <div className='flex flex-row justify-between'>
                                    <h2 className="text-lg font-semibold mt-2">Lesson title : {lesson.title}</h2>
                                    <p className="text-lg text-red-700 font-semibold mt-2">Lesson Id : {lesson.id}</p>
                                    </div>
                                    
                                    <p className="text-gray-700">Lesson Description : {lesson.description}</p>
                                    <p className="text-gray-500"><span className='text-black'>Material Lessons :</span> {lesson.showMaterialsLessons || <span className='text-yellow-500'>No Material</span>}</p>
                                    
                                    <div className='text-black-500 hover:text-red-500 absolute bottom-2 right-7 bg-gray-300 rounded-full px-3 py-2 hover:cursor-pointer hover:shadow-2xl hover:shadow-gray-500'>
                                        <button  onClick={()=>{handleRemoveLesson(lesson.id)}}>
                                            <i className="fa-solid fa-trash-can hover:cursor-pointer"></i>
                                        </button>
                                    </div>
                                </div>
                                ))
                            ) : (   
                                <p className='text-red-600'>No lessons available.</p>
                            )}</>
                        ):<Loader/>}
                          
                    </div>
            </div>
    </>
}

export default Lessons
