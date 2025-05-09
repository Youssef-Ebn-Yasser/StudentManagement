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
        
        axios.post('https://e-learn-v1.runasp.net/api/Teacher/Teacher/Create', formsData)
            .then((response)=>{
            console.log(response.data);
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
            Title:'',
            Description:'',
            Price:'',
            TeacherId:'',
            CategoryId:'',
            Level:'',
            Hours:'',
            Image:null
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
                    <label htmlFor="Title" className='block'>Course Title <span className='text-red-500'>*</span></label>
                    <input type="text" name="Title" id="Title" value={formik.values.Title} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    placeholder='Enter Course Title'
                    className="block border-1 border-gray-200 rounded p-2 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease"/>
                </div>
                <div>
                    <label htmlFor="Description">Course Description </label>
                    <input type="text" name="Description" id="Description" value={formik.values.Description} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    placeholder='Enter Course Description'
                    className="border-1 border-gray-200 rounded p-2 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease"/>
                </div>
                <div>
                    <label htmlFor="Price">Course Price <span className='text-red-500'>*</span></label>
                    <input type="number" name="Price" id="Price" value={formik.values.Price} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    placeholder='Enter Course Price'
                    className="border-1 border-gray-200 rounded p-2 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease"/>
                </div>
                <div>
                    <label htmlFor="Hours">Course Hours <span className='text-red-500'>*</span></label>
                    <input type="number" name="Hours" id="Hours" value={formik.values.Hours} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    placeholder='Enter Course Hours'
                    className="border-1 border-gray-200 rounded p-2 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease"/>
                </div>
                <div>
                    <label htmlFor="TeacherId">TeacherId <span className='text-red-500'>*</span></label>
                    <input type="text" name="TeacherId" id="TeacherId" value={formik.values.TeacherId} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    placeholder='Enter TeacherId'
                    className="border-1 border-gray-200 rounded p-2 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease"/>
                </div>
                <div>
                    <label htmlFor="CategoryId">CategoryId <span className='text-red-500'>*</span></label>
                    <input type="text" name="CategoryId" id="CategoryId" value={formik.values.CategoryId} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    placeholder='Enter CategoryId'
                    className="border-1 border-gray-200 rounded p-2 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease"/>
                </div>
                <div>
                    <label htmlFor="Level">Level</label>
                    <select 
                        id='Level'
                        name="Level" 
                        required 
                        value={formik.values.Level} 
                        onChange={formik.handleChange} 
                        onBlur={formik.handleBlur}
                        className="border-1 border-gray-200 rounded p-2 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease">
                        <option value="">Select Level</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="Image">Image</label>
                    <input type="file" name="Image" id="Image" accept='Image/*' onBlur={formik.handleBlur}
                    onChange={(e)=>{
                        const file=e.currentTarget.files[0];
                        if(file){
                            formik.setFieldValue('Image',file)
                            setImagePreview(URL.createObjectURL(file))
                        }else{
                            formik.setFieldValue('Image',null)
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
                                            <i className="fa-solid fa-lock hover:cursor-pointer"></i>
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






