import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import img1 from '../../assets/homepicstatic1.jpg';
import img2 from '../../assets/homepicstatic2.jpg';
import img3 from '../../assets/homepicstatic2.jpg';
import img4 from '../../assets/homepicstatic1.jpg';
import img from '../../assets/sliderpic.jpg';
import styles from './Home.module.css';

function Home() {
  // useEffect(() => {
  //   // Reset body display to block
  //   document.body.style.display = 'block';
  //   document.body.style.backgroundColor = 'white';

  //   // Cleanup function to reset styles when the component unmounts
  //   return () => {
  //     document.body.style.display = '';
  //     document.body.style.backgroundColor = '';
  //   };
  // }, []);

  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slider data
  const slides = [
    {
      title: 'Digital Illustrations',
      description:
        'Qui aliquip quis magna non sint voluptate officia qui. Laborum sit mollit id sint et dolore conseq.',
      buttonText: 'Explore more',
      img: img,
    },
    {
      title: 'Creative Designs',
      description:
        'Explore the world of creative designs with our expert tutorials and resources.',
      buttonText: 'Learn More',
      img: img,
    },
  ];

  // Function to go to a specific slide
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <>
      <div className="min-h-screen w-full max-w-[1300px] mx-auto px-4 bg-white mt-[75px]">
        <br />
        <br />
        {/* Header recommended Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-black">Recommended for you</h2>
          <Link
            to={`/courses`}
            className={`${styles.primary} me-5 group flex items-center mt-4`}
          >
            View More
            <i
              className="fa-solid fa-angle-right ml-2 transition-transform duration-300 group-hover:translate-x-1"
            ></i>
          </Link>
        </div>

        {/* Main recommended Content */}
        <div className="flex flex-wrap justify-center gap-6">
          {/* Card 1 */}
          <Link
            to={`/coursesDetails`}
            className={`w-72 border border-gray-300 rounded-lg overflow-hidden shadow-md font-sans group ${styles.card}`}
          >
            <div className="relative overflow-hidden">
              <img
                src={img1}
                alt="Video Editing Clapperboard with Popcorn"
                className="block w-full h-auto transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">Video</span>
                <span className="bg-red-400 text-white py-1 px-2 rounded-xl text-xs">
                  Beginner Level
                </span>
              </div>
              <h3 className="mt-0 mb-2 text-lg font-semibold text-black">
                Grow Your Video Editing Skills from Experts
              </h3>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <i className="fas fa-star text-yellow-500 text-sm"></i>
                  <span className="ml-1 text-sm text-black">4.5</span>
                  <span className="text-gray-500 text-sm ps-1">(1253)</span>
                </div>
                <span className="text-xl font-bold text-black">$39</span>
              </div>
            </div>
          </Link>

          {/* Card 2 */}
          <Link
            to={`/coursesDetails`}
            className={`w-72 border border-gray-300 rounded-lg overflow-hidden shadow-md font-sans group ${styles.card}`}
          >
            <div className="relative overflow-hidden">
              <img
                src={img2}
                alt="Video Editing Clapperboard with Popcorn"
                className="block w-full h-auto transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">Photography</span>
              </div>
              <h3 className="mt-0 mb-2 text-lg font-semibold text-black">
                Easy and Creative Food Art Ideas Decoration
              </h3>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <i className="fas fa-star text-yellow-500 text-sm"></i>
                  <span className="ml-1 text-sm text-black">4.5</span>
                  <span className="text-gray-500 text-sm ps-1">(1233)</span>
                </div>
                <span className="text-xl font-bold text-black">$59</span>
              </div>
            </div>
          </Link>

          {/* Card 3 */}
          <Link
            to={`/coursesDetails`}
            className={`w-72 border border-gray-300 rounded-lg overflow-hidden shadow-md font-sans group ${styles.card}`}
          >
            <div className="relative overflow-hidden">
              <img
                src={img1}
                alt="Video Editing Clapperboard with Popcorn"
                className="block w-full h-auto transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">Lifestyle</span>
              </div>
              <h3 className="mt-0 mb-2 text-lg font-semibold text-black">
                Create Your Own Sustainable Fashion Style
              </h3>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <i className="fas fa-star text-yellow-500 text-sm"></i>
                  <span className="ml-1 text-sm text-black">4.5</span>
                  <span className="text-gray-500 text-sm ps-1">(123)</span>
                </div>
                <span className="text-xl font-bold text-black">$29</span>
              </div>
            </div>
          </Link>

          {/* Card 4 */}
          <Link
            to={`/coursesDetails`}
            className={`w-72 border border-gray-300 rounded-lg overflow-hidden shadow-md font-sans group ${styles.card}`}
          >
            <div className="relative overflow-hidden">
              <img
                src={img2}
                alt="Video Editing Clapperboard with Popcorn"
                className="block w-full h-auto transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">Marketing</span>
                <span className="bg-[#e8618c] text-white py-1 px-2 rounded-xl text-xs">
                  20% Off
                </span>
              </div>
              <h3 className="mt-0 mb-2 text-lg font-semibold text-black">
                Grow Your Skills Fashion Marketing
              </h3>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <i className="fas fa-star text-yellow-500 text-sm"></i>
                  <span className="ml-1 text-sm text-black">4.5</span>
                  <span className="text-gray-500 text-sm ps-1">(123)</span>
                </div>
                <span className="text-xl font-bold text-black">$39</span>
              </div>
            </div>
          </Link>
        </div>
        <br />
        {/* Slider Section */}
        <div className="mt-8 relative overflow-hidden">
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                className="flex flex-row items-center justify-between py-16 px-8 md:px-24 lg:px-32 min-w-full"
              >
                {/* Text Section */}
                <div className="w-2/5 flex-shrink-0">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    {slide.title}
                  </h2>
                  <p className="text-gray-600 mb-6">{slide.description}</p>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md">
                    {slide.buttonText}
                  </button>
                </div>
                {/* Image Section */}
                <div className="w-2/5 ml-8 rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={slide.img}
                    alt={slide.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Dots for Navigation */}
          <div className="flex justify-center mt-4 mb-4">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 mx-2 rounded-full ${
                  currentSlide === index
                    ? 'bg-indigo-600'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              ></button>
            ))}
          </div>
        </div>
        <br />
        <br />
        {/* Header popular Section */}
        <div className="flex justify-between items-center mb-6 ">
          <h2 className="text-3xl font-bold text-black">Popular courses</h2>
          <Link
            to={`/courses`}
            className={`${styles.primary} me-5 group flex items-center mt-4`}
          >
            View More
            <i
              className="fa-solid fa-angle-right ml-2 transition-transform duration-300 group-hover:translate-x-1"
            ></i>
          </Link>
        </div>
        {/* Main popular Content  */}
        <div className="flex flex-wrap justify-center gap-6">
          {/* Card 1 */}
          <Link
            to={`/coursesDetails`}
            className={`w-72 border border-gray-300 rounded-lg overflow-hidden shadow-md font-sans group ${styles.card}`}
          >
            <div className="relative overflow-hidden">
              <img
                src={img1}
                alt="Video Editing Clapperboard with Popcorn"
                className="block w-full h-auto transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">Graphic Design</span>
                <span className="bg-[#636ae8] text-white py-1 px-2 rounded-xl text-xs">
                Best-seller
                </span>
              </div>
              <h3 className="mt-0 mb-2 text-lg font-semibold text-black">
              Digital Poster Design: Best Practices
              </h3>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <i className="fas fa-star text-yellow-500 text-sm"></i>
                  <span className="ml-1 text-sm text-black">4.5</span>
                  <span className="text-gray-500 text-sm ps-1">(1253)</span>
                </div>
                <span className="text-xl font-bold text-black">$39</span>
              </div>
            </div>
          </Link>

          {/* Card 2 */}
          <Link
            to={`/coursesDetails`}
            className={`w-72 border border-gray-300 rounded-lg overflow-hidden shadow-md font-sans group ${styles.card}`}
          >
            <div className="relative overflow-hidden">
              <img
                src={img2}
                alt="Video Editing Clapperboard with Popcorn"
                className="block w-full h-auto transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">Graphic Design</span>
                <span className="bg-[#636ae8] text-white py-1 px-2 rounded-xl text-xs">
                Best-seller
                </span>
              </div>
              <h3 className="mt-0 mb-2 text-lg font-semibold text-black">
              Create Emotional & Trendy Typography
              </h3>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <i className="fas fa-star text-yellow-500 text-sm"></i>
                  <span className="ml-1 text-sm text-black">4.5</span>
                  <span className="text-gray-500 text-sm ps-1">(1233)</span>
                </div>
                <span className="text-xl font-bold text-black">$59</span>
              </div>
            </div>
          </Link>

          {/* Card 3 */}
          <Link
            to={`/coursesDetails`}
            className={`w-72 border border-gray-300 rounded-lg overflow-hidden shadow-md font-sans group ${styles.card}`}
          >
            <div className="relative overflow-hidden">
              <img
                src={img1}
                alt="Video Editing Clapperboard with Popcorn"
                className="block w-full h-auto transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">Graphic Design</span>
              </div>
              <h3 className="mt-0 mb-2 text-lg font-semibold text-black">
              Create Vector Illustrations  for Beginner
              </h3>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <i className="fas fa-star text-yellow-500 text-sm"></i>
                  <span className="ml-1 text-sm text-black">4.5</span>
                  <span className="text-gray-500 text-sm ps-1">(123)</span>
                </div>
                <span className="text-xl font-bold text-black">$29</span>
              </div>
            </div>
          </Link>

          {/* Card 4 */}
          <Link
            to={`/coursesDetails`}
            className={`w-72 border border-gray-300 rounded-lg overflow-hidden shadow-md font-sans group ${styles.card}`}
          >
            <div className="relative overflow-hidden">
              <img
                src={img2}
                alt="Video Editing Clapperboard with Popcorn"
                className="block w-full h-auto transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">Graphic Design</span>
                <span className="bg-[#636ae8] text-white py-1 px-2 rounded-xl text-xs">
                Best-seller
                </span>
              </div>
              <h3 className="mt-0 mb-2 text-lg font-semibold text-black">
              How to Design a Creative Book Cover
              </h3>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <i className="fas fa-star text-yellow-500 text-sm"></i>
                  <span className="ml-1 text-sm text-black">4.5</span>
                  <span className="text-gray-500 text-sm ps-1">(123)</span>
                </div>
                <span className="text-xl font-bold text-black">$19</span>
              </div>
            </div>
          </Link>
        </div>
        <br />
        <br />
        <br />
        {/* Header trending Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-black">Trending courses</h2>
          <Link
            to={`/courses`}
            className={`${styles.primary} me-5 group flex items-center mt-4`}
          >
            View More
            <i
              className="fa-solid fa-angle-right ml-2 transition-transform duration-300 group-hover:translate-x-1"
            ></i>
          </Link>
        </div>
        {/* Main trending Content */}
        <div className="flex flex-wrap justify-center gap-6">
          {/* Card 1 */}
          <Link
            to={`/coursesDetails`}
            className={`w-72 border border-gray-300 rounded-lg overflow-hidden shadow-md font-sans group ${styles.card}`}
          >
            <div className="relative overflow-hidden">
              <img
                src={img1}
                alt="Video Editing Clapperboard with Popcorn"
                className="block w-full h-auto transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">UI/UX Design</span>
                <span className="bg-[#636ae8] text-white py-1 px-2 rounded-xl text-xs">
                Best-seller
                </span>
              </div>
              <h3 className="mt-0 mb-2 text-lg font-semibold text-black">
              UI Design, a User-Centered Approach
              </h3>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <i className="fas fa-star text-yellow-500 text-sm"></i>
                  <span className="ml-1 text-sm text-black">4.5</span>
                  <span className="text-gray-500 text-sm ps-1">(1253)</span>
                </div>
                <span className="text-xl font-bold text-black">$39</span>
              </div>
            </div>
          </Link>

          {/* Card 2 */}
          <Link
            to={`/coursesDetails`}
            className={`w-72 border border-gray-300 rounded-lg overflow-hidden shadow-md font-sans group ${styles.card}`}
          >
            <div className="relative overflow-hidden">
              <img
                src={img2}
                alt="Video Editing Clapperboard with Popcorn"
                className="block w-full h-auto transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">UI/UX Design</span>
                <span className="bg-[#e8618c] text-white py-1 px-2 rounded-xl text-xs">
                20% Off
                </span>
              </div>
              <h3 className="mt-0 mb-2 text-lg font-semibold text-black">
              Pick Awesome Color Palette for Your App
              </h3>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <i className="fas fa-star text-yellow-500 text-sm"></i>
                  <span className="ml-1 text-sm text-black">4.5</span>
                  <span className="text-gray-500 text-sm ps-1">(1233)</span>
                </div>
                <span className="text-xl font-bold text-black">$59</span>
              </div>
            </div>
          </Link>

          {/* Card 3 */}
          <Link
            to={`/coursesDetails`}
            className={`w-72 border border-gray-300 rounded-lg overflow-hidden shadow-md font-sans group ${styles.card}`}
          >
            <div className="relative overflow-hidden">
              <img
                src={img1}
                alt="Video Editing Clapperboard with Popcorn"
                className="block w-full h-auto transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">UI/UX Design</span>
              </div>
              <h3 className="mt-0 mb-2 text-lg font-semibold text-black">
              Principles of Great UI Design System
              </h3>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <i className="fas fa-star text-yellow-500 text-sm"></i>
                  <span className="ml-1 text-sm text-black">4.5</span>
                  <span className="text-gray-500 text-sm ps-1">(123)</span>
                </div>
                <span className="text-xl font-bold text-black">$29</span>
              </div>
            </div>
          </Link>

          {/* Card 4 */}
          <Link
            to={`/coursesDetails`}
            className={`w-72 border border-gray-300 rounded-lg overflow-hidden shadow-md font-sans group ${styles.card}`}
          >
            <div className="relative overflow-hidden">
              <img
                src={img2}
                alt="Video Editing Clapperboard with Popcorn"
                className="block w-full h-auto transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">UI/UX Design</span>
                <span className="bg-[#e8618c] text-white py-1 px-2 rounded-xl text-xs">
                20% Off
                </span>
              </div>
              <h3 className="mt-0 mb-2 text-lg font-semibold text-black">
              Prototype Your First Mobile Application
              </h3>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <i className="fas fa-star text-yellow-500 text-sm"></i>
                  <span className="ml-1 text-sm text-black">4.5</span>
                  <span className="text-gray-500 text-sm ps-1">(123)</span>
                </div>
                <span className="text-xl font-bold text-black">$19</span>
              </div>
            </div>
          </Link>
        </div>
        <br />
        <br />
        <br />

      </div>
    </>
  );
}

export default Home;
