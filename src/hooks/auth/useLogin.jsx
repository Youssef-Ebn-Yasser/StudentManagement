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
        .unwrap()
            .then(() => {
                setAuthToken()
                navigate('/')
            })
            .catch((error) => {
                // Error handling is kept in catch block but without logging

            })
    }

    let validationSchema = Yup.object({
        email: Yup.string()
            .required('email is required')
            .email('invalid email'),
        password: Yup.string()
            .required('password is required')
            .matches(/^.{6,}$/),
    })

    let formik = useFormik({
        initialValues: {
            email: '',
            password: '',
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
