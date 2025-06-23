import router from '@/routes/router.jsx';
import { RouterProvider } from 'react-router-dom';
import useAuth from './hooks/auth/useAuth';
import { Toaster } from 'react-hot-toast';

function App() {
  const { user, isLogedin } = useAuth() 

  
  
  return (
    <>
      <RouterProvider router={router}>
      </RouterProvider>
      <Toaster/>

    </>
  );
}

export default App;
