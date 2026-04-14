import { Outlet, useLocation } from 'react-router-dom';
import { Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import SplashScreen from '../../pages/SplashScreen/SplashScreen';
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop';

const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col w-full max-w-[600px] h-[100dvh] mx-auto bg-white relative overflow-hidden">
      <ScrollToTop />

      <div className="flex-1 min-h-0 relative">
        <AnimatePresence mode="wait">
          <Suspense fallback={<SplashScreen />}>
            <Outlet key={location.pathname} />
          </Suspense>
        </AnimatePresence>
      </div>
    </div>
  );
};


export default MainLayout;
