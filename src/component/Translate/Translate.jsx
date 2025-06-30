import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Translate.module.css';

function Translate() {
    const { t, i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const languages = [
        { code: 'en', label: 'English', flag: '🇺🇸' },
        { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    ];
    const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

    // Function to change language
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setOpen(false);
    };

    useEffect(() => {
        document.documentElement.dir = i18n.dir();
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [i18n.language]);

    return (
        <div className={styles.translateWrapper} ref={dropdownRef}>
            <button
                className={styles.langButton}
                onClick={() => setOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span className="mr-2" role="img" aria-label="globe">🌐</span>
                <span className="font-semibold text-blue-900 text-sm">{currentLang.flag} {currentLang.label}</span>
                <svg className={styles.chevron} width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            {open && (
                <ul className={styles.langDropdown} role="listbox">
                    {languages.map((lang) => (
                        <li
                            key={lang.code}
                            className={styles.langOption + (i18n.language === lang.code ? ' ' + styles.selected : '')}
                            onClick={() => changeLanguage(lang.code)}
                            role="option"
                            aria-selected={i18n.language === lang.code}
                        >
                            <span className="mr-2" role="img" aria-label={lang.label}>{lang.flag}</span>
                            {lang.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Translate;
