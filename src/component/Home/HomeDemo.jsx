import React from 'react';
import { FaStar, FaUsers, FaGraduationCap, FaClock, FaArrowRight } from 'react-icons/fa';

const HomeDemo = () => {
    const demoSliders = [
        {
            id: 1,
            content: "Master Modern Web Development",
            path: "/src/assets/sliderpic.jpg",
            link: "#"
        },
        {
            id: 2,
            content: "Learn Advanced Programming",
            path: "/src/assets/homepicstatic1.jpg",
            link: "#"
        },
        {
            id: 3,
            content: "Explore Data Science",
            path: "/src/assets/homepicstatic2.jpg",
            link: "#"
        }
    ];

    const demoCourses = [
        {
            id: 1,
            title: "React Fundamentals",
            description: "Learn the basics of React and build your first application",
            price: 49.99,
            level: "Beginner",
            imagePath: "/src/assets/sliderpic.jpg"
        },
        {
            id: 2,
            title: "Advanced JavaScript",
            description: "Master advanced JavaScript concepts and patterns",
            price: 79.99,
            level: "Advanced",
            imagePath: "/src/assets/homepicstatic1.jpg"
        },
        {
            id: 3,
            title: "Full Stack Development",
            description: "Build complete web applications from frontend to backend",
            price: 129.99,
            level: "Intermediate",
            imagePath: "/src/assets/homepicstatic2.jpg"
        },
        {
            id: 4,
            title: "Mobile App Development",
            description: "Create cross-platform mobile applications",
            price: 99.99,
            level: "Intermediate",
            imagePath: "/src/assets/sliderpic.jpg"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6">
                        Enhanced Home Page
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Experience the new modern design with enhanced slider, improved animations, and better user experience.
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    <div className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300 hover-lift">
                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <FaUsers className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">10K+</h3>
                        <p className="text-gray-600">Active Students</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300 hover-lift">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <FaGraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">500+</h3>
                        <p className="text-gray-600">Courses Available</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300 hover-lift">
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <FaStar className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">4.8</h3>
                        <p className="text-gray-600">Average Rating</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300 hover-lift">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <FaClock className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">24/7</h3>
                        <p className="text-gray-600">Support Available</p>
                    </div>
                </div>

                {/* Demo Courses Section */}
                <div className="mb-16">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                            <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800">
                                Featured Courses
                            </h2>
                        </div>
                        <button className="group flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all duration-300 font-semibold text-indigo-600">
                            View All Courses
                            <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {demoCourses.map((course) => (
                            <div
                                key={course.id}
                                className="w-full border border-gray-200 rounded-xl overflow-hidden shadow-lg font-sans group bg-white hover-lift"
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={course.imagePath}
                                        alt={course.title}
                                        className="block w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute top-3 right-3">
                                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                                            <FaStar className="w-4 h-4 text-indigo-600" />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-gray-500 text-sm truncate max-w-[60%] font-medium">
                                            {course.title}
                                        </span>
                                        <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-1 px-3 rounded-full text-xs font-semibold shadow-md">
                                            {course.level} Level
                                        </span>
                                    </div>
                                    <h3 className="mt-0 mb-3 text-lg font-semibold text-gray-800 line-clamp-2 flex-1 leading-relaxed">
                                        {course.description}
                                    </h3>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center space-x-2">
                                            <FaStar className="w-4 h-4 text-yellow-400" />
                                            <span className="text-sm text-gray-600">4.8 (120)</span>
                                        </div>
                                        <span className="text-xl font-bold text-indigo-600">
                                            ${course.price}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 hover-lift">
                        <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <FaGraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Expert Instructors</h3>
                        <p className="text-gray-600">
                            Learn from industry experts with years of experience in their fields.
                        </p>
                    </div>
                    <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 hover-lift">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <FaClock className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Flexible Learning</h3>
                        <p className="text-gray-600">
                            Study at your own pace with 24/7 access to course materials.
                        </p>
                    </div>
                    <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 hover-lift">
                        <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <FaStar className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Quality Content</h3>
                        <p className="text-gray-600">
                            High-quality, up-to-date content designed for real-world applications.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeDemo; 