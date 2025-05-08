import React, { Children, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { allCourses } from '@/Redux/features/allCourses/allCourses'
import addImg from '../../assets/add.png'
import { useFormik } from 'formik'
import courseImg from '../../assets/online-lesson.png'
import Loader from '../Loader/Loader'
import axios from 'axios'
import img from '../../assets/avatar.png'
import toast from 'react-hot-toast'




function AddCourse() {

    let dispatch= useDispatch()
    const [imagePreview, setImagePreview]= useState(img)
    const {courses,loading}= useSelector((state)=>state.allCourses)
    const [addedCourse, setAddedCourse]= useState([])


    async function handleAddCourse(formsData){
        console.log('Added',formsData);
        
        axios.post('https://e-learn-v1.runasp.net/api/Teacher/Teacher/Create', {},
            {params:formsData
            }
        ).then((response)=>{
            console.log(response);
            alert("Course added successfully!");
            toast.success('Course Added')
            dispatch(allCourses());
            formik.resetForm();
            setImagePreview(null);
            
        }).catch((error)=>{
            console.log(error);
            toast.error('Invalid Id')
            
        })
    }

    async function handleRemoveCourse(id) {
        axios.delete(`https://e-learn-v1.runasp.net/Course/Delete/${id}`)
        .then((response)=>{
            console.log("Course deleted");
            toast.success('Course Deleted')
            dispatch(allCourses())
        }).catch((error)=>{
            console.log(error||'invalid id');
            toast.error('Invalid Id')
            
        })
        
        
    }

    let formik = useFormik({
        initialValues:{
            title:'',
            description:'',
            price:'',
            teacherId:'',
            categoryId:'',
            level:'',
            image:null
        },
        onSubmit:handleAddCourse
    })

    useEffect(()=>{
        dispatch(allCourses())
    },[dispatch])

    return <>
         <div className="flex flex-col sm:flex-col  md:flex-col lg:flex-col content-center w-[100%] h-full gap-2">
            <h2 className='font-medium text-2xl p-2'><img src={addImg} alt="stuImg" className='w-7 inline m-2' />Add Course</h2>
            <form className='mx-auto p-2 w-[50%]' onSubmit={formik.handleSubmit}>
                <div>
                    <label htmlFor="title" className='block'>Course Title <span className='text-red-500'>*</span></label>
                    <input type="text" name="title" id="title" value={formik.values.title} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    placeholder='Enter Course Title'
                    className="block border-1 border-gray-200 rounded p-2 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease"/>
                </div>
                <div>
                    <label htmlFor="description">Course Description </label>
                    <input type="text" name="description" id="description" value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    placeholder='Enter Course Description'
                    className="border-1 border-gray-200 rounded p-2 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease"/>
                </div>
                <div>
                    <label htmlFor="price">Course Price <span className='text-red-500'>*</span></label>
                    <input type="number" name="price" id="price" value={formik.values.price} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    placeholder='Enter Course Price'
                    className="border-1 border-gray-200 rounded p-2 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease"/>
                </div>
                <div>
                    <label htmlFor="teacherId">TeacherId <span className='text-red-500'>*</span></label>
                    <input type="text" name="teacherId" id="teacherId" value={formik.values.teacherId} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    placeholder='Enter TeacherId'
                    className="border-1 border-gray-200 rounded p-2 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease"/>
                </div>
                <div>
                    <label htmlFor="categoryId">CategoryId <span className='text-red-500'>*</span></label>
                    <input type="text" name="categoryId" id="categoryId" value={formik.values.categoryId} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    placeholder='Enter CategoryId'
                    className="border-1 border-gray-200 rounded p-2 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease"/>
                </div>
                <div>
                    <label htmlFor="level">Level</label>
                    <select 
                        name="level" 
                        required 
                        value={formik.values.level} 
                        onChange={formik.handleChange} 
                        onBlur={formik.handleBlur}
                        className="border-1 border-gray-200 rounded p-2 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease">
                        <option value="">Select level</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="image">Image</label>
                    <input type="file" name="image" id="image" accept='image/*' onBlur={formik.handleBlur}
                    onChange={(e)=>{
                        const file=e.currentTarget.files[0];
                        if(file){
                            formik.setFieldValue('image',file)
                            setImagePreview(URL.createObjectURL(file))
                        }else{
                            formik.setFieldValue('image',null)
                            setImagePreview(img)
                        }
                    }}
                    className="border-1 border-gray-200 rounded p-2 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease"/>
                </div>
                <div className='my-2 flex justify-center '>
                    <button type='submit'
                    className="bg-violet-100 text-violet-600  px-6 py-2 rounded text-xl  hover:cursor-pointer hover:shadow-sm hover:shadow-violet-300-600 transition-all duration-300 ease"
                    >Add</button>
                </div>
            </form>

            <hr />

            <div className='p-2'>
                <h1 className='font-medium text-2xl'><img src={courseImg} alt="stuImg" className='w-7 inline m-2' />Our Courses</h1>
                    <div className='grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-5 p-5 text-center mx-auto hover:cursor-pointer'>
                        {!loading?
                        (<>
                            {courses && courses.length > 0 ? (
                                courses.map((course) => (
                                <div key={course.id} className="relative shadow p-2 rounded bg-white hover:shadow-xl hover:shadow-violet-200 ">
                                    <img src={course.imagePath} alt={course.title} className="w-full h-48 object-cover rounded " />
                                    <h2 className="text-lg font-semibold mt-2">{course.title}</h2>
                                    <p className="text-lg text-red-500 font-semibold mt-2">Id : {course.id}</p>
                                    <p className="text-gray-500">{course.description}</p>
                                    <p className="text-gray-500"><span className='text-black'>Level :</span> {course.level}</p>
                                    <p className="text-gray-500"><span className='text-black'>Category Name :</span> {course.categoryName}</p>
                                    <p className="text-violet-600 font-bold mt-1">{course.price} USD</p>
                                    <div className='text-red-500 absolute top-5 right-7 bg-white rounded-full p-2 hover:cursor-pointer hover:shadow-2xl hover:shadow-gray-500'>
                                        <button  onClick={()=>{handleRemoveCourse(course.id)}}>
                                            <i className="fa-solid fa-trash-can hover:cursor-pointer"></i>
                                        </button>
                                    </div>
                                </div>
                                ))
                            ) : (   
                                <p className='text-red-600'>No courses available.</p>
                            )}</>
                        ):<Loader/>}
                          
                    </div>
            </div>
        </div>
    </>
}

export default AddCourse






