import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import addImg from '../../assets/add-gategory.png'
import gateImg from '../../assets/gategory.png'
import {allGategory} from '@/Redux/features/allGategory/allGategory';
import Loader from '../Loader/Loader';
import toast from 'react-hot-toast';

function AddGategory() {

    let dispatch= useDispatch()
    // let [gategories, setGategories]=useState([]) // This state seems unused, gategory from Redux is used.
    let {gategory, loading}= useSelector((state)=>state.allGategory)

    async function handleRemoveGategory(id) {
        axios.delete(`https://e-learn-v1.runasp.net/api/Category/Delete/${id}`,
            {
                data: {id}, // 👈 This sends a raw value as body
                headers: {
            'Content-Type': 'application/json'
        }
            })
        .then((response)=>{
            console.log("Lesson deleted");
            toast.success('Category Deleted Successfully!')
            dispatch(allGategory())
        }).catch((error)=>{
            console.log(error||'invalid id');
            toast.error(error?.response?.data?.message|| 'Try Again Later')
            
        })
   
    }

    async function handleAddGategory(formsData){
        console.log('Added Gategory: ',formsData);

        axios.post('https://e-learn-v1.runasp.net/api/Category/Create',formsData)
        .then((response)=>{
            console.log(response);
            toast.success('Category Added Successfully!')
            dispatch(allGategory())
            formik.resetForm();
            
        }).catch((error)=>{
            console.log(error);
            toast.error(error?.response?.data?.message || 'Failed to add category. Please try again.')
            
        })
    }

    let formik= useFormik({
        initialValues:{
            name:''
        },
        onSubmit:handleAddGategory
    })

    useEffect(()=>{
        dispatch(allGategory())
    },[])

    return <>
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto space-y-10">
                {/* Add Category Form Section */}
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-lg mx-auto">
                    <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-8 flex items-center justify-center'>
                        <img src={addImg} alt="Add Category Icon" className='w-8 h-8 mr-3' />
                        Add New Category
                    </h2>
                    <form className='space-y-6' onSubmit={formik.handleSubmit}>
                        <div>
                            <label htmlFor="name" className='block text-sm font-medium text-gray-700 mb-1'>Category Name <span className='text-red-500'>*</span></label>
                            <input 
                                type="text" 
                                name='name' 
                                id='name' 
                                value={formik.values.name} 
                                onChange={formik.handleChange} 
                                onBlur={formik.handleBlur}
                                placeholder='e.g., Web Development, Data Science'
                                className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 p-3" 
                            />
                            {formik.touched.name && formik.errors.name ? (
                                <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
                            ) : null}
                        </div>
                        <div className='mt-8 flex justify-center'>
                            <button 
                                type='submit'
                                className="bg-violet-600 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:scale-105"
                                disabled={loading || !formik.isValid || !formik.dirty} // Disable if loading, invalid or not dirty
                            >
                                {loading ? 'Adding...' : 'Add Category'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Our Categories List Section */}
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
                    <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-8 flex items-center'>
                        <img src={gateImg} alt="Categories Icon" className='w-8 h-8 mr-3' />
                        Our Categories
                    </h2>

                    {loading && (!gategory || gategory.length === 0) ? (
                        <div className="flex justify-center items-center h-40">
                            <Loader />
                        </div>
                    ) : (
                        <div className='space-y-4'>
                            {gategory && gategory.length > 0 ? (
                                gategory.map((gategory) => (
                                    <div key={gategory.id} className="relative flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200 ease-in-out">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">{gategory.name}</h3>
                                            <p className="text-xs text-gray-500">ID: {gategory.id}</p>
                                        </div>
                                        <button 
                                            onClick={() => handleRemoveGategory(gategory.id)}
                                            title="Delete Category"
                                            className='text-red-500 hover:text-red-700 bg-white rounded-full p-2 w-9 h-9 flex items-center justify-center shadow hover:bg-red-50 transition-colors duration-200 ease-in-out'
                                        >
                                            <i className="fa-solid fa-trash-alt text-md"></i>
                                        </button>
                                    </div>
                                ))
                            ) : (   
                                <p className='text-gray-600 text-center py-8 text-lg'>No categories available.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    </>
}

export default AddGategory
