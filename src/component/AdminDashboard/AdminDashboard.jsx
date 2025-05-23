import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { allStudent } from '@/Redux/features/allStudents/allStudents'
import {allTeachers} from '@/Redux/features/allTeachers/allTeachers'
import {allCourses} from '@/Redux/features/allCourses/allCourses'
import stuImg from '../../assets/audience.png'
import courseImg from '../../assets/online-lesson.png'
import lessonImg from '../../assets/lesson.png'
import teaImg from '../../assets/teachers-day.png'
import gateImg from '../../assets/gategory.png'
import Loader from '../Loader/Loader'
import studentImg from '../../assets/student.png'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import styles from './AdminDashboard.module.css' // Unused import
import allLessons from '@/Redux/features/allLessons/allLessons'
import allGategory from '@/Redux/features/allGategory/allGategory'

function AdminDashboard() {

    let dispatch= useDispatch()
    const {students,loading}= useSelector((state)=>state.allStudents)
    const {teachers}= useSelector((state)=>state.allTeachers)
    const {courses}= useSelector((state)=>state.allCourses)
    const {lessons}= useSelector((state)=>state.allLessons)
    const {gategory}= useSelector((state)=>state.allGategory)

        useEffect(()=>{
            try {
                dispatch(allStudent())
                dispatch(allTeachers())
                dispatch(allCourses())
                dispatch(allLessons())
                dispatch(allGategory()) // Added dispatch for categories

            } catch (error) {
                console.error("Failed to dispatch actions:", error);
                toast.error('Failed to load dashboard data.');
            }},[dispatch])
           
    

    const overviewCardBaseClasses = 'bg-white my-2 rounded-2xl block text-center transition-all duration-300 ease hover:shadow-violet-300';
    const overviewCardInnerClasses = 'shadow-lg rounded-2xl overflow-hidden cursor-pointer';
    const overviewCardContentClasses = 'font-medium p-4';
    const overviewCardTitleClasses = 'text-xl text-gray-700';
    const overviewCardCountClasses = 'flex items-center justify-center mt-1 text-gray-600';
    const overviewCardIconClasses = 'w-7 h-7 inline ml-2';

    const sectionBaseClasses = 'bg-white transition-all duration-300 ease rounded-2xl shadow-lg p-6 mb-6';
    const sectionTitleClasses = 'text-2xl font-semibold text-gray-700 text-center py-3 mb-4 border-b border-gray-200';
    const sectionGridClasses = 'grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 text-center';
    const itemCardBaseClasses = 'relative shadow rounded-lg p-4 bg-gray-50 hover:text-white transition-all duration-300 ease cursor-pointer group';
    const itemCardIconClasses = 'w-12 h-12 inline-block mb-2';
    const itemCardTitleClasses = 'font-semibold mt-1 text-md text-gray-800 group-hover:text-white';
    const itemCardIdClasses = 'text-sm font-medium text-red-500 group-hover:text-white mt-1';
    const viewMoreButtonClasses = 'cursor-pointer text-md font-medium shadow-md hover:shadow-lg bg-violet-500 text-white hover:bg-violet-600 py-2 px-6 rounded-full hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75 transition-all duration-300 ease';

    return (
    <div className='bg-gray-100 min-h-screen p-4 md:p-6'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>

            {/* Overview Panel */}
            <aside className='lg:col-span-3'>
              <div className="lg:sticky lg:top-6">
                <div className='bg-white shadow-xl rounded-xl p-4'>
                    <h2 className='text-2xl font-semibold text-gray-800 text-center pb-4 mb-4 border-b border-gray-300'>Overview</h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3'>
                        {[
                            { id: "students", title: "Students", count: students?.length, icon: stuImg, alt: "Students overview icon" },
                            { id: "teachers", title: "Teachers", count: teachers?.length, icon: teaImg, alt: "Teachers overview icon" },
                            { id: "courses", title: "Courses", count: courses?.length, icon: courseImg, alt: "Courses overview icon" },
                            { id: "lesson", title: "Lessons", count: lessons?.length, icon: lessonImg, alt: "Lessons overview icon" },
                            { id: "gategory", title: "Categories", count: gategory?.length, icon: gateImg, alt: "Categories overview icon" },
                        ].map(item => (
                            <a key={item.id} href={`#${item.id}`} className={overviewCardBaseClasses}>
                                <div className={overviewCardInnerClasses}>
                                    <div className={overviewCardContentClasses}>
                                        <h3 className={overviewCardTitleClasses}>{item.title}</h3>
                                        <p className={overviewCardCountClasses}>
                                            {loading ? <Loader size="sm" /> : <span className="text-2xl font-semibold text-violet-600">{item.count || 0}</span>}
                                            <img className={overviewCardIconClasses} src={item.icon} alt={item.alt} />
                                        </p>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#6366F1" fillOpacity="0.8" d="M0,224L40,229.3C80,235,160,245,240,229.3C320,213,400,171,480,149.3C560,128,640,128,720,144C800,160,880,192,960,208C1040,224,1120,224,1200,224C1280,224,1360,224,1400,224L1440,224L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path></svg>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className='lg:col-span-9'>
            <section id='students' className={sectionBaseClasses}>
            <h2 className={sectionTitleClasses}>Our Students</h2>
                <div  className={sectionGridClasses}>
                {!loading?
                (
                    <>
                    {students && students.length >0 ?
                    (
                        students.map((student)=>{
                            return(
                                <div key={student.id} className={`${itemCardBaseClasses} hover:bg-indigo-500`}>
                                     <img className={itemCardIconClasses} src={studentImg} alt="Student avatar icon" />
                                    <h3 className={itemCardTitleClasses}>{student.name}</h3>
                                    <p className={itemCardIdClasses}>Id: {student.id}</p>
                                </div>
                            )
                        })
                    ): <p className="col-span-full text-gray-500 py-10">No Students Found</p>
                    }
                    </>
                ): <div className="col-span-full flex justify-center py-10"><Loader /></div>}
                </div>
                <div className='flex flex-row justify-center items-center mt-6'>
                <Link to={'/admin/students'}>
                    <button className={viewMoreButtonClasses}>View More Students</button>
                </Link>
                </div>
            </section>

            <section id='teachers' className={sectionBaseClasses}>
            <h2 className={sectionTitleClasses}>Our Teachers</h2>
                <div  className={sectionGridClasses}>
                {!loading?
                (
                    <>
                    {teachers && teachers.length >0 ?
                    (
                        teachers.map((teacher)=>{
                            return(
                                <div key={teacher.id} className={`${itemCardBaseClasses} hover:bg-green-500`}>
                                     <img className={itemCardIconClasses} src={teaImg} alt="Teacher avatar icon" />
                                    <h3 className={itemCardTitleClasses}>{teacher.name}</h3>
                                    <p className={itemCardIdClasses}>Id: {teacher.id}</p>
                                </div>
                            )
                        })
                    ): <p className="col-span-full text-gray-500 py-10">No Teachers Found</p>
                    }
                    </>
                ): <div className="col-span-full flex justify-center py-10"><Loader /></div>}
                </div>
                <div className='flex flex-row justify-center items-center mt-6'>
                <Link to={'/admin/addteacher'}>
                    <button className={viewMoreButtonClasses}>View More Teachers</button>
                </Link>
                </div>
            </section>

            <section id='courses' className={sectionBaseClasses}>
            <h2 className={sectionTitleClasses}>Our Courses</h2>
                <div  className={sectionGridClasses}>
                {!loading?
                (
                    <>
                    {courses && courses.length >0 ?
                    (
                        courses.map((course)=>{
                            return(
                                <div key={course.id} className={`${itemCardBaseClasses} hover:bg-blue-500`}>
                                     <img className={itemCardIconClasses} src={courseImg} alt="Course icon" />
                                    <h3 className={itemCardTitleClasses}>{course.title}</h3>
                                    <p className={itemCardIdClasses}>Id: {course.id}</p>
                                </div>
                            )
                        })
                    ): <p className="col-span-full text-gray-500 py-10">No Courses Found</p>
                    }
                    </>
                ): <div className="col-span-full flex justify-center py-10"><Loader /></div>}
                </div>
                <div className='flex flex-row justify-center items-center mt-6'>
                <Link to={'/admin/addcourse'}>
                    <button className={viewMoreButtonClasses}>View More Courses</button>
                </Link>
                </div>
            </section>

            <section id='lesson' className={sectionBaseClasses}>
            <h2 className={sectionTitleClasses}>Our Lessons</h2>
                <div  className={sectionGridClasses}>
                {!loading?
                (
                    <>
                    {lessons && lessons.length >0 ?
                    (
                        lessons.map((lesson)=>{
                            return(
                                <div key={lesson.id} className={`${itemCardBaseClasses} hover:bg-sky-500`}>
                                     <img className={itemCardIconClasses} src={lessonImg} alt="Lesson icon" />
                                    <h3 className={itemCardTitleClasses}>{lesson.title}</h3>
                                    <p className={itemCardIdClasses}>Id: {lesson.id}</p>
                                </div>
                            )
                        })
                    ): <p className="col-span-full text-gray-500 py-10">No Lessons Found</p>
                    }
                    </>
                ): <div className="col-span-full flex justify-center py-10"><Loader /></div>}
                </div>
                <div className='flex flex-row justify-center items-center mt-6'>
                <Link to={'/admin/addlesson'}>
                    <button className={viewMoreButtonClasses}>View More Lessons</button>
                </Link>
                </div>
            </section>

            <section id='gategory' className={sectionBaseClasses}>
            <h2 className={sectionTitleClasses}>Our Categories</h2>
                <div  className={sectionGridClasses}>
                {!loading?
                (
                    <>
                    {gategory && gategory.length >0 ?
                    (
                        gategory.map((cat)=>{ // Renamed to avoid conflict with gategory state variable
                            return(
                                <div key={cat.id} className={`${itemCardBaseClasses} hover:bg-purple-500`}>
                                     <img className={itemCardIconClasses} src={gateImg} alt="Category icon" />
                                    <h3 className={itemCardTitleClasses}>{cat.title}</h3>
                                    <p className={itemCardIdClasses}>Id: {cat.id}</p>
                                </div>
                            )
                        })
                    ): <p className="col-span-full text-gray-500 py-10">No Categories Found</p>
                    }
                    </>
                ): <div className="col-span-full flex justify-center py-10"><Loader /></div>}
                </div>
                <div className='flex flex-row justify-center items-center mt-6'>
                <Link to={'/admin/addgategory'}>
                    <button className={viewMoreButtonClasses}>View More Categories</button>
                </Link>
                </div>
            </section>
            </main>
        </div>
    </div>
    )
}

export default AdminDashboard
