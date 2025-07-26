import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loader from '../Loader/Loader'
import { allCourses } from '@/Redux/features/allCourses/allCourses'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import courseImg from '../../assets/online-lesson.png'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next';



function ControlCourse() {
    const { t } = useTranslation();
    let {id}= useParams()
    let dispatch= useDispatch()

    const {courses,loading}= useSelector((state)=>state.allCourses)
    const[details, setDetails]= useState(null)
    let [isloading, setLoading]= useState(true)
    let [error, setError]= useState()

    function getCourseDetails(){
        axios.get(`https://e-learn-v1.runasp.net/Course/Get/${id}`)
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

    async function handleRemoveCourse(id) {
        axios.delete(`https://e-learn-v1.runasp.net/Course/Delete/${id}`)
        .then((response)=>{
            console.log("Course deleted");
            toast.success('Course Deleted')
            dispatch(allCourses())

            window.location.href='/admin/addcourse'
        }).catch((error)=>{
            console.log(error||'invalid id');
            toast.error('Invalid Id')
            
        })
        
        
    }

    useEffect(()=>{
        getCourseDetails()
        dispatch(allCourses())

    },[id])

    return (<>
        {loading && <Loader visible={loading} />}
        <ContentWrapper $loading={loading}>
            {!isloading ? (
            <div className="p-5">
            <div key={details?.data.id} className="grid relative grid-cols-1 lg:grid-cols-2 md:grid-cols-2 border-1 border-gray-100 mx-auto shadow p-2 rounded bg-white hover:shadow-xl hover:shadow-violet-200 ">
                <div>
                    <img src={details?.data?.imagePath ?courseImg: courseImg} alt={details?.data.title} className="w-50 object-cover rounded " />

                </div>
                <div className='my-auto'>
                    <div>
                        <h2 className="text-lg font-semibold mt-2">{details?.data.title}</h2>
                        <p className="text-lg text-red-500 font-semibold mt-2">{t("id")} : {details?.data.id}</p>
                        <p className="text-gray-500">{details?.data.description}</p>
                        <p className="text-gray-500"><span className='text-black'>{t("category-name")} :</span> {details?.data.categoryName}</p>
                        <p className="text-violet-600 font-bold mt-1">{details?.data.price} USD</p>
                        <div className='text-red-400 absolute top-0 right-0 rounded-full p-2 hover:cursor-pointer hover:shadow-2xl hover:shadow-gray-500 transition'>
                            <button  onClick={()=>{handleRemoveCourse(details?.data.id)}}>
                                <i className="fa-solid fa-lock hover:cursor-pointer text-2xl hover:text-red-500"></i>
                            </button>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold mt-2">{details?.data.lessonCount} {t("lessons")}</h2>
                        <ul className="list-disc ml-5 mt-2">
                            {details?.data.lessonInfo?.map((lesson , index) => (
                            <li key={lesson.id} className="text-gray-700">
                                <span className='text-blue-800 font-medium'>{t("lesson")} {index + 1}:</span> {lesson.title}
                            </li>
                            ))}
                        </ul>
                    </div>
                    
                </div>
                                            
            </div>
            
            </div>
              ) : (
                <Loader className='flex flex-row justify-center items-center content-center'/>
              )}
        </ContentWrapper>
        

    </>)

            }
export default ControlCourse;
