import React, { useEffect, useState } from 'react';
import {
    getFooterFeatures,
    getFooterPricing,
    getFooterBlog,
    getFooterUserGuides,
    getFooterWebinars,
    getFooterAbout,
    getFooterJoinUs,
    getFooterPrivacy,
    getFooterTerms,
    getFooterSitemap,
    subscribeNewsletter
} from '../../services/footerService';
import { t } from 'i18next';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    // State for fetched data
    const [features, setFeatures] = useState([]);
    const [pricing, setPricing] = useState({});
    const [blog, setBlog] = useState({});
    const [userGuides, setUserGuides] = useState({});
    const [webinars, setWebinars] = useState({});
    const [about, setAbout] = useState({});
    const [joinUs, setJoinUs] = useState({});
    const [privacy, setPrivacy] = useState({});
    const [terms, setTerms] = useState({});
    const [sitemap, setSitemap] = useState({});
    // Newsletter
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterStatus, setNewsletterStatus] = useState(null);
    const [newsletterLoading, setNewsletterLoading] = useState(false);
    const [featuresTitle, setFeaturesTitle] = useState('');
    const [openSection, setOpenSection] = useState(null);
    const sectionContent = {
        features: features,
        pricing: pricing,
        blog: blog,
        userGuides: userGuides,
        webinars: webinars,
        about: about,
        joinUs: joinUs,
        privacy: privacy,
        terms: terms,
        sitemap: sitemap,
    };
    const sectionTitles = {
        features: featuresTitle,
        pricing: 'Pricing',
        blog: 'Blog',
        userGuides: 'User Guides',
        webinars: 'Webinars',
        about: 'About',
        joinUs: 'Join Us',
        privacy: 'Privacy',
        terms: 'Terms',
        sitemap: 'Sitemap',
    };

    useEffect(() => {
        getFooterFeatures().then(res => {
            setFeatures(Array.isArray(res.data.features) ? res.data.features : []);
            setFeaturesTitle(res.data.title || 'Features');
        }).catch(() => {
            setFeatures([]);
            setFeaturesTitle('Features');
        });
        getFooterPricing().then(res => setPricing(res.data)).catch(() => setPricing({}));
        getFooterBlog().then(res => setBlog(res.data)).catch(() => setBlog({}));
        getFooterUserGuides().then(res => setUserGuides(res.data)).catch(() => setUserGuides({}));
        getFooterWebinars().then(res => setWebinars(res.data)).catch(() => setWebinars({}));
        getFooterAbout().then(res => setAbout(res.data)).catch(() => setAbout({}));
        getFooterJoinUs().then(res => setJoinUs(res.data)).catch(() => setJoinUs({}));
        getFooterPrivacy().then(res => setPrivacy(res.data)).catch(() => setPrivacy({}));
        getFooterTerms().then(res => setTerms(res.data)).catch(() => setTerms({}));
        getFooterSitemap().then(res => setSitemap(res.data)).catch(() => setSitemap({}));
    }, []);

    const handleNewsletterSubmit = async (e) => {
        e.preventDefault();
        setNewsletterLoading(true);
        setNewsletterStatus(null);
        try {
            await subscribeNewsletter(newsletterEmail);
            setNewsletterStatus('success');
            setNewsletterEmail('');
        } catch (err) {
            setNewsletterStatus('error');
        } finally {
            setNewsletterLoading(false);
        }
    };

    // Helper to render pricing section
    function renderPricing(pricing) {
        if (!pricing || typeof pricing !== 'object') return <li>No content available.</li>;
        return (
            <div>
                {pricing.title && <h4 className="text-lg font-semibold mb-2">{pricing.title}</h4>}
                {pricing.description && <p className="mb-2 text-gray-700">{pricing.description}</p>}
                {pricing.pricingInfo && (
                    <div className="space-y-2">
                        {pricing.pricingInfo.individualCourses && (
                            <div><span className="font-semibold">Individual Courses:</span> {pricing.pricingInfo.individualCourses}</div>
                        )}
                        {pricing.pricingInfo.currency && (
                            <div><span className="font-semibold">Currency:</span> {pricing.pricingInfo.currency}</div>
                        )}
                        {Array.isArray(pricing.pricingInfo.paymentMethods) && pricing.pricingInfo.paymentMethods.length > 0 && (
                            <div>
                                <span className="font-semibold">Payment Methods:</span>
                                <ul className="list-disc pl-6">
                                    {pricing.pricingInfo.paymentMethods.map((method, idx) => (
                                        <li key={idx}>{method}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {Array.isArray(pricing.pricingInfo.features) && pricing.pricingInfo.features.length > 0 && (
                            <div>
                                <span className="font-semibold">Features:</span>
                                <ul className="list-disc pl-6">
                                    {pricing.pricingInfo.features.map((feature, idx) => (
                                        <li key={idx}>{feature}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // Helper to render blog section
    function renderBlog(blog) {
        if (!blog || typeof blog !== 'object') return <li>No content available.</li>;
        return (
            <div>
                {blog.title && <h4 className="text-lg font-semibold mb-2">{blog.title}</h4>}
                {blog.description && <p className="mb-2 text-gray-700">{blog.description}</p>}
                {Array.isArray(blog.recentPosts) && blog.recentPosts.length > 0 && (
                    <div>
                        <span className="font-semibold">Recent Posts:</span>
                        <ul className="list-disc pl-6">
                            {blog.recentPosts.map((post, idx) => (
                                <li key={idx} className="mb-1">
                                    <span className="font-medium">{post.title}</span>
                                    {post.date && <span className="text-xs text-gray-500 ml-2">({post.date})</span>}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    }

    // Helper to render user guides
    function renderUserGuides(guides) {
        if (!guides || typeof guides !== 'object') return <li>No content available.</li>;
        return (
            <div>
                {guides.title && <h4 className="text-lg font-semibold mb-2">{guides.title}</h4>}
                {Array.isArray(guides.guides) && guides.guides.length > 0 && (
                    <ul className="divide-y divide-gray-100">
                        {guides.guides.map((g, idx) => (
                            <li key={idx} className="py-1 flex justify-between">
                                <span>{g.title}</span>
                                <span className="text-xs text-gray-500">{g.category}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }

    // Helper to render webinars
    function renderWebinars(webinars) {
        if (!webinars || typeof webinars !== 'object') return <li>No content available.</li>;
        return (
            <div>
                {webinars.title && <h4 className="text-lg font-semibold mb-2">{webinars.title}</h4>}
                {webinars.description && <p className="mb-2 text-gray-700">{webinars.description}</p>}
                {Array.isArray(webinars.upcomingWebinars) && webinars.upcomingWebinars.length > 0 && (
                    <div>
                        <span className="font-semibold">Upcoming Webinars:</span>
                        <ul className="list-disc pl-6">
                            {webinars.upcomingWebinars.map((w, idx) => (
                                <li key={idx} className="mb-1">
                                    <span className="font-medium">{w.title}</span>
                                    {w.date && <span className="text-xs text-gray-500 ml-2">{w.date}</span>}
                                    {w.time && <span className="text-xs text-gray-400 ml-2">{w.time}</span>}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {Array.isArray(webinars.features) && webinars.features.length > 0 && (
                    <div className="mt-2">
                        <span className="font-semibold">Features:</span>
                        <ul className="list-disc pl-6">
                            {webinars.features.map((f, idx) => (
                                <li key={idx}>{f}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    }

    // Helper to render about
    function renderAbout(about) {
        if (!about || typeof about !== 'object') return <li>No content available.</li>;
        return (
            <div>
                {about.title && <h4 className="text-lg font-semibold mb-2">{about.title}</h4>}
                {about.description && <p className="mb-2 text-gray-700">{about.description}</p>}
                {about.mission && <div className="mb-1"><span className="font-semibold">Mission:</span> {about.mission}</div>}
                {about.vision && <div className="mb-1"><span className="font-semibold">Vision:</span> {about.vision}</div>}
                {about.stats && (
                    <div className="mb-2">
                        <span className="font-semibold">Stats:</span>
                        <ul className="list-disc pl-6">
                            {Object.entries(about.stats).map(([k, v]) => (
                                <li key={k}><span className="capitalize">{k}:</span> {v}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {Array.isArray(about.features) && about.features.length > 0 && (
                    <div>
                        <span className="font-semibold">Features:</span>
                        <ul className="list-disc pl-6">
                            {about.features.map((f, idx) => (
                                <li key={idx}>{f}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    }

    // Helper to render join us
    function renderJoinUs(joinUs) {
        if (!joinUs || typeof joinUs !== 'object') return <li>No content available.</li>;
        return (
            <div>
                {joinUs.title && <h4 className="text-lg font-semibold mb-2">{joinUs.title}</h4>}
                {joinUs.description && <p className="mb-2 text-gray-700">{joinUs.description}</p>}
                {Array.isArray(joinUs.opportunities) && joinUs.opportunities.length > 0 && (
                    <div>
                        <span className="font-semibold">Opportunities:</span>
                        <ul className="list-disc pl-6">
                            {joinUs.opportunities.map((o, idx) => (
                                <li key={idx}><span className="font-medium">{o.role}:</span> {o.description}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {Array.isArray(joinUs.benefits) && joinUs.benefits.length > 0 && (
                    <div className="mt-2">
                        <span className="font-semibold">Benefits:</span>
                        <ul className="list-disc pl-6">
                            {joinUs.benefits.map((b, idx) => (
                                <li key={idx}>{b}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    }

    // Helper to render privacy/terms
    function renderSections(sectionObj) {
        if (!sectionObj || typeof sectionObj !== 'object') return <li>No content available.</li>;
        return (
            <div>
                {sectionObj.title && <h4 className="text-lg font-semibold mb-2">{sectionObj.title}</h4>}
                {sectionObj.lastUpdated && <div className="mb-2 text-xs text-gray-500">Last updated: {sectionObj.lastUpdated}</div>}
                {Array.isArray(sectionObj.sections) && sectionObj.sections.length > 0 && (
                    <div>
                        {sectionObj.sections.map((s, idx) => (
                            <div key={idx} className="mb-3">
                                <div className="font-semibold text-indigo-700">{s.title}</div>
                                <div className="text-gray-700 text-sm">{s.content}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Helper to render sitemap
    function renderSitemap(sitemap) {
        if (!sitemap || typeof sitemap !== 'object') return <li>No content available.</li>;
        return (
            <div>
                {sitemap.title && <h4 className="text-lg font-semibold mb-2">{sitemap.title}</h4>}
                {sitemap.pages && (
                    <div>
                        {Object.entries(sitemap.pages).map(([section, pages]) => (
                            <div key={section} className="mb-2">
                                <div className="font-semibold capitalize">{section}:</div>
                                <ul className="list-disc pl-6">
                                    {Array.isArray(pages) && pages.map((p, idx) => (
                                        <li key={idx}>{p}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

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
                        <h6 className="font-semibold text-gray-700 mb-2 text-sm md:text-base">{featuresTitle}</h6>
                        <ul className="text-gray-600 text-sm">
                            <li className="mb-1 cursor-pointer hover:text-indigo-500" onClick={() => setOpenSection('features')}>{featuresTitle}</li>
                            <li className="mb-1 cursor-pointer hover:text-indigo-500" onClick={() => setOpenSection('pricing')}>Pricing</li>
                        </ul>
                    </div>

                    {/* Resources Section */}
                    <div className="col-span-1 md:col-span-2">
                        <h6 className="font-semibold text-gray-700 mb-2 text-sm md:text-base">{t("resources")}</h6>
                        <ul className="text-gray-600 text-sm">
                            <li className="mb-1 cursor-pointer hover:text-indigo-500" onClick={() => setOpenSection('blog')}>Blog</li>
                            <li className="mb-1 cursor-pointer hover:text-indigo-500" onClick={() => setOpenSection('userGuides')}>User Guides</li>
                            <li className="mb-1 cursor-pointer hover:text-indigo-500" onClick={() => setOpenSection('webinars')}>Webinars</li>
                        </ul>
                    </div>

                    {/* Company Section */}
                    <div className="col-span-1 md:col-span-2">
                        <h6 className="font-semibold text-gray-700 mb-2 text-sm md:text-base">{t("company")}</h6>
                        <ul className="text-gray-600 text-sm">
                            <li className="mb-1 cursor-pointer hover:text-indigo-500" onClick={() => setOpenSection('about')}>About</li>
                            <li className="mb-1 cursor-pointer hover:text-indigo-500" onClick={() => setOpenSection('joinUs')}>Join Us</li>
                        </ul>
                    </div>

                    {/* Subscribe Section */}
                    <div className="col-span-1 sm:col-span-2 md:col-span-4">
                        <h6 className="font-semibold text-indigo-500 mb-4 text-base md:text-lg">{t("subscribe-newsletter")}</h6>
                        <p className="text-gray-600 text-xs md:text-sm mb-4">
                            {t("newsletter-description")}
                        </p>
                        <form className="flex flex-col md:flex-row items-center" onSubmit={handleNewsletterSubmit}>
                            <div className="relative flex-grow w-full md:w-auto mb-4 md:mb-0">
                                <div className="absolute inset-y-0 left-0 pl-3 mt-1 flex items-center pointer-events-none">
                                    <i className="fa-regular fa-envelope h-5 w-5 text-gray-400"></i>
                                </div>
                                <input
                                    type="email"
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 py-2 text-sm border-gray-300 rounded-md text-black"
                                    placeholder="Enter your email"
                                    value={newsletterEmail}
                                    onChange={e => setNewsletterEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full ms-4 md:w-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                disabled={newsletterLoading}
                            >
                                {newsletterLoading ? 'Subscribing...' : 'Subscribe'}
                            </button>
                        </form>
                        {newsletterStatus === 'success' && <p className="text-green-600 mt-2">Subscribed successfully!</p>}
                        {newsletterStatus === 'error' && <p className="text-red-600 mt-2">Subscription failed. Please try again.</p>}
                    </div>
                </div>

                <div className="border-t border-gray-200 py-4 flex flex-col md:flex-row items-center text-sm text-gray-500 relative">
                    <div className="flex flex-col md:flex-row items-center md:absolute left-1/2 transform md:-translate-x-1/2 text-center md:text-left">
                        <span>© 2025 Brand, Inc.</span>
                        <div className="flex items-center mt-2 md:mt-0">
                            <span className="mx-2 hidden md:inline">•</span>
                            <span className="cursor-pointer hover:text-indigo-500" onClick={() => setOpenSection('privacy')}>Privacy</span>
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

            {openSection && (
                <>
                    {/* Modal only, no overlay */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn">
                        <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 p-6 relative overflow-y-auto max-h-[80vh] border border-gray-200">
                            <button
                                aria-label="Close"
                                className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-3xl font-bold focus:outline-none"
                                onClick={() => setOpenSection(null)}
                            >
                                &times;
                            </button>
                            <h3 className="text-2xl font-bold mb-4 text-indigo-700 flex items-center gap-2">
                                {sectionTitles[openSection]}
                            </h3>
                            <ul className="list-disc pl-6 space-y-2 text-base text-gray-800">
                                {openSection === 'pricing'
                                    ? renderPricing(pricing)
                                    : openSection === 'blog'
                                    ? renderBlog(blog)
                                    : openSection === 'userGuides'
                                    ? renderUserGuides(userGuides)
                                    : openSection === 'webinars'
                                    ? renderWebinars(webinars)
                                    : openSection === 'about'
                                    ? renderAbout(about)
                                    : openSection === 'joinUs'
                                    ? renderJoinUs(joinUs)
                                    : openSection === 'privacy'
                                    ? renderSections(privacy)
                                    : openSection === 'terms'
                                    ? renderSections(terms)
                                    : openSection === 'sitemap'
                                    ? renderSitemap(sitemap)
                                    : (Array.isArray(sectionContent[openSection]) && sectionContent[openSection].length > 0 ? (
                                        sectionContent[openSection].map((item, idx) => (
                                            <li key={idx}>{typeof item === 'string' ? item : (item.title || JSON.stringify(item))}</li>
                                        ))
                                    ) : (
                                        <li className="text-gray-400">No content available.</li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                    <style>{`
                        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                        .animate-fadeIn { animation: fadeIn 0.2s; }
                    `}</style>
                </>
            )}
        </footer>
    );
};

export default Footer;