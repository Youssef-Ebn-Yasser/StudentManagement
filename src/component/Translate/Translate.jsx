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
        <div
            className=" w-full flex justify-end items-center px-4 z-50 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg"
        >
            <div className="flex items-center space-x-3">
            <span className="text-blue-900 font-semibold text-base">{t('change_language')}</span>
            <div className="relative">
                <select
                className="appearance-none px-4  rounded-lg border border-blue-300 bg-white text-blue-900 font-medium shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={i18n.language}
                onChange={e => changeLanguage(e.target.value)}
                >
                <option value="en">🇺🇸 English</option>
                <option value="ar">🇸🇦 العربية</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                ▼
                </span>
            </div>
            </div>
        </div>
    </>
}

export default Translate
