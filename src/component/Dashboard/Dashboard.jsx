import React from 'react'
import img1 from '../../assets/online-course.png'
import img2 from '../../assets/online-course.png'
import img3 from '../../assets/online-course.png'
import styles from './Dashboard.module.css';
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
    return <>
        <div className='grid  md:grid-cols-[minmax(800px,_1fr)_400px] sm:grid-cols-1 md:grid-rows-2 gap-3 mt-18 mb-5 mx-5'>

            <div className='shadow-xl shadow-gray-400 p-3 rounded-2xl'>
                <h2 className='text-2xl font-bold py-5'>Welcome back, Hadeer</h2>
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
            <div className='shadow-xl shadow-gray-400 rounded-2xl'>
                <h2 className='text-2xl font-bold p-5'>Progress</h2>
                <ResponsiveContainer width="100%" height={300} className='text-center '>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                </LineChart>
                </ResponsiveContainer>
            </div>
            <div className='shadow-xl shadow-gray-400 p-3 rounded-2xl'>
                <div className="title flex justify-between py-5">
                    <h2 className='text-2xl font-bold '>Current Courses</h2>
                    <p className='text-xl text-gray-400 hover:underline transition-all duration-300 ease'><Link>View All</Link></p>
                </div>
                
                <div className='grid md:grid-cols-4 sm:grid-cols-1 gap-3 '>

                    <div className='rounded-2xl p-4 text-xl shadow shadow-gray-400'>
                        <img src={img1} alt="Programming course" width={'100%'} height={'100px'}/>
                        <h3 className='font-bold text-2xl'>Introduction to Programming</h3>
                        <p className='text-gray-500'>6/10 Lessons</p>
                        <progress className={styles.progress } value='60' max='100'/>
                    </div>
                    <div className='rounded-2xl p-4 text-xl shadow shadow-gray-400'>
                        <img src={img2} alt="Programming course" width={'100%'} height={'100px'}/>
                        <h3 className='font-bold text-2xl'>Data Science Fundamentals</h3>
                        <p className='text-gray-500'>4/12 Lessons</p>
                        <progress className={styles.progress} value='35' max='100'/>
                    </div>
                    <div className='rounded-2xl p-4 text-xl shadow shadow-gray-400'>
                        <img src={img3} alt="Programming course" width={'100%'} height={'100px'}/>
                        <h3 className='font-bold text-2xl'>Graphic Design Basics</h3>
                        <p className='text-gray-500'>8/10 Lessons</p>
                        <progress className={styles.progress} value='85' max='100'/>
                    </div>
                    <div className='rounded-2xl p-4 text-xl shadow shadow-gray-400'>
                        <img src={img3} alt="Programming course" width={'100%'} height={'100px'}/>
                        <h3 className='font-bold text-2xl'>Graphic Design Basics</h3>
                        <p className='text-gray-500'>8/10 Lessons</p>
                        <progress className={styles.progress} value='85' max='100'/>
                    </div>
                </div>

            </div>

            <div className='shadow-xl shadow-gray-400 px-3 rounded-2xl'>
                <h2 className='text-2xl font-bold py-5'>Registered students</h2>
                <div className='py-3 px-5'>
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
