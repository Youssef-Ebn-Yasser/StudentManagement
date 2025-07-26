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
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import ContentWrapper from '../ContentWrapper/ContentWrapper'


function AddCourse() {

    const { t } = useTranslation();
    let dispatch= useDispatch()
    const [imagePreview, setImagePreview]= useState(img)
    const {courses,loading}= useSelector((state)=>state.allCourses)
    // const [addedCourse, setAddedCourse]= useState([]) // This state seems unused


    async function handleAddCourse(formsData){
        console.log('Added',formsData);

        const params = new URLSearchParams({
            Title: formsData.Title,
            Description: formsData.Description,
            Price: formsData.Price,
            TeacherId: formsData.TeacherId,
            CategoryId: formsData.CategoryId,
            Level: formsData.Level,
            Hours: formsData.Hours
        });

        const formData = new FormData();
        formData.append("image", formsData.image);
        
        const token = localStorage.getItem('token') || localStorage.getItem('JWTToken');
        axios.post(
          `https://e-learn-v1.runasp.net/Course/Create?${params.toString()}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        )
            .then((response)=>{            
            toast.success('Course Added Successfully!')
            dispatch(allCourses())
            formik.resetForm()
            setImagePreview(img) // Reset to default placeholder
            
        }).catch((error)=>{
            console.log(error);
            // Attempt to get a more specific error message
            const errorMsg = error.response?.data?.errors?.Image?.[0] || error.response?.data?.title || error.response?.data?.message || 'Failed to add course. Please try again.';
            toast.error(errorMsg)
        })
    }

    async function handleRemoveCourse(id) {
        const token = localStorage.getItem('token') || localStorage.getItem('JWTToken');
        axios.delete(
          `https://e-learn-v1.runasp.net/Course/Delete?id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        )
        .then((response)=>{
            console.log("Course deleted");
            toast.success('Course Deleted')
            dispatch(allCourses())
        }).catch((error)=>{
            console.log(error||'invalid id');
            toast.error(error.response?.data?.message || 'Failed to delete course.')
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
            image:null // Changed from Image to image to match input name and formData
        },
        onSubmit:handleAddCourse
    })

    useEffect(()=>{
        dispatch(allCourses())
    },[dispatch]) // dispatch is stable, so this effectively runs once on mount

    return <>
    {loading && <Loader visible={loading} />}
    <ContentWrapper $loading={loading}>
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto space-y-10">
                {/* Add Course Form Section */}
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-2xl mx-auto">
                    <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-8 flex items-center justify-center'>
                        <img src={addImg} alt="Add Course Icon" className='w-8 h-8 mr-3' />
                        {t("add-new-course")}
                    </h2>
                    <form className='space-y-6' onSubmit={formik.handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="Title" className='block text-sm font-medium text-gray-700 mb-1'>{t("course-title")} <span className='text-red-500'>*</span></label>
                                <input type="text" name="Title" id="Title" value={formik.values.Title} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                placeholder={t("course-title-placeholder")}
                                className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 p-3"/>
                            </div>
                            <div>
                                <label htmlFor="Price" className='block text-sm font-medium text-gray-700 mb-1'>{t("course-price")} (USD) <span className='text-red-500'>*</span></label>
                                <input type="number" name="Price" id="Price" value={formik.values.Price} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                placeholder={t("course-price-placeholder")}
                                className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 p-3"/>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="Description" className='block text-sm font-medium text-gray-700 mb-1'>{t("course-description")}</label>
                            <textarea name="Description" id="Description" value={formik.values.Description} onChange={formik.handleChange} onBlur={formik.handleBlur}
                            placeholder={t("course-description-placeholder")}
                            rows="3"
                            className="form-textarea w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 p-3"></textarea>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="Hours" className='block text-sm font-medium text-gray-700 mb-1'>{t("course-hours")} <span className='text-red-500'>*</span></label>
                                <input type="number" name="Hours" id="Hours" value={formik.values.Hours} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                placeholder={t("course-hours-placeholder")}
                                className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 p-3"/>
                            </div>
                            <div>
                                <label htmlFor="Level" className='block text-sm font-medium text-gray-700 mb-1'>{t("course-level")} <span className='text-red-500'>*</span></label>
                                <select 
                                    id='Level'
                                    name="Level" 
                                    value={formik.values.Level} 
                                    onChange={formik.handleChange} 
                                    onBlur={formik.handleBlur}
                                    className="form-select w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 p-3">
                                    <option value="">{t("select-level")}</option>
                                    <option value={t("level-beginner")}>{t("level-beginner")}</option>
                                    <option value={t("level-intermediate")}>{t("level-intermediate")}</option>
                                    <option value={t("level-advanced")}>{t("level-advanced")}</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="TeacherId" className='block text-sm font-medium text-gray-700 mb-1'>{t("teacher-id")}<span className='text-red-500'>*</span></label>
                                <input type="text" name="TeacherId" id="TeacherId" value={formik.values.TeacherId} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                placeholder={t("enter-teacher-id")}
                                className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 p-3"/>
                            </div>
                            <div>
                                <label htmlFor="CategoryId" className='block text-sm font-medium text-gray-700 mb-1'>{t("category-id")}<span className='text-red-500'>*</span></label>
                                <input type="text" name="CategoryId" id="CategoryId" value={formik.values.CategoryId} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                placeholder={t("enter-category-id")}
                                className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 p-3"/>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="image" className='block text-sm font-medium text-gray-700 mb-1'>{t("course-image")}</label>
                            <input type="file" name="image" id="image" accept='image/*' onBlur={formik.handleBlur} // Changed name to "image"
                            onChange={(e)=>{
                                const file=e.currentTarget.files[0];
                                if(file){
                                    formik.setFieldValue('image',file) // Changed to "image"
                                    setImagePreview(URL.createObjectURL(file))
                                }else{
                                    formik.setFieldValue('image',null) // Changed to "image"
                                    setImagePreview(img) // Default placeholder
                                }
                            }}
                            className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
                            {imagePreview && <img src={imagePreview} alt="Preview" className="mt-3 w-32 h-32 object-contain rounded-md mx-auto shadow-md"/>}
                        </div>
                        <div className='mt-8 flex justify-center'>
                            <button 
                                type='submit'
                                className="bg-violet-600 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:scale-105"
                                disabled={loading || !formik.isValid || !formik.dirty}
                            >
                                {loading ? `${t("adding")}...` : t("add-course")}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Our Courses List Section */}
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
                    <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-8 flex items-center'>
                        <img src={courseImg} alt="Courses Icon" className='w-8 h-8 mr-3' />
                        {t("our-courses")}
                    </h2>

                    {loading && (!courses || courses.length === 0) ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader />
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                            {courses && courses.length > 0 ? (
                                courses.map((course) => (
                                    <div key={course.id} className="relative bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden flex flex-col transform transition-all duration-300 ease-in-out hover:shadow-violet-200 hover:scale-105">
                                        <Link to={`/admin/controlCourse/${course.id}`} className="block">
                                            <img 
                                                src={course.imagePath || courseImg} // Use actual imagePath or fallback
                                                alt={course.title || 'Course Image'} 
                                                className="w-full h-48 object-cover" 
                                            />
                                        </Link>
                                        <div className="p-4 flex flex-col flex-grow">
                                            <Link to={`/admin/courseDetails/${course.id}`} className="block">
                                                <h3 className="text-lg font-bold text-gray-800 mb-1 truncate" title={course.title}>
                                                    {course.title}
                                                </h3>
                                            </Link>
                                            <p className="text-xs text-gray-500 mb-2">ID: {course.id}</p>
                                            <p className="text-sm text-gray-600 mb-2 line-clamp-2 flex-grow" title={course.description}>
                                                {course.description || t("no-description-available")}
                                            </p>
                                            <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                                                <span>{t("level")}: <span className="font-medium text-gray-700">{course.level || 'N/A'}</span></span>
                                                <span>{t("category")}: <span className="font-medium text-gray-700">{course.categoryName || 'N/A'}</span></span>
                                            </div>
                                            <p className="text-xl font-bold text-violet-600 mb-3 text-center">
                                                {course.price ? `${course.price.toFixed(2)} USD` : 'Free'}
                                            </p>
                                        </div>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent Link navigation
                                                handleRemoveCourse(course.id);
                                            }}
                                            title="Delete Course"
                                            className='absolute top-3 right-3 text-red-500 hover:text-red-700 bg-white rounded-full p-2 w-8 h-8 flex items-center justify-center shadow-md hover:bg-red-50 transition-colors duration-200 ease-in-out'
                                        >
                                            <i className="fa-solid fa-trash-alt text-sm"></i>
                                        </button>
                                    </div>
                                ))
                            ) : (   
                                <div className="col-span-full text-center py-10">
                                    <p className='text-gray-600 text-lg'>{t("no-courses-available")}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
        </ContentWrapper>
    </>
}

export default AddCourse
                                           
