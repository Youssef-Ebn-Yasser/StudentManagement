import { registerUser } from '@/Redux/auth/registerActions'
import { useFormik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { data, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

const useRegister = (userType) => {
    const dispatch = useDispatch()
    const { loading, error } = useSelector((state) => state.auth || {})

    const navigate = useNavigate()
    const handleGoBack = () => {
        navigate(-1)
    }

    const handleReg = async (formsData) => {
        dispatch(registerUser(
            {
                data: formsData,
                userType: userType,
            }
        ))
            .then((res) => {
                // navigate('/auth/login')
            })
            .catch((error) => {
                console.error('Registration error:', error)
            })
    }

    let validationSchema = Yup.object({
        name: Yup.string()
            .required('name is required')
            .min(3, 'min length is 3')
            .max(10, 'max lenght is 10'),
        email: Yup.string()
            .required('email is required')
            .email('invalid email'),
        password: Yup.string()
            .required('password is required')
            .matches(/^.{6,}$/),
        confirmPassword: Yup.string()
            .required('rePassword is required')
            .oneOf([Yup.ref('password')], 'password not match'),
    })

    let formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: validationSchema,
        onSubmit: handleReg,
    })

    return {
        formik,
        loading,
        error,
        handleGoBack,
        
    }
}

export default useRegister
