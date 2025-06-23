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
        <div className='bg-black w-full flex justify-center items-center p-3'>
            <h3>{t('change_language')}</h3>
            <button className='text-white ml-2' onClick={() => changeLanguage('en')}>English</button>
            <button className='text-white ml-2' onClick={() => changeLanguage('ar')}>العربية</button>
      </div>
    </>
}

export default Translate
