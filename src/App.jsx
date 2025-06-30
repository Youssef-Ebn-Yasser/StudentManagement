import router from '@/routes/router.jsx';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Translate from './component/Translate/Translate';

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
