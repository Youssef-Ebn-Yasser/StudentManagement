import { RouterProvider } from 'react-router-dom';
import router from '@/routes/router.jsx';
import { Provider, useDispatch } from 'react-redux';
import store from '@/Redux/store.js';
import {expiredToken} from '@/Redux/features/expiredToken/expiredToken';
import { useEffect } from 'react';


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAndRefreshToken = () => {
      const expiration = localStorage.getItem('expirationDate');
      if (!expiration) return;

      const now = new Date().getTime();
      const expirationTime = new Date(expiration).getTime();

      // If token expired or will expire in next 1 min
      if (now > expirationTime - 60000) {
        dispatch(expiredToken());
      }
    };

    checkAndRefreshToken();

    // Optionally re-check every 5 minutes
    const interval = setInterval(checkAndRefreshToken, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [dispatch]);
  
  return (
    <>
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
      
    </>
  );
}

export default App;
