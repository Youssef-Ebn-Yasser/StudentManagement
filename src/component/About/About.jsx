import React, { useEffect } from 'react'
import img2 from '../../assets/study.png'
import CategorySlider from '../CategorySlider/CategorySlider';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function About() {

  const { t } = useTranslation();
  async function getAllStudent() {
    

    let response = await axios.get('http://e-learn-v1.runasp.net/api/Teacher/Teacher/GetAll')
    console.log(response);
  }
  

  return (
    <>
       <div className="p-6 md:p-12 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
      {/* Header Section */}
      <section className="flex flex-col items-center text-center mb-16">
        <h1 className="font-extrabold text-4xl md:text-5xl text-blue-900 mb-4 tracking-tight drop-shadow-lg">
           ABOUT E-LEARNING
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mb-2">
          {t('about_subtitle') || 'Empowering learners worldwide with flexible, accessible, and engaging online education'}
        </p>
        <div className="h-1 w-24 bg-blue-400 rounded-full my-2"></div>
      </section>

      {/* Story Section */}
      <section className="grid md:grid-cols-2 gap-8 items-center mb-16 bg-white rounded-3xl shadow-xl p-8">
        <div>
          <h2 className="font-bold text-3xl text-blue-800 mb-4">{t('our_story')}</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {t('about_story')}
          </p>
        </div>
        <div className="flex justify-center">
          <img src={img2} alt="student" className="rounded-2xl shadow-2xl w-4/5 hover:scale-105 transition-transform duration-300" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid md:grid-cols-4 gap-6 text-center mb-16">
        {[
          {
            icon: "fa-building-columns",
            value: "10.5k",
            label: t('about_stat1') 
          },
          {
            icon: "fa-chalkboard-user",
            value: "33k",
            label: t('about_stat2') 
          },
          {
            icon: "fa-clock",
            value: "65.5k",
            label: t('about_stat3') 
          },
          {
            icon: "fa-sack-dollar",
            value: "25.5k",
            label: t('about_stat4') 
          }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white border border-gray-200 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <span>
              <i className={`fa-solid ${stat.icon} border-4 border-blue-100 shadow-lg p-3 rounded-2xl text-white bg-blue-500 text-3xl mb-4 hover:text-blue-500 hover:bg-white transition-all duration-300`}></i>
            </span>
            <p className="font-bold text-3xl py-2 text-blue-900">{stat.value}</p>
            <p className="text-lg text-gray-600">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Category Slider */}
      <section className="mb-16">
        <CategorySlider />
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 text-center">
        {[
          {
            icon: "fa-face-grin-squint",
            title: t('about_feature1_title') ,
            desc: t('about_feature1_desc')
          },
          {
            icon: "fa-headset",
            title: t('about_feature2_title') ,
            desc: t('about_feature2_desc') 
          },
          {
            icon: "fa-check",
            title: t('about_feature3_title') ,
            desc: t('about_feature3_desc') || "Thousands of learners have completed courses and achieved their goals."
          }
        ].map((feature, idx) => (
          <div key={idx} className="bg-white border border-gray-200 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <span>
              <i className={`fa-solid ${feature.icon} border-4 border-blue-100 shadow-lg p-3 rounded-3xl text-white bg-blue-500 text-3xl mb-4 hover:text-blue-500 hover:bg-white transition-all duration-300`}></i>
            </span>
            <p className="font-bold text-2xl py-2 text-blue-900">{feature.title}</p>
            <p className="text-lg text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </section>
    </div>
    </>
  );
  
}
