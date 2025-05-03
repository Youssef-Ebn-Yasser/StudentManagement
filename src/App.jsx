import router from '@/routes/router.jsx';
import { RouterProvider } from 'react-router-dom';
import useAuth from './hooks/auth/useAuth';


function App() {
  const { user, isLogedin } = useAuth() 

  
  
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
     
 
      
  );
}

export default App;
