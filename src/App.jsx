import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router/router';
import Loading from './components/ui/Loading';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
      <ToastContainer />
    </Suspense>
  );
}

export default App;
