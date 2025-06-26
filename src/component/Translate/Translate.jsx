import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';

function Translate() {

    const {t, i18n} = useTranslation()

    // Function to change language
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    useEffect(()=>{
        document.documentElement.dir = i18n.dir(); // Set dir attribute on <html>

    },[i18n.language])

    return <>
        <div className='bg-black w-full flex justify-end items-center px-1 fixed z-50'>
            <h3 text-white mr-4>{t('change_language')}</h3>
            <div className='flex space-x-2'>
                <button  className={`px-3 rounded transition-colors duration-200 hover:cursor-pointer hover:text-shadow-md hover:shadow-gray-600 ${
                i18n.language === 'en'
                    ? 'bg-white text-black font-sm'
                    : ' text-white hover:bg-gray-600 '
                }`} onClick={() => changeLanguage('en')}>US English</button>
                <button className={`px-3 rounded transition-colors duration-200 hover:cursor-pointer ${
                    i18n.language === 'ar'
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : ' text-white font-sm'
                    }`} onClick={() => changeLanguage('ar')}>SA العربية</button>
            </div>
            
      </div>
    </>
}

export default Translate
