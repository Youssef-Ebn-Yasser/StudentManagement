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
                setAuthToken()
                // Redirect based on role
                const isAdmin = response?.payload?.isAdmin;
                const isTeacher = response?.payload?.isTeacher;
                if (isAdmin) {
                    navigate('/admin/dashboard');
                } else if (isTeacher) {
                    navigate('/teacher/profile');
                } else {
                    navigate('/');
                }
            })
            .catch((error) => {
                // Error handling is kept in catch block but without logging
            })
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
