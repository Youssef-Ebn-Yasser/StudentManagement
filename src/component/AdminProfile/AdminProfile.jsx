import React, { useEffect, useState } from 'react'
import img from '../../assets/teacherEx.png'
import axios from 'axios'
import teaImg from '../../assets/teachers-day.png'
import stuImg from '../../assets/audience.png'
import gateImg from '../../assets/gategory.png'
import courseImg from '../../assets/online-lesson.png'
import profilePhoto from '../../assets/wallpaperflare.jpg'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { allStudent } from '@/Redux/features/allStudents/allStudents'
import { allTeachers } from '@/Redux/features/allTeachers/allTeachers'
import { allCourses } from '@/Redux/features/allCourses/allCourses'
import toast from 'react-hot-toast'
import Loader from '../Loader/Loader'
import { useTranslation } from 'react-i18next'
import ContentWrapper from '../ContentWrapper/ContentWrapper'


function AdminProfile() {

    const { t } = useTranslation();
    let dispatch = useDispatch()
    const [adminData, setAdminData] = useState(null)
    const [loading, setLoading] = useState(true)

    const { students } = useSelector((state) => state.allStudents)
    const { teachers } = useSelector((state) => state.allTeachers)
    const { courses } = useSelector((state) => state.allCourses)
    const { user } = useSelector((state) => state.auth)

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const adminId = localStorage.getItem('adminId')
                if (adminId) {
                    const response = await axios.get(`https://e-learn-v1.runasp.net/api/Admin/Admin/ById/${adminId}`)
                    setAdminData(response.data.data)
                }
                setLoading(false)
            } catch (error) {
                console.error('Error fetching admin data:', error)
                setLoading(false)
            }
        }

        fetchAdminData()
        dispatch(allStudent())
        dispatch(allTeachers())
        dispatch(allCourses())
    }, [dispatch])

    return (
        <>
        {loading && <Loader visible={loading} />}
        <ContentWrapper $loading={loading}>
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="relative">
                        <img src={profilePhoto} alt="cover" className="w-full h-64 object-cover" />
                    </div>

                    <div className="relative py-8 px-8">
                        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
                            <img src={img} alt="adminImg" className="w-48 h-48 rounded-full border-4 border-white shadow-xl" />
                        </div>
                        <div className="mt-20 text-center">
                            <h1 className="text-3xl font-bold text-gray-800">{adminData?.name || user?.name || 'Admin'}</h1>
                            <p className="text-gray-600 mt-2">E-learning Admin Owner</p>
                            {adminData?.nationalId && (
                                <p className="text-gray-500 mt-1">{t("national-id")}: {adminData.nationalId}</p>
                            )}
                        </div>

                        <div className="mt-6 flex justify-center space-x-4">
                            <div className="flex items-center">
                                <img src={stuImg} alt="stuImg" className="w-6 h-6 mr-2" />
                                <span className="text-indigo-500 font-medium text-lg">
                                    {!loading ? <>{students && students.length}</> : <Loader />} {t('Students')}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <img src={teaImg} alt="teaImg" className="w-6 h-6 mr-2" />
                                <span className="text-indigo-500 font-medium text-lg">
                                    {!loading ? <>{teachers && teachers.length}</> : <Loader />} {t('Teachers')}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <img src={courseImg} alt="courseImg" className="w-6 h-6 mr-2" />
                                <span className="text-indigo-500 font-medium text-lg">
                                    {!loading ? <>{courses && courses.length}</> : <Loader />} {t('Courses')}
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <div className="flex justify-center space-x-6">
                                <a href="#" className="text-gray-400 hover:text-indigo-500"><i className="fab fa-facebook-f text-2xl"></i></a>
                                <a href="#" className="text-gray-400 hover:text-indigo-500"><i className="fab fa-github text-2xl"></i></a>
                                <a href="#" className="text-gray-400 hover:text-indigo-500"><i className="fab fa-linkedin-in text-2xl"></i></a>
                                <a href="#" className="text-gray-400 hover:text-indigo-500"><i className="fab fa-instagram text-2xl"></i></a>
                                <a href="#" className="text-gray-400 hover:text-indigo-500"><i className="fab fa-twitter text-2xl"></i></a>
                            </div>
                        </div>
                    </div>

                    <div className="py-8 px-8 border-t border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t("about-me")} </h2>
                        <p className="text-gray-600 text-lg">
                        {t("admin-description")}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-8 px-8">
                    
                        <Link to="/admin/addteacher" className="bg-indigo-50 hover:bg-indigo-100 rounded-lg p-6 text-center transition-colors duration-300">
                            <img src={teaImg} alt="teaImg" className="w-12 h-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-indigo-600">{t('add-teacher')} </h3>
                        </Link>
                        <Link to="/admin/addgategory" className="bg-indigo-50 hover:bg-indigo-100 rounded-lg p-6 text-center transition-colors duration-300">
                            <img src={gateImg} alt="gateImg" className="w-12 h-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-indigo-600">{t('add-category')}</h3>
                        </Link>
                        <Link to="/admin/addcourse" className="bg-indigo-50 hover:bg-indigo-100 rounded-lg p-6 text-center transition-colors duration-300">
                            <img src={courseImg} alt="courseImg" className="w-12 h-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-indigo-600">{t('add-course')}</h3>
                        </Link>
                        <Link to="/admin/students" className="bg-indigo-50 hover:bg-indigo-100 rounded-lg p-6 text-center transition-colors duration-300">
                            <img src={stuImg} alt="stuImg" className="w-12 h-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-indigo-600">{t('Students')}</h3>
                        </Link>
                        <Link to="/admin/reg-admin" className="bg-indigo-50 hover:bg-indigo-100 rounded-lg p-6 text-center transition-colors duration-300">
                            <img src={stuImg} alt="stuImg" className="w-12 h-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-indigo-600">Add Admin</h3>
                        </Link>
                        <Link to="/admin/all-admins" className="bg-indigo-50 hover:bg-indigo-100 rounded-lg p-6 text-center transition-colors duration-300">
                            <img src={stuImg} alt="stuImg" className="w-12 h-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-indigo-600">All Admins</h3>
                        </Link>
                        <Link to="/admin/reports" className="bg-indigo-50 hover:bg-indigo-100 rounded-lg p-6 text-center transition-colors duration-300">
                            <img src={gateImg} alt="reportImg" className="w-12 h-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-indigo-600">Reports</h3>
                        </Link>
                        <Link to="/admin/addslider" className="bg-indigo-50 hover:bg-indigo-100 rounded-lg p-6 text-center transition-colors duration-300">
                            <img src={gateImg} alt="reportImg" className="w-12 h-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-indigo-600">Add Slider</h3>
                        </Link>
                        <Link to="/attendance" className="bg-indigo-50 hover:bg-indigo-100 rounded-lg p-6 text-center transition-colors duration-300">
                            <img src={gateImg} alt="reportImg" className="w-12 h-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-indigo-600">Take Attendance</h3>
                        </Link>
                        
                    </div>
                </div>
            </div>
        </div>
        </ContentWrapper>
        </>
        
    );
}

export default AdminProfile
