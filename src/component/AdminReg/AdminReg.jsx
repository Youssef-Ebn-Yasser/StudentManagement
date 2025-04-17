import React from 'react'
import { Link } from 'react-router-dom'
import img from '../../assets/StudentReg.png'
import {useFormik} from 'formik'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup'


function AdminReg() {

    const navigate= useNavigate()
    const handleGoBack=()=>{
        navigate(-1)
    }

    const handleReg = async(formsData) =>{
        try{
         console.log('Registered',formsData);
         navigate('/auth/login')
 
 
        }catch(error){
         console.log('error',error);
         
        }
            
     }

    let formik= useFormik({
        initialValues:{
            name:'',
            email:'',
            password:'',
            rePassword:'',
            education:'',
            age:0,
            photo:null
        },
        onSubmit:handleReg,
        
    })

    return <>

            <div className='mx-auto flex flex-row flex-wrap justify-cnter items-center'>
            <div className='basis-[100%]'>
                        <i onClick={()=>{handleGoBack()}} className="fa-solid fa-chevron-left text-gray-400 text-3xl mb-3 rounded p-2 hover:cursor-pointer hover:shadow-2xl hover:bg-red-600 hover:text-white transition-all duration-300 ease "></i>
                </div>
                        <div className='flex flex-col-reverse sm:flex-col-reverse md:flex-col-reverse lg:flex-row gap-5 justify-between items-center content-center w-[100%] h-full'>
                            <div className="welcome mx-auto p-2 w-[50%] ">
                                
                            <form onSubmit={formik.handleSubmit} action="#!">
                            <div className="flex flex-col gap-2 ">
                                <div className="mb-3">
                                    <input type="text" className='border-1 border-gray-400 rounded p-2 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease' value={formik.values.name} name="name" onChange={formik.handleChange} onBlur={formik.handleBlur} id="UserName" placeholder="UserName" required/>
                                </div>

                                <div className=" mb-3">
                                    <input type="email" className='border-1 border-gray-400 rounded p-2 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease' value={formik.values.email} name="email" onChange={formik.handleChange} onBlur={formik.handleBlur} id="email" placeholder="name@example.com" required/>
                                </div>

                                <div className=" mb-3">
                                    <input type="password" className='border-1 border-gray-400 rounded p-2 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease' value={formik.values.password} name="password" onChange={formik.handleChange} onBlur={formik.handleBlur} id="password" placeholder="Password" required/>
                                </div>

                                <div className=" mb-3">
                                    <input type="password" className='border-1 border-gray-400 rounded p-2 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease' value={formik.values.rePassword} name="rePassword" onChange={formik.handleChange} onBlur={formik.handleBlur} id="rePassword" placeholder="rePassword" required/>
                                </div>

                                <div className=" mb-3">
                                    <input type="number" className='border-1 border-gray-400 rounded  p-2 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease' value={formik.values.age} name="age" onChange={formik.handleChange} onBlur={formik.handleBlur} id="age" placeholder="age" required/>
                                </div>

                                <div className=" mb-3">
                                    <input type="file" accept='image/*'  className='border-1 border-gray-400 rounded  p-2 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease' value={formik.values.photo} name="photo" onChange={formik.handleChange} onBlur={formik.handleBlur} id="photo" placeholder="photo" required/>
                                </div>

                                <div className=" mb-3">
                                    <input type="text" className='border-1 border-gray-400 rounded  p-2 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease' name="education" value={formik.values.education} onChange={formik.handleChange} onBlur={formik.handleBlur} id="education" placeholder="Education" required/>
                                </div>

                                    <div className=" flex justify-center my-3">
                                        <button className="bg-blue-600 text-white px-6 py-2 rounded text-xl  hover:cursor-pointer hover:shadow-sm hover:shadow-blue-500 transition-all duration-300 ease" type="submit">Register</button>
                                    </div>

                                    <div className="">
                                            <p className="m-0 text-secondary text-center">Already have an account? <Link to={'/auth/login'} href="#!" class="text-blue-600 hover:underline transition-all duration-300 ease">Sign in</Link></p>
                                    </div>
                                </div>
                                </form>

                            </div>
                            
                            <div className="flex justify-center items-center  Img h-[100vh] p-2" > 
                                <img src={img} alt="studentImg" className='max-h-lvh' width={'700px'}/>
                            </div>
                        </div>
                        
            </div>
    </>
}

export default AdminReg
