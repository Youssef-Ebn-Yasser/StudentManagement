import React, { useState } from 'react'
import { useFormik } from 'formik'
import axios from 'axios'
import toast from 'react-hot-toast'
import addImg from '../../assets/add.png'

export default function RegisterAdmin() {
  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async (values, { resetForm }) => {
      setLoading(true)
      try {
        const res = await axios.post('https://e-learn-v1.runasp.net/api/Auth/register/admin', values)
        if (res.data?.succeeded) {
          toast.success('Admin registered successfully!')
          resetForm()
        } else {
          toast.error(res.data?.massage || 'Registration failed.')
        }
      } catch (error) {
        const errorMsg =
          error.response?.data?.errors?.Email?.[0] ||
          error.response?.data?.massage ||
          error.response?.data?.message ||
          'Failed to register admin. Please try again.'
        toast.error(errorMsg)
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        {/* Register Admin Form Section */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 flex items-center justify-center">
            <img src={addImg} alt="Register Admin Icon" className="w-8 h-8 mr-3 animate-pulse" />
            Register New Admin
          </h2>
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g., Ahmed"
                className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 p-3"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g., admin@example.com"
                className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 p-3"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter password"
                className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 p-3"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Re-enter password"
                className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 p-3"
                required
              />
            </div>
            <div className="mt-8 flex justify-center">
              <button
                type="submit"
                className="bg-violet-600 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:scale-105"
                disabled={loading || !formik.isValid || !formik.dirty}
              >
                {loading ? 'Registering...' : 'Register Admin'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}