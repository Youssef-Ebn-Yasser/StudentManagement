import axiosInstance from './axiosInstance';

export const getFooterFeatures = () => axiosInstance.get('/api/Footer/features');
export const getFooterPricing = () => axiosInstance.get('/api/Footer/pricing');
export const getFooterBlog = () => axiosInstance.get('/api/Footer/blog');
export const getFooterUserGuides = () => axiosInstance.get('/api/Footer/user-guides');
export const getFooterWebinars = () => axiosInstance.get('/api/Footer/webinars');
export const getFooterAbout = () => axiosInstance.get('/api/Footer/about');
export const getFooterJoinUs = () => axiosInstance.get('/api/Footer/join-us');
export const getFooterPrivacy = () => axiosInstance.get('/api/Footer/privacy');
export const getFooterTerms = () => axiosInstance.get('/api/Footer/terms');
export const getFooterSitemap = () => axiosInstance.get('/api/Footer/sitemap');
export const subscribeNewsletter = (email) =>
  axiosInstance.post('/api/Footer/subscribe-newsletter', JSON.stringify(email), {
    headers: { 'Content-Type': 'application/json' }
  }); 