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

    return (
  <div className="mt-[-24px] w-full bg-transparent border-0 flex justify-end px-6 pt-6 z-30">
    <div className="flex items-center gap-2">
      <span className="text-blue-900 font-semibold text-sm">{t('change_language')}:</span>
      <select
        className="rounded-md border border-blue-300 bg-white text-blue-900 text-sm font-medium px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
      >
        <option value="en">🇺🇸 English</option>
        <option value="ar">🇸🇦 العربية</option>
      </select>
    </div>
  </div>
);


}

export default Translate
