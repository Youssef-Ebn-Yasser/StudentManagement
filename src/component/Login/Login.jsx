import img from '@/assets/studentReg.png'
import useLogin from '@/hooks/auth/useLogin'
import { Link } from 'react-router-dom'
import Loader from '../Loader/Loader'
import { useState } from 'react'

function Login() {
    const { loading, formik, error, handleGoBack } = useLogin()
    const [passwordVisible, setPasswordVisible] = useState(false)


    return (
        <>
            <div className="mx-auto flex flex-row flex-wrap justify-center items-center">
                <div className="basis-[100%]">
                    <i
                        onClick={() => {
                            handleGoBack()
                        }}
                        className="fa-solid fa-chevron-left text-gray-400 text-3xl mb-3 rounded p-2 hover:cursor-pointer hover:shadow-2xl hover:bg-red-600 hover:text-white transition-all duration-300 ease "
                    ></i>
                </div>
                <div className="flex flex-col-reverse  sm:flex-col-reverse  md:flex-col-reverse lg:flex-row justify-between items-center content-center w-[100%] h-full">
                    <div className="welcome  mx-auto p-2 w-[50%] ">
                        <form onSubmit={formik.handleSubmit}>
                            <div className="flex flex-col gap-2 ">
                                <div className=" mb-3">
                                    <input
                                        type="email"
                                        className="border-1 border-gray-400 rounded p-2 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease"
                                        value={formik.values.Email}
                                        name="Email"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        id="Email"
                                        placeholder="Enter your email"
                                        required
                                    />
                                    {formik.touched.Email &&
                                    formik.errors.Email ? (
                                        <div className="text-red-500">
                                            {formik.errors.Email}
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </div>

                                <div className="mb-3">
                                    <div className='relative'>
                                        <input
                                             type={passwordVisible ? 'text' : 'password'}
                                             className="border-1 border-gray-400 rounded p-2 pr-10 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease"
                                             value={formik.values.Password}
                                            name="Password"
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
                                            } absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer`}
                                            onClick={() => setPasswordVisible(!passwordVisible)}
                                        ></i>
                                    </div>
                                    
                                    {formik.touched.Password &&
                                    formik.errors.Password ? (
                                        <div className="text-red-500">
                                            {formik.errors.Password}
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                    <button className="text-gray-400 hover:cursor-pointer hover:underline transition-all duration-300 ease">
                                        <Link to={'/auth/forgetpassword'}>
                                            Forget my password?
                                        </Link>
                                    </button>
                                </div>

                                <div className=" flex justify-center my-3">
                                    <button
                                        className="bg-blue-600 text-white px-6 py-2 rounded text-xl  hover:cursor-pointer hover:shadow-sm hover:shadow-blue-500 transition-all duration-300 ease"
                                        type="submit"
                                    >
                                        {loading ? <Loader /> : 'Login'}
                                    </button>
                                </div>

                                <div className="">
                                    <p className="m-0 text-secondary text-center">
                                        Not Register Yet?{' '}
                                        <Link
                                            to={'/auth/register'}
                                            className="text-blue-600 hover:underline transition-all duration-300 ease"
                                        >
                                            Sign up
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
                            className="max-h-lvh  "
                            width={'700px'}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
