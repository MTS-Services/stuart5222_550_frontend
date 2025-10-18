import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/router';
import { Loading } from './components/ui/loading';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </Suspense>
  );
}

export default App;
