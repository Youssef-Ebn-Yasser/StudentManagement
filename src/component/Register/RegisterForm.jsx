import img from '@/assets/studentReg.png'
import useRegister from '@/hooks/auth/useRegister'
import { Link } from 'react-router-dom'
import { FaChalkboardTeacher } from 'react-icons/fa'
import { useState } from 'react'

export default function RegisterForm({ userType }) {
    const { handleGoBack, formik, loading } = useRegister(userType)
    const [passwordVisible, setPasswordVisible] = useState(false)


    return (
        <div className="mx-auto flex flex-row flex-wrap justify-center items-center">
            <div className="basis-[100%]">
                <i
                    onClick={() => {
                        handleGoBack()
                    }}
                    className="fa-solid fa-chevron-left text-gray-400 text-3xl mb-3 rounded p-2 hover:cursor-pointer hover:shadow-2xl hover:bg-red-600 hover:text-white transition-all duration-300 ease "
                ></i>
            </div>
            <div className="flex flex-col-reverse sm:flex-col-reverse md:flex-col-reverse lg:flex-row gap-5 justify-between items-center content-center w-[100%] h-full">
                <div className="welcome mx-auto p-2 w-[50%] ">
                    <form onSubmit={formik.handleSubmit} action="#!">
                        <div className="flex flex-col gap-2 ">
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="border-1 border-gray-400 rounded p-2 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease"
                                    value={formik.values.name}
                                    name="name"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    id="UserName"
                                    placeholder="UserName"
                                    required
                                />
                                {formik.touched.name && formik.errors.name ? (
                                    <div className="text-red-500">{formik.errors.name}</div>
                                ) : (
                                    ''
                                )}
                            </div>
                            <div className="mb-3">
                                <input
                                    type="email"
                                    className="border-1 border-gray-400 rounded p-2 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease"
                                    value={formik.values.email}
                                    name="email"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    id="Email"
                                    placeholder="Email"
                                    required
                                />
                                {formik.touched.email && formik.errors.email ? (
                                    <div className="text-red-500">{formik.errors.email}</div>
                                ) : (
                                    ''
                                )}
                            </div>
                            <div className="mb-3">
                                <div className='relative'>

                                    <input
                                        type={passwordVisible ? 'text' : 'password'}
                                        className="border-1 border-gray-400 rounded p-2 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease"
                                        value={formik.values.password}
                                        name="password"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        id="Password"
                                        placeholder="Password"
                                        required
                                    />
                                    <i
                                    id="showPass"
                                    className={`fas ${
                                        passwordVisible ? 'fa-eye-slash' : 'fa-eye'
                                    } absolute text-2xl right-3 bottom-1/2 transform -translate-y-1 text-gray-500 cursor-pointer`}
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                    ></i>
                                </div>
                                    {formik.touched.password && formik.errors.password ? (
                                        <div className="text-red-500">{formik.errors.password}</div>
                                    ) : (
                                        ''
                                    )}
                            </div>
                            
                            <div className="mb-3">
                                <div className='relative'>
                                    <input
                                        type={passwordVisible ? 'text' : 'password'}
                                        className="border-1 border-gray-400 rounded p-2 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease"
                                        value={formik.values.confirmPassword}
                                        name="confirmPassword"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        id="ConfirmPassword"
                                        placeholder="Confirm Password"
                                        required
                                    />
                                    <i
                                    id="showPass"
                                    className={`fas ${
                                        passwordVisible ? 'fa-eye-slash' : 'fa-eye'
                                    } absolute text-2xl right-3 bottom-1/2 transform -translate-y-1 text-gray-500 cursor-pointer`}
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                    ></i>
                                </div>
                               {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                    <div className="text-red-500">{formik.errors.confirmPassword}</div>
                                ) : (
                                    ''
                                )}
                            </div>
                            <div className="mb-3">
                                <button
                                    type="submit"
                                    className="bg-blue-700 text-white w-full p-2 rounded hover:bg-blue-500 transition-all duration-300 ease"
                                    disabled={loading}
                                >
                                    {loading ? 'Loading...' : 'Register'}
                                </button>
                            </div>
                            {userType === 'student' && (
                                <div className="mb-3">
                                    <Link
                                        to="/become-teacher"
                                        className="flex items-center justify-center gap-2 bg-green-600 text-white w-full p-2 rounded hover:bg-green-500 transition-all duration-300 ease"
                                    >
                                        <FaChalkboardTeacher />
                                        Become a Teacher
                                    </Link>
                                </div>
                            )}
                            <div className="">
                                <p className="m-0 text-secondary text-center">
                                    Already have an account?{' '}
                                    <Link
                                        to={'/auth/login'}
                                        className="text-blue-600 hover:underline transition-all duration-300 ease"
                                    >
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="flex justify-center items-center  Img h-[100vh] p-2">
                    <img
                        src={img}
                        alt="studentImg"
                        className="max-h-lvh"
                        width={'700px'}
                    />
                </div>
            </div>
        </div>
    )
}
