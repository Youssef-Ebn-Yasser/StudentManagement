import img from '@/assets/studentReg.png'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { resetPassword } from '../../services/auth'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

function ResetPassword() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        email: '',
        token: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const email = searchParams.get('email');
        const token = searchParams.get('token');
        if (email && token) {
            setFormData(prev => ({ ...prev, email, token }));
        } else {
            toast.error(t('invalid-reset-link'));
            navigate('/auth/forgetpassword');
        }
    }, [searchParams, navigate, t]);

    const handleGoBack = () => {
        navigate(-1);
    };

    const validatePassword = (password) => {
        if (password.length < 6) return t('password-min-length');
        if (!/(?=.*[a-z])/.test(password)) return t('password-lowercase');
        if (!/(?=.*[A-Z])/.test(password)) return t('password-uppercase');
        if (!/(?=.*\d)/.test(password)) return t('password-number');
        if (!/(?=.*[!@#$%^&*])/.test(password)) return t('password-special');
        return '';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'newPassword') {
            setPasswordError(validatePassword(value));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error(t('passwords-not-match'));
            return;
        }
        if (passwordError) {
            toast.error(passwordError);
            return;
        }
        setLoading(true);
        try {
            const response = await resetPassword({
                email: formData.email,
                token: formData.token,
                newPassword: formData.newPassword
            });
            if (response.succeeded) {
                toast.success(t('password-reset-success'));
                navigate('/auth/login');
            } else {
                toast.error(response.message || t('password-reset-failed'));
            }
        } catch (error) {
            console.error('Reset password error:', error);
            toast.error(error.response?.data?.message || t('password-reset-error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="mx-auto flex flex-row flex-wrap justify-center items-center">
                <div className="basis-[100%]">
                    <i
                        onClick={handleGoBack}
                        className="fa-solid fa-chevron-left text-gray-400 text-3xl mb-3 rounded p-2 hover:cursor-pointer hover:shadow-2xl hover:bg-red-600 hover:text-white transition-all duration-300 ease "
                    ></i>
                </div>
                <div className="flex flex-col-reverse sm:flex-col-reverse md:flex-col-reverse lg:flex-row justify-between items-center content-center w-[100%] h-full">
                    <div className="welcome mx-auto p-2 w-[50%] ">
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-2 ">
                                <div className="mb-3">
                                    <input
                                        type="email"
                                        className="border-1 border-gray-400 rounded p-2 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease"
                                        name="email"
                                        id="email"
                                        placeholder="name@example.com"
                                        value={formData.email}
                                        disabled
                                    />
                                </div>
                                <div className="mb-3 relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        className="border-1 border-gray-400 rounded p-2 pr-10 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease"
                                        name="newPassword"
                                        id="newPassword"
                                        placeholder={t('new-password')}
                                        value={formData.newPassword}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <i
                                        className={`fa-solid ${showNewPassword ? 'fa-eye' : 'fa-eye-slash'} absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer`}
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    ></i>
                                    {passwordError && (
                                        <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                                    )}
                                </div>
                                <div className="mb-3 relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        className="border-1 border-gray-400 rounded p-2 pr-10 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease"
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        placeholder={t('confirm-password')}
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <i
                                        className={`fa-solid ${showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'} absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer`}
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    ></i>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || !!passwordError}
                                    className='bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-all duration-300 ease disabled:bg-gray-400 disabled:cursor-not-allowed'
                                >
                                    {loading ? t('resetting') : t('reset-password')}
                                </button>
                            </div>
                        </form>
                        <div className='text-center mt-4'>
                            <Link to="/auth/login" className='text-red-600 hover:text-red-700 transition-all duration-300 ease'>
                                {t('back-to-login')}
                            </Link>
                        </div>
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

export default ResetPassword 