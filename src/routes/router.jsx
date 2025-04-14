import authRoutes from '@/routes/authRoutes';
import mainRoutes from '@/routes/mainRoutes';
import { createBrowserRouter } from 'react-router-dom';
const router = createBrowserRouter([...mainRoutes, ...authRoutes]);

export default router;
