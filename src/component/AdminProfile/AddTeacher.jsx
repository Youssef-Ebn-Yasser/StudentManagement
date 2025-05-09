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
    
    async function handleAddTeacher(formsData){
        console.log('Added',formsData);
        
        axios.post('https://e-learn-v1.runasp.net/api/Teacher/Teacher/Create', formsData
        ).then((response)=>{
            console.log(response);
            setAddedTeacher(response.data.data)
            toast.success('Teacher Added')
            dispatch(allTeachers())
            
        }).catch((error)=>{
            console.log(error);
            toast.error('Invalid Id')
            
        })
    }

    let formik = useFormik({
        initialValues:{
            name:'',
            email:'',
            age:'',
            additionalInfo:'',
            specialization:'',
            phone:'',
            password:'',
            image:null
        },
        onSubmit:handleAddTeacher
    })

    useEffect(()=>{
        dispatch(allTeachers())
    },[])

    return <>
        <div className="flex flex-col sm:flex-col  md:flex-col lg:flex-col content-center w-[100%] h-full gap-2">
            <h2 className='font-medium text-2xl p-2'><img src={addImg} alt="stuImg" className='w-7 inline m-2' />Add Teacher</h2>
            <form className='mx-auto p-2 w-[50%]' onSubmit={formik.handleSubmit}>
                <div>
                    <label htmlFor="name" className='block'>Teacher Name <span className='text-red-500'>*</span></label>
                    <input type="text" name="name" id="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    placeholder='Enter Teacher Name'
                    className="block border-1 border-gray-200 rounded p-2 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease"/>
                </div>
                <div>
                    <label htmlFor="email">Teacher Email <span className='text-red-500'>*</span></label>
                    <input type="email" name="email" id="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    placeholder='Enter Teacher Email'
                    className="border-1 border-gray-200 rounded p-2 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease"/>
                </div>
                <div>
                    <label htmlFor="age">Teacher Age</label>
                    <input type="number" name="age" id="age" value={formik.values.age} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    placeholder='Enter Teacher Age'
                    className="border-1 border-gray-200 rounded p-2 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease"/>
                </div>
                <div>
                    <label htmlFor="additionalInfo">AdditionalInfo </label>
                    <input type="text" name="additionalInfo" id="additionalInfo" value={formik.values.additionalInfo} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    placeholder='Enter Additional Info'
                    className="border-1 border-gray-200 rounded p-2 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease"/>
                </div>
                <div>
                    <label htmlFor="specialization">Specialization <span className='text-red-500'>*</span></label>
                    <select 
                        name="specialization" 
                        value={formik.values.specialization} 
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
                    <label htmlFor="phone">Phone</label>
                    <input type="tel" name="phone" id="phone" value={formik.values.phone} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    placeholder='Enter Phone Number'
                    className="border-1 border-gray-200 rounded p-2 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease"/>
                </div>
                <div>
                    <label htmlFor="password">Password <span className='text-red-500'>*</span></label>
                    <input type="password" name="password" id="password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    placeholder='Enter Password'
                    className="border-1 border-gray-200 rounded p-2 hover:shadow-lg hover:shadow-gray-400  w-full transition-all duration-300 ease"/>
                </div>
                <div>
                    <label htmlFor="image">Profile Image</label>
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
                <h1 className='font-medium text-2xl'><img src={teaImg} alt="stuImg" className='w-7 inline m-2' />Our Teachers</h1>

                {/* /////////Search Section/////////////////////// */}


                <div className=" p-4 ">
                                <input className='border-1 rounded-3xl border-gray-200 p-2 hover:shadow-lg hover:shadow-gray-400 w-[50%] transition-all duration-300 ease ms-3'
                                type="text" placeholder={`Search teachers by ${searchType}`} onChange={(e)=>setSearchItem(e.target.value)}/>
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
                                filteredstudent.map((teacher, index) => (
                                    <div key={teacher.id} className="relative shadow rounded p-2 bg-white hover:shadow-xl hover:shadow-violet-200 ">
                                        <img src={teacher.imagePath ||teacherImg} alt={teacher.name} className="w-full h-48 object-fill rounded " />
                                        <h2 className="text-lg font-semibold mt-2">teacher Name : {teacher.name}</h2>
                                        <p className="text-lg text-red-500 font-semibold mt-2">Id : {teacher.id}</p>
                                    
                                        <p className="text-gray-500 hover:text-blue-500 hover:underline transition-all duration-300 ease">
                                            <a href={`mailto:${teacher.email}`} 
                                            target='_blank' rel="noreferrer">{teacher.email}</a>
                                        </p>
                                        
                                        <div className='text-red-500 absolute top-5 right-7 bg-white rounded-full p-2 hover:cursor-pointer hover:shadow-2xl hover:shadow-gray-500'>
                                            <button  onClick={()=>{handleRemoveTeacher(teacher.id)}}>
                                                <i className="fa-solid fa-lock hover:cursor-pointer"></i>
                                            </button>
                                        </div>
                                    </div>
                                        ))
                                        ) : (
                                        <p className="text-gray-500 text-center col-span-full">No matching Teachers found.</p>
                                        )}
                                    </>
                                    ) : (
                                    <p className="text-center col-span-full text-gray-500">Loading Teachers...</p>
                                    )}
                                </div>
                                )}
                {/* /////////Search Section/////////////////////// */}

                    <div className='grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-5 p-5 text-center mx-auto hover:cursor-pointer transition-all duration-300 ease'>
                        {!loading?
                        (<>
                            {teachers && teachers.length > 0 ? (
                                teachers.map((teacher) => (
                                <div key={teacher.id} className="relative shadow rounded p-2 bg-white hover:shadow-xl hover:shadow-violet-200 ">
                                    <img src={teacher.imagePath ||teacherImg} alt={teacher.name} className="w-full h-48 object-fill rounded " />
                                    <h2 className="text-lg font-semibold mt-2">teacher Name : {teacher.name}</h2>
                                    <p className="text-lg text-red-500 font-semibold mt-2">Id : {teacher.id}</p>
                                   
                                    <p className="text-gray-500 hover:text-blue-500 hover:underline transition-all duration-300 ease">
                                        <a href={`mailto:${teacher.email}`} 
                                        target='_blank' rel="noreferrer">{teacher.email}</a>
                                    </p>
                                    
                                    <div className='text-red-500 absolute top-5 right-7 bg-white rounded-full p-2 hover:cursor-pointer hover:shadow-2xl hover:shadow-gray-500'>
                                        <button  onClick={()=>{handleRemoveTeacher(teacher.id)}}>
                                            <i className="fa-solid fa-lock hover:cursor-pointer"></i>
                                        </button>
                                    </div>
                                </div>
                                ))
                            ) : (   
                                <p className='text-red-600'>No Teachers available.</p>
                            )}</>
                        ):<Loader/>}
                          
                    </div>
        </div>
        </div>
    </>
}

export default AddTeacher
