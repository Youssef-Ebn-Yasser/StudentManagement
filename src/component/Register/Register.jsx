import React from 'react'
import { Link } from 'react-router-dom'
import img from '@/assets/studentReg.png'
import logoImg from '@/assets/online-course.png'

function Register() {
    return <>
        <div className='mx-auto flex flex-wrap flex-row justify-cnter items-center'>
            <div className='flex flex-col-reverse  sm:flex-col-reverse  md:flex-col-reverse lg:flex-row justify-between items-center content-center w-[100%] h-full'>
                <div className="welcome mx-auto flex flex-col justify-center items-center gap-10">
                    <div className="img">
                    <img src={logoImg} alt="logoImg" width={'85px'} className='inline-block m-2' /> <span className='text-4xl font-medium'> <span className='text-pink-800 italic text-shadow-lg text-shadow-gray-600'><i class="fa-solid fa-e"></i></span>-learning</span>
                    </div>
                    
                    <div className="userLink flex flex-col md:flex-row gap-3 justify-evenly items-center  rounded-3xl p-1">
                        <Link to={'/auth/studentRegister'} className='bg-blue-700 shadow-lg shadow-blue-300 rounded-3xl py-2 px-3 text-white hover:bg-blue-500 transition-all duration-300 ease'>
                            <button className='hover:cursor-pointer transition-all duration-300 ease'>As a Student</button>
                        </Link>
                        <Link to={'/auth/teacherRegister'} className='bg-blue-700 shadow-lg shadow-blue-300 rounded-3xl py-2 px-3 text-white hover:bg-blue-500 transition-all duration-300 ease'>
                            <button className='hover:cursor-pointer transition-all duration-300 ease'>As a Teacher</button>
                        </Link>
                        <Link to={'/auth/adminRegister'} className='bg-blue-700 shadow-lg shadow-blue-300 rounded-3xl py-2 px-3 text-white hover:bg-blue-500 transition-all duration-300 ease'>
                            <button className='hover:cursor-pointer transition-all duration-300 ease'>As an Admin</button>
                        </Link>
                    </div>
                </div>
                
                <div className="Img  h-[100vh] p-2" > 
                    <img src={img} alt="studentImg" className='max-h-lvh' width={'700px'}/>
                </div>
            </div>
            
        </div>
    </>
}

export default Register
