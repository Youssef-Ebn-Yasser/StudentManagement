import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from '@/Redux/store';
import './index.css';
import App from './App.jsx';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
import './i18n'

const GOOGLE_CLIENT_ID = "43285779598-8u8l6rssfg6b7qad9blnombd7vqctiq5.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <Suspense fallback={<div>Loading translations...</div>}>
          <App />
        </Suspense>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
