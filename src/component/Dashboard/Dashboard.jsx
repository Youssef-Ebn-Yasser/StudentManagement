import React, { use, useEffect } from 'react'
import img1 from '../../assets/online-course.png'
import img2 from '../../assets/online-course.png'
import img3 from '../../assets/online-course.png'
import { useDispatch, useSelector } from 'react-redux'
import styles from './Dashboard.module.css';
import { getUserDetails } from '@/Redux/features/GetUserDetails/userDetailsSlice'
import { Link } from 'react-router-dom';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
  } from 'recharts';
  
  const data = [
    { name: 'Mo', uv: 200 },
    { name: 'Tu', uv: 300 },
    { name: 'We', uv: 350 },
    { name: 'Th', uv: 350 },
    { name: 'Sr', uv: 400 },
    { name: 'Su', uv: 500 },
  ];
  


function Dashboard() {

    let dispatch= useDispatch()
    let {userData,loading,error}= useSelector((state)=>state.userDetails)
    console.log(userData);
    
  
    useEffect(()=>{
      dispatch(getUserDetails())
    },[])

    return <>
        <div className='grid lg:grid-cols-3  md:grid-cols-3  sm:grid-col-1  gap-3 mt-18 mb-5 mx-5'>
    
            <div className='col-span-2 shadow-xl shadow-gray-400 p-3 rounded-2xl'>
                <h2 className='text-2xl font-bold py-5'>Welcome back, {userData?.data.name}</h2>
                <div className='grid md:grid-cols-3 sm:grid-cols-1 gap-3 '>
                    <div className='grid grid-flow-col grid-rows-3 bg-[#458DE8] rounded-2xl text-white p-4 text-xl'>
                        <div>
                            <i className="fa-brands fa-youtube text-3xl"></i>&nbsp; Courses Enrolled
                        </div>
                        <p className='px-5 text-3xl'>5</p>
                    </div>
                    <div className='grid grid-flow-col grid-rows-3 bg-[#7D5CE3] rounded-2xl text-white p-4 text-xl'>
                        <div>
                            <i className="fa-solid fa-chart-line text-3xl"></i>&nbsp; Active Courses
                        </div>
                        <p className='px-5 text-3xl'>3</p>
                    </div>
                    <div className='grid grid-flow-col grid-rows-3 bg-[#4BBC94] rounded-2xl text-white p-4 text-xl'>
                        <div>
                            <i className="fa-solid fa-clock text-3xl"></i>&nbsp; Hours Learned
                        </div>
                        <p className='px-5 text-3xl'>18</p>
                    </div>
                </div>

            </div>
            <div className='col-span-1 w-[100%] shadow-xl shadow-gray-400 rounded-2xl'>
                <h2 className='text-2xl font-bold p-5'>Progress</h2>
                <ResponsiveContainer height={300} className='text-center w-full'>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                </LineChart>
                </ResponsiveContainer>
            </div>
            <div className='col-span-2 shadow-xl shadow-gray-400 p-3 rounded-2xl'>
                <div className="title flex justify-between py-5">
                    <h2 className='text-2xl font-bold '>Current Courses</h2>
                    <p className='text-xl text-gray-400 hover:underline transition-all duration-300 ease'><Link>View All</Link></p>
                </div>
                
                <div className='grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-3 '>

                    <Link>
                        <div className='rounded-2xl p-4 text-xl shadow shadow-gray-400 hover:shadow-2xl transition-all duration-300 ease'>
                            <img src={img1} alt="Programming course" width={'100%'} height={'100px'}/>
                            <h3 className='lg:font-bold md:font-medium sm:font-medium lg:text-lg md:text-lg sm:text-xl'>Introduction to Programming</h3>
                            <p className='text-gray-500'>6/10 Lessons</p>
                            <progress className={styles.progress } value='60' max='100'/>
                        </div>
                    </Link>
                    
                    <Link>
                        <div className='rounded-2xl p-4 text-xl shadow shadow-gray-400 hover:shadow-2xl transition-all duration-300 ease'>
                            <img src={img2} alt="Programming course" width={'100%'} height={'100px'}/>
                            <h3 className='lg:font-bold md:font-medium sm:font-medium lg:text-lg md:text-lg sm:text-sm'>Data Science Fundamentals</h3>
                            <p className='text-gray-500'>4/12 Lessons</p>
                            <progress className={styles.progress} value='35' max='100'/>
                        </div>
                    </Link>
                    
                    <Link>
                        <div className='rounded-2xl p-4 text-xl shadow shadow-gray-400 hover:shadow-2xl transition-all duration-300 ease'>
                            <img src={img3} alt="Programming course" width={'100%'} height={'100px'}/>
                            <h3 className='lg:font-bold md:font-medium sm:font-medium lg:text-lg md:text-lg sm:text-sm'>Graphic Design Basics</h3>
                            <p className='text-gray-500'>8/10 Lessons</p>
                            <progress className={styles.progress} value='85' max='100'/>
                        </div>
                    </Link>
                    
                    <Link>
                        <div className='rounded-2xl p-4 text-xl shadow shadow-gray-400 hover:shadow-2xl transition-all duration-300 ease'>
                            <img src={img3} alt="Programming course" width={'100%'} height={'100px'}/>
                            <h3 className='lg:font-bold md:font-medium sm:font-medium lg:text-lg md:text-lg sm:text-sm'>Graphic Design Basics</h3>
                            <p className='text-gray-500'>8/10 Lessons</p>
                            <progress className={styles.progress} value='85' max='100'/>
                        </div>    
                    </Link>
                    
                </div>

            </div>

            <div className='shadow-xl shadow-gray-400 px-3 rounded-2xl w-full col-span-1'>
                <h2 className='font-bold lg:text-2xl md:text-xl sm:text-xl py-5'>Registered students</h2>
                <div className='py-3 px-5 w-[100%]'>
                    <ul className="list-disc marker:text-yellow-500">
                        <div className=''>
                            <li className='text-xl'>Hadeer Emad Mohamed</li>
                            <span className='text-gray-900'><span className='text-xl text-gray-600'>Enrolled Course: </span>Javascript OOP</span>
                        </div>
                        <div className=''>
                            <li className='text-xl'>Hadeer Emad Mohamed</li>
                            <span className='text-gray-900'><span className='text-xl text-gray-600'>Enrolled Course: </span>Javascript OOP</span>
                        </div>
                        <div className=''>
                            <li className='text-xl'>Hadeer Emad Mohamed</li>
                            <span className='text-gray-900'><span className='text-xl text-gray-600'>Enrolled Course: </span>Javascript OOP</span>
                        </div>
                        
                    </ul>
                </div>
            
            </div>
            
           

        </div>
    
    </>
}

export default Dashboard
