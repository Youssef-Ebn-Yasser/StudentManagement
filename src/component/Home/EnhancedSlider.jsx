import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaArrowRight, FaPlay, FaPause } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import Loader from '../Loader/Loader';
import img from '../../assets/sliderpic.jpg';

const EnhancedSlider = ({ sliders, loading }) => {
    const { t } = useTranslation();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const autoPlayRef = useRef(null);
    const sliderRef = useRef(null);

    // Auto-play functionality
    useEffect(() => {
        if (sliders.length > 1 && isPlaying && !isHovered) {
            autoPlayRef.current = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % sliders.length);
            }, 5000);

            return () => {
                if (autoPlayRef.current) {
                    clearInterval(autoPlayRef.current);
                }
            };
        }
    }, [sliders.length, isPlaying, isHovered]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
        // Reset auto-play timer
        if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current);
        }
        if (isPlaying) {
            autoPlayRef.current = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % sliders.length);
            }, 5000);
        }
    };

    const nextSlide = () => {
        goToSlide((currentSlide + 1) % sliders.length);
    };

    const prevSlide = () => {
        goToSlide(currentSlide === 0 ? sliders.length - 1 : currentSlide - 1);
    };

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
        if (isPlaying) {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
            }
        } else {
            autoPlayRef.current = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % sliders.length);
            }, 5000);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader />
            </div>
        );
    }

    if (sliders.length === 0) {
        return (
            <div className="flex justify-center items-center h-96">
                <p className="text-gray-500 text-lg">
                    {t('No-sliders-available') || 'No sliders available'}
                </p>
            </div>
        );
    }

    return (
        <div 
            className="relative overflow-hidden rounded-3xl shadow-2xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Slider Container */}
            <div
                ref={sliderRef}
                className="flex transition-transform duration-700 ease-out"
                style={{
                    transform: `translateX(-${currentSlide * 100}%)`,
                }}
                role="region"
                aria-label="Featured sliders"
            >
                {sliders.map((slide, index) => (
                    <div
                        key={slide.id}
                        className="flex flex-col lg:flex-row items-center justify-between py-12 lg:py-20 px-8 lg:px-16 min-w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 relative overflow-hidden"
                    >
                        {/* Animated Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-36 -translate-y-36 animate-pulse"></div>
                            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
                            <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-white rounded-full opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
                        </div>
                        
                        {/* Content Section */}
                        <div className="w-full lg:w-1/2 flex-shrink-0 mb-8 lg:mb-0 relative z-10">
                            <div className="space-y-6">
                                <h2 className="text-3xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight drop-shadow-lg animate-fade-in">
                                    {slide.content}
                                </h2>
                                <p className="text-lg lg:text-xl text-indigo-100 leading-relaxed animate-fade-in" style={{ animationDelay: '0.3s' }}>
                                    Discover amazing opportunities and enhance your skills with our comprehensive courses.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                                    <button
                                        className="group bg-white text-indigo-600 font-bold py-4 px-8 rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                                        aria-label="Go to slider link"
                                        onClick={() => window.open(slide.link, '_blank')}
                                    >
                                        <span className="flex items-center">
                                            {t('Visit-Link') || 'Get Started'}
                                            <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                                        </span>
                                    </button>
                                    <button
                                        className="group border-2 border-white/30 text-white font-bold py-4 px-8 rounded-xl text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                                        onClick={togglePlayPause}
                                    >
                                        <span className="flex items-center">
                                            {isPlaying ? <FaPause className="mr-2" /> : <FaPlay className="mr-2" />}
                                            {isPlaying ? 'Pause' : 'Play'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Image Section */}
                        <div className="w-full lg:w-2/5 lg:ml-8 rounded-2xl overflow-hidden shadow-2xl flex justify-center border-4 border-white/20 bg-white/10 backdrop-blur-sm animate-fade-in" style={{ animationDelay: '0.9s' }}>
                            <img
                                src={slide.path || img}
                                alt={slide.content}
                                className="w-full h-64 lg:h-80 object-cover rounded-xl hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            {sliders.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 z-20 hover:scale-110"
                        aria-label="Previous slide"
                    >
                        <FaArrowLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 z-20 hover:scale-110"
                        aria-label="Next slide"
                    >
                        <FaArrowRight className="w-5 h-5" />
                    </button>
                </>
            )}

            {/* Progress Bar */}
            {sliders.length > 1 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
                    <div 
                        className="h-full bg-white transition-all duration-500 ease-out"
                        style={{ width: `${((currentSlide + 1) / sliders.length) * 100}%` }}
                    ></div>
                </div>
            )}

            {/* Dots Navigation */}
            {sliders.length > 1 && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
                    {sliders.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-4 h-4 rounded-full border-2 border-white/50 transition-all duration-300 hover:scale-110 ${
                                currentSlide === index
                                    ? 'bg-white border-white scale-125 shadow-lg'
                                    : 'bg-white/30 hover:bg-white/50'
                            }`}
                            role="tab"
                            aria-selected={currentSlide === index}
                            aria-label={`Slide ${index + 1}`}
                        ></button>
                    ))}
                </div>
            )}

            {/* Slide Counter */}
            {sliders.length > 1 && (
                <div className="absolute top-6 right-6 bg-black/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium z-20">
                    {currentSlide + 1} / {sliders.length}
                </div>
            )}
        </div>
    );
};

export default EnhancedSlider; 