import { setAuthToken } from '@/helpers/auth'
import { loginUser } from '@/Redux/auth/loginActions'
import { useFormik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

const useLogin = () => {
    const navigate = useNavigate()
    const handleGoBack = () => {
        navigate(-1)
    }

    const dispatch = useDispatch()
    const loginState = useSelector((state) => state.auth)
    const loading = loginState?.loading
    const error = loginState?.error

    const handleLgin = async (formsData) => {
        dispatch(loginUser(formsData))
            .then((response) => {
                // Only redirect if login is successful and user/token exists
                if (response?.payload?.user && response?.payload?.token) {
                    setAuthToken();
                    const isAdmin = response?.payload?.isAdmin;
                    const isTeacher = response?.payload?.isTeacher;
                    if (isAdmin) {
                        navigate('/admin/dashboard');
                    } else if (isTeacher) {
                        navigate('/teacher/profile');
                    } else {
                        navigate('/');
                    }
                }
                // If not, do nothing (error will be shown by error state)
            })
            .catch((error) => {
                // Do not redirect on error
            });
    }

    let validationSchema = Yup.object({
        Email: Yup.string()
            .required('email is required')
            .email('invalid email'),
        Password: Yup.string()
            .required('password is required')
            .matches(/^.{6,}$/),
    })

    let formik = useFormik({
        initialValues: {
            Email: '',
            Password: '',
        },
        validationSchema: validationSchema,
        onSubmit: handleLgin,
    })

    return {
        formik,
        loading,
        error,
        handleGoBack,
    }
}

export default useLogin
