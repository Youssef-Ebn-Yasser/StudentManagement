import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-50 py-8 md:py-12 absolute right-0 left-0 shadow-sm">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-6 md:gap-4 mb-8">
                    {/* E-Learning Logo Section */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center mb-4">
                            <span className="text-lg md:text-xl ms-7 font-bold text-gray-800">E-Learning</span>
                        </div>
                    </div>

                    {/* Product Section */}
                    <div className="col-span-1 md:col-span-2">
                        <h6 className="font-semibold text-gray-700 mb-2 text-sm md:text-base">Product</h6>
                        <ul className="text-gray-600 text-sm">
                            <li className="mb-1"><a href="#" className="hover:text-indigo-500">Features</a></li>
                            <li className="mb-1"><a href="#" className="hover:text-indigo-500">Pricing</a></li>
                        </ul>
                    </div>

                    {/* Resources Section */}
                    <div className="col-span-1 md:col-span-2">
                        <h6 className="font-semibold text-gray-700 mb-2 text-sm md:text-base">Resources</h6>
                        <ul className="text-gray-600 text-sm">
                            <li className="mb-1"><a href="#" className="hover:text-indigo-500">Blog</a></li>
                            <li className="mb-1"><a href="#" className="hover:text-indigo-500">User Guides</a></li>
                            <li className="mb-1"><a href="#" className="hover:text-indigo-500">Webinars</a></li>
                        </ul>
                    </div>

                    {/* Company Section */}
                    <div className="col-span-1 md:col-span-2">
                        <h6 className="font-semibold text-gray-700 mb-2 text-sm md:text-base">Company</h6>
                        <ul className="text-gray-600 text-sm">
                            <li className="mb-1"><a href="#" className="hover:text-indigo-500">About</a></li>
                            <li className="mb-1"><a href="#" className="hover:text-indigo-500">Join Us</a></li>
                        </ul>
                    </div>

                    {/* Subscribe Section */}
                    <div className="col-span-1 sm:col-span-2 md:col-span-4">
                        <h6 className="font-semibold text-indigo-500 mb-4 text-base md:text-lg">Subscribe to our newsletter</h6>
                        <p className="text-gray-600 text-xs md:text-sm mb-4">
                            Stay updated with the latest courses and exclusive insights.
                        </p>
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="relative flex-grow w-full md:w-auto mb-4 md:mb-0">
                                <div className="absolute inset-y-0 left-0 pl-3 mt-1 flex items-center pointer-events-none">
                                    <i className="fa-regular fa-envelope h-5 w-5 text-gray-400"></i>
                                </div>
                                <input
                                    type="email"
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 py-2 text-sm border-gray-300 rounded-md text-black"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <button
                                type="button"
                                className="w-full ms-4 md:w-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 py-4 flex flex-col md:flex-row items-center text-sm text-gray-500 relative">
                    <div className="flex flex-col md:flex-row items-center md:absolute left-1/2 transform md:-translate-x-1/2 text-center md:text-left">
                        <span>© 2025 Brand, Inc.</span>
                        <div className="flex items-center mt-2 md:mt-0">
                            <span className="mx-2 hidden md:inline">•</span>
                            <a href="#" className="hover:text-indigo-500">
                                Privacy
                            </a>
                            <span className="mx-2">•</span>
                            <a href="#" className="hover:text-indigo-500">
                                Terms
                            </a>
                            <span className="mx-2">•</span>
                            <a href="#" className="hover:text-indigo-500">
                                Sitemap
                            </a>
                        </div>
                    </div>
                    <div className="flex space-x-4 mt-4 md:mt-0 md:ml-auto">
                        <a href="#" className="hover:text-indigo-500">
                            <i className="fa-brands fa-twitter h-5 w-5 text-gray-500"></i>
                        </a>
                        <a href="#" className="hover:text-indigo-500">
                            <i className="fa-brands fa-facebook h-5 w-5 text-gray-500"></i>
                        </a>
                        <a href="#" className="hover:text-indigo-500">
                            <i className="fa-brands fa-linkedin h-5 w-5 text-gray-500"></i>
                        </a>
                        <a href="#" className="hover:text-indigo-500">
                            <i className="fa-brands fa-youtube h-5 w-5 text-gray-500"></i>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;