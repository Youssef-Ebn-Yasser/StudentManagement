import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Slider from 'react-slick';
import img from '../../assets/teacher.png'
import { useTranslation } from 'react-i18next';



function CategorySlider() {

    const { t } = useTranslation();
    
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1
      };
      let [category , setCategory] = useState([])

      function getCategorys(){
        axios.get('https://ecommerce.routemisr.com/api/v1/categories')
        .then( ( {data})=>{ 
          setCategory(data.data) 
          console.log('ccc' , category)
        } )
       
        .catch( ()=>{} )
      }

      useEffect( ()=>{
        getCategorys();
      } , [])
    
    
    return <>
        <div>
        <h1 className='font-bold text-3xl text-blue-950 py-3 text-center'>{t('our-tech')}</h1>
      <Slider {...settings}>

       <img src={img} alt="teacherImg" className='px-2 shadow-xl' />
       <img src={img} alt="teacherImg" className='px-2 shadow-xl' />
       <img src={img} alt="teacherImg" className='px-2 shadow-xl' />
  

      </Slider>
    </div>
</>
}

export default CategorySlider
