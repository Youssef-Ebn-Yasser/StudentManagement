import React, { useEffect, useState } from 'react'
import img from '../../assets/avatar.png'
import axios from 'axios'
import { useFormik } from 'formik'
import addImg from '../../assets/add-group.png'
import teaImg from '../../assets/teachers-day.png'
import teacherImg from '../../assets/teacher.png'
import { useDispatch, useSelector } from 'react-redux'
import {allTeachers} from '@/Redux/features/allTeachers/allTeachers'
import Loader from '../Loader/Loader'
import toast from 'react-hot-toast'
import * as Yup from 'yup';



function AddTeacher() {

    const dispatch= useDispatch()
    const [imagePreview, setImagePreview]= useState(img)
    const [addedTeacher, setAddedTeacher]= useState([])
    const {teachers,loading}= useSelector((state)=>state.allTeachers)
    let [searchItem, setSearchItem]=useState('')
    const [searchType, setSearchType] = useState('name');
    
    const filteredstudent = teachers && teachers.length > 0
      ? teachers.filter ((item)=>{
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


    async function handleRemoveTeacher(id) {
        axios.delete(`https://e-learn-v1.runasp.net/api/Teacher/Teacher/Delete?id=${id}`)
        .then((response)=>{
            console.log(response);
            console.log("Teacher deleted");
            toast.success('Teacher Deleted')
            dispatch(allTeachers())
        }).catch((error)=>{
            console.log(error||'invalid id');
            toast.error('Invalid Id')
        })
        
        
    }
    
    let validationSchema=Yup.object({
        name:Yup.string().required('name is required'),
        email:Yup.string().required('email is required').email('invalid email'),
        password:Yup.string().required('password is required').matches(/^.{6,}$/),
        confirmPassword:Yup.string().required('rePassword is required').oneOf([Yup.ref('password')],'password not match')
    })
    
    let formik = useFormik({
        initialValues:{
            name:'',
            email:'',
            password:'',
            confirmPassword:''
        },
        validationSchema: validationSchema,
        onSubmit:handleAddTeacher
    })

    async function handleAddTeacher(formsData){
        console.log('Added',formsData);

        // const params = new URLSearchParams({
        //     Name: formsData.name,
        //     Email: formsData.email,
        //     Age: formsData.age,
        //     Specialization: formsData.specialization,
        //     Phone: formsData.phone,
        //     Password: formsData.password
        // });

        // 2. Create FormData for the image
        // const formData = new FormData();
        // formData.append("image", formsData.image);
        
        axios.post(`https://e-learn-v1.runasp.net/api/Auth/register/teacher`,formsData 
        ).then((response)=>{
            toast.success('Teacher Added')
            console.log(response);
            setAddedTeacher(response.data.data)
            dispatch(allTeachers())
            
        }).catch((error)=>{
            toast.error(error.response.data.massage)
            console.log(error);
            
        })
    }

    useEffect(()=>{
        dispatch(allTeachers())
    },[])

    return <>
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto space-y-10">
                {/* Add Teacher Form Section */}
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-2xl mx-auto">
                    <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-8 flex items-center justify-center'>
                        <img src={addImg} alt="Add Teacher Icon" className='w-8 h-8 mr-3' />
                        Add New Teacher
                    </h2>
                    <form className='space-y-6' onSubmit={formik.handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className='block text-sm font-medium text-gray-700 mb-1'>Teacher Name <span className='text-red-500'>*</span></label>
                                <input type="text" name="name" id="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                placeholder='Enter Teacher Name'
                                className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 p-3"/>
                                <div>{formik.errors.name && formik.touched.name && <p className='text-red-500'>{formik.errors.name}</p>}</div>
                            </div>
                            <div>
                                <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-1'>Teacher Email <span className='text-red-500'>*</span></label>
                                <input type="email" name="email" id="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                placeholder='Enter Teacher Email'
                                className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 p-3"/>
                                <div>{formik.errors.email && formik.touched.email && <p className='text-red-500'>{formik.errors.email}</p>}</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="password" className='block text-sm font-medium text-gray-700 mb-1'>Password <span className='text-red-500'>*</span></label>
                                <input type="password" name="password" id="password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                placeholder='Enter Password'
                                className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 p-3"/>
                                <div>{formik.errors.password && formik.touched.password && <p className='text-red-500'>{formik.errors.password}</p>}</div>
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className='block text-sm font-medium text-gray-700 mb-1'>Confirm Password <span className='text-red-500'>*</span></label>
                                <input type="password" name="confirmPassword" id="confirmPassword" value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                placeholder='Enter confirmPassword'
                                className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 p-3"/>
                                <div>{formik.errors.confirmPassword && formik.touched.confirmPassword && <p className='text-red-500'>{formik.errors.confirmPassword}</p>}</div>
                            </div>
                        </div>
                        
                        <div className='mt-8 flex justify-center'>
                            <button type='submit'
                            className="bg-violet-600 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:scale-105"
                            >Add Teacher</button>
                        </div>
                    </form>
                </div>

                {/* Our Teachers List Section */}
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
                    <h1 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-8 flex items-center'>
                        <img src={teaImg} alt="Teachers Icon" className='w-8 h-8 mr-3' />
                        Our Teachers
                    </h1>

                    {/* Search Section */}
                    <div className="mb-8 p-4 bg-gray-100 rounded-lg shadow-sm flex flex-col sm:flex-row items-center gap-4">
                        <input 
                            className='flex-grow form-input rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 p-3 w-full sm:w-auto'
                            type="text" 
                            placeholder={`Search teachers by ${searchType}...`} 
                            onChange={(e)=>setSearchItem(e.target.value)}
                        />
                        <select
                            className="form-select rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 py-3 px-4 w-full sm:w-auto"
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}>
                            <option value="name">Name</option>
                            <option value="id">ID</option>
                            <option value="email">Email</option>
                        </select>
                    </div>

                    {/* Teacher List / Search Results */}
                    {loading && (!searchItem || searchItem.length === 0) ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader />
                        </div>
                    ) : (
                        <>
                            {searchItem && searchItem.length > 0 && (
                                <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">
                                    <i className="fa-solid fa-magnifying-glass px-2 text-violet-500"></i>
                                    Search Results
                                </h2>
                            )}

                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                                {(searchItem && searchItem.length > 0 ? filteredstudent : teachers).length > 0 ? (
                                    (searchItem && searchItem.length > 0 ? filteredstudent : teachers).map((teacher) => (
                                        <div 
                                            key={teacher.id} 
                                            className="relative bg-white border border-gray-200 shadow-lg rounded-xl p-4 sm:p-5 text-center flex flex-col items-center transform transition-all duration-300 ease-in-out hover:shadow-violet-200 hover:scale-105"
                                        >
                                            <img 
                                                src={teacher.imagePath || teacherImg} 
                                                alt={teacher.name || 'Teacher'} 
                                                className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-full border-4 border-violet-200 shadow-md mb-4" 
                                            />
                                            <h2 className="text-md font-bold text-gray-800 mb-1 truncate w-full" title={teacher.name}>
                                                {teacher.name}
                                            </h2>
                                            <p className="text-xs text-gray-500 mb-1">ID: {teacher.id}</p>
                                            <p className="text-sm text-violet-600 hover:text-violet-700 hover:underline mb-3 truncate w-full" title={teacher.email}>
                                                <a href={`mailto:${teacher.email}`} target="_blank" rel="noreferrer">
                                                    {teacher.email}
                                                </a>
                                            </p>
                                            {/* You can add specialization or other details here if available and desired */}
                                            {teacher.specialization && <p className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">{teacher.specialization}</p>}
                                            
                                            <button 
                                                onClick={() => handleRemoveTeacher(teacher.id)}
                                                title="Delete Teacher"
                                                className='absolute top-3 right-3 text-red-500 hover:text-red-700 bg-white rounded-full p-2 w-8 h-8 flex items-center justify-center shadow-md hover:bg-red-50 transition-colors duration-200 ease-in-out'
                                            >
                                                <i className="fa-solid fa-trash-alt text-sm"></i> {/* Changed icon to fa-trash-alt for consistency */}
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-10">
                                         {loading && searchItem && searchItem.length > 0 ? (
                                            <Loader />
                                        ) : (
                                            <p className='text-gray-600 text-lg'>
                                                {searchItem && searchItem.length > 0 ? "No matching teachers found." : "No teachers available."}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    </>
}

export default AddTeacher
