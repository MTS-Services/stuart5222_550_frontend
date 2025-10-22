import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router/router';
import Loading from './components/ui/Loading';

// const Loading = () => (
//   <div className='flex justify-center items-center min-h-screen'>
//     <div>Loading...</div>
//   </div>
// );

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
