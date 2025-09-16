
import { useRoutes } from 'react-router-dom';
import { Suspense } from 'react';
import './App.css';
import { appRoutes } from './core/routes/appRoutes';
import { Toaster } from 'sonner';

function App() {
  const routes = useRoutes(appRoutes);

  return (
    <div className="App">
      <Toaster  position="top-right" richColors duration={3000} />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      }>
        {routes}
      </Suspense>
    </div>
  );
}

export default App
