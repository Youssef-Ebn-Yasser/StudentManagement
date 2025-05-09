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
    let [gategories, setGategories]=useState([])
    let {gategory, loading}= useSelector((state)=>state.allGategory)

    async function handleRemoveGategory(id) {
        axios.delete(`https://e-learn-v1.runasp.net/api/Category/Delete${id}`)
        .then((response)=>{
            console.log("Lesson deleted");
            console.log("Clicked delete for ID:", lessons.id);
            toast.success('Lesson Deleted')
            dispatch(allGategory())
        }).catch((error)=>{
            console.log(error||'invalid id');
            toast.error('Invalid Id')
            
        })
   
    }

    async function handleAddGategory(formsData){
        console.log('Added Gategory: ',formsData);

        axios.post('https://e-learn-v1.runasp.net/api/Category/Create',formsData)
        .then((response)=>{
            console.log(response);
            toast.success('Gategory Added')
            dispatch(allGategory())
            
        }).catch((error)=>{
            console.log(error);
            toast.error('Invalid Id')
            
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
        <div className='flex flex-col sm:flex-col  md:flex-col lg:flex-col content-center w-[100%] h-full gap-2'>
            <h2 className='font-medium text-2xl p-2'><img src={addImg} alt="stuImg" className='w-7 inline m-2' />Add Gategory</h2>
            <form  className='mx-auto p-2 w-[50%]' onSubmit={formik.handleSubmit}>
                <div>
                    <label htmlFor="name" className='block'>Gategory Name <span className='text-red-600'>*</span></label>
                    <input type="text" name='name' id='name' value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    placeholder='Enter An Describtive Gategory Name'
                    className="block border-1 border-gray-200 rounded p-2 hover:shadow-lg hover:shadow-gray-400 w-full transition-all duration-300 ease" />
                </div>
                <div className='my-2 flex justify-center '>
                    <button type='submit'
                    className="bg-violet-100 text-violet-600  px-6 py-2 rounded text-xl  hover:cursor-pointer hover:shadow-sm hover:shadow-violet-300-600 transition-all duration-300 ease"
                    >Add</button>
                </div>

            </form>

            <hr/>

            <div className='p-2'>
                <h2 className='font-medium text-2xl p-2'><img src={gateImg} alt="stuImg" className='w-7 inline m-2' /> Our Gategory</h2>

                <div className='flex flex-col sm:flex-col  md:flex-col lg:flex-col content-center w-[100%] h-full gap-5 p-5 mx-auto hover:cursor-pointer'>
                        {!loading?
                        (<>
                            {gategory && gategory.length > 0 ? (
                                gategory.map((gategory) => (
                                <div key={gategory.id} className="relative shadow p-3 pb-12 rounded bg-gray-200 hover:shadow-xl hover:shadow-violet-200 ">
                                    <div className='flex flex-row justify-between'>
                                    <h2 className="text-lg font-semibold mt-2">Gategory Name : <span className='text-violet-600'>{gategory.name}</span> </h2>
                                    <p className="text-lg text-red-500 font-semibold mt-2">Gategory Id : {gategory.id}</p>
                                    </div>
                                                                   
                                    <div className='text-black-500 hover:text-red-500 absolute bottom-2 right-7 bg-gray-300 rounded-full px-3 py-2 hover:cursor-pointer hover:shadow-2xl hover:shadow-gray-500'>
                                        <button  onClick={()=>{handleRemoveGategory(gategory.id)}}>
                                            <i className="fa-solid fa-lock hover:cursor-pointer"></i>
                                        </button>
                                    </div>
                                </div>
                                ))
                            ) : (   
                                <p className='text-red-600'>No Gategory available.</p>
                            )}</>
                        ):<Loader/>}
                          
                </div>
            </div>
            
        </div>
    </>
}

export default AddGategory
