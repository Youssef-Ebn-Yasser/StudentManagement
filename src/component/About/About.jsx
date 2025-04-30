import React from 'react'
import img2 from '../../assets/study.png'
import CategorySlider from '../CategorySlider/CategorySlider';

export default function About() {
  return (
    <>
      <div className='p-4 flex flex-col gap-20'>
        <div className="flex flex-col justify-center items-center title text-center">
          <h1 className='font-bold text-3xl text-blue-950 '>ABOUT E-LEARNING</h1>
          <p className='text-xl text-gray-700 md:max-w-xl lg:max-w-xl sm:max-w-full '>
            Empowering learners worldwide with flexible, accessible, and engaging online education
          </p>
        </div>
  
        <div className='grid md:grid-cols-2 lg:grid-cols-2 sm:grid-cols-1 gap-4'>
          <div className='flex flex-col flex-wrap md:items-start lg:items-start sm:items-center justify-center'>
            <h2 className='font-bold text-3xl text-blue-950 py-3'>Our Story</h2>
            <p className='text-lg text-gray-700 max-w-xl'>
            E-Learning is a global education platform dedicated to transforming traditional learning through innovative digital experiences. We connect passionate educators with motivate learners to create a dynamic, interactive, and inclusive online learning environment.
            Our Mission is To provide top-quality, affordable education to anyone, anywhere. We aim to break down barriers by offering flexible courses, multilingual support, and a user-friendly platform accessible from any device.
            Our instructors are industry experts and certified educators from around the globe, selected for their teaching excellence and real-world experience.
            </p>
          </div>
          <div className='flex flex-row flex-wrap items-center justify-center'>
            <img src={img2} alt="student" width={'80%'} />
          </div>
        </div>

        <div className='grid md:grid-cols-4 lg:grid-cols-4 sm:grid-cols-1 gap-4 text-center'>
          <div className='border-1 border-gray-500 p-2 rounded-xl shadow-xl'>
            <span><i className="fa-solid fa-building-columns border-4 border-gray-100 shadow-lg shadow-gray-300 p-2 rounded-2xl text-white bg-[#545AE8] text-2xl hover:text-[#545AE8] hover:bg-white hover:cursor-pointer transition-all duration-300 ease"></i></span>
            <p className='font-bold text-2xl py-3'>10.5k </p>
            <p className='text-lg'>Educational institutions partnered with us.</p>

          </div>
          <div className='border-1 border-gray-500 p-2 rounded-xl shadow-xl'>
            <span><i className="fa-solid fa-chalkboard-user border-4 border-gray-100 shadow-lg shadow-gray-300 p-2 rounded-2xl text-white bg-[#545AE8] text-2xl hover:text-[#545AE8] hover:bg-white hover:cursor-pointer transition-all duration-300 ease"></i></span>
            <p className='font-bold text-2xl py-3'>33k </p>
            <p className='text-lg'>Qualified instructors sharing their expertise.</p>
          </div>
          <div className='border-1 border-gray-500 p-2 rounded-xl shadow-xl'>
            <span><i className="fa-solid fa-clock border-4 border-gray-100 shadow-lg shadow-gray-300 p-2 rounded-2xl text-white bg-[#545AE8] text-2xl hover:text-[#545AE8] hover:bg-white hover:cursor-pointer transition-all duration-300 ease"></i></span>
            <p className='font-bold text-2xl py-3'>65.5k </p>
            <p className='text-lg'>Hours of quality educational content delivered.</p>
          </div>
          <div className='border-1 border-gray-500 p-2 rounded-xl shadow-xl'>
            <span><i className="fa-solid fa-sack-dollar border-4 border-gray-100 shadow-lg shadow-gray-300 p-2 rounded-2xl text-white bg-[#545AE8] text-2xl hover:text-[#545AE8] hover:bg-white hover:cursor-pointer transition-all duration-300 ease"></i></span>
            <p className='font-bold text-2xl py-3'>25.5k </p>
            <p className='text-lg'>Courses purchased and enjoyed by learners.</p>
          </div>
        </div>

        <div className="px-4"> 
          <CategorySlider/>
        </div>

        <div className='grid md:grid-cols-3 lg:grid-cols-3 sm:grid-cols-1 gap-4 text-center'>
          <div>
            <span>
            <i class="fa-regular fa-face-grin-squint border-4 border-gray-100 shadow-lg shadow-gray-300 p-2 rounded-3xl text-white bg-[#545AE8] text-2xl hover:text-[#545AE8] hover:bg-white hover:cursor-pointer transition-all duration-300 ease"></i>
            </span>
            <p className='font-bold text-2xl py-3'>User Satisfication</p>
            <p className='text-lg'>More than 95% of learners are happy with our platform and courses.</p>

          </div>
          <div>
            <span><i className="fa-solid fa-headset border-4 border-gray-100 shadow-lg shadow-gray-300 p-2 rounded-3xl text-white bg-[#545AE8] text-2xl hover:text-[#545AE8] hover:bg-white hover:cursor-pointer transition-all duration-300 ease"></i></span>
            <p className='font-bold text-2xl py-3'>24/7 Support </p>
            <p className='text-lg'>We respond to questions and complaints quickly to keep users supported.</p>

          </div>
          
         
          <div>
            <span><i className="fa-solid fa-check border-4 border-gray-200 shadow-lg shadow-gray-400  p-2 rounded-3xl text-white bg-[#545AE8] text-2xl hover:text-[#545AE8] hover:bg-white hover:cursor-pointer transition-all duration-300 ease"></i></span>
            <p className='font-bold text-2xl py-3'>High Success Rate</p>
            <p className='text-lg'>Thousands of learners have completed courses and achieved their goals.</p>
          </div>
        </div>

      </div>
    </>
  );
  
}
