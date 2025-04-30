import { RouterProvider } from 'react-router-dom';
import router from '@/routes/router.jsx';
import { Provider } from 'react-redux';
import store from '@/Redux/store.js';


function App() {

  
  return (
    <>
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
      
    </>
  );
}

export default App;
