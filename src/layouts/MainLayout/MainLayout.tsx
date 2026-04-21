import { Outlet, useLocation } from 'react-router-dom';
import { Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import SplashScreen from '@/pages/SplashScreen/SplashScreen';
import { ScrollToTop, GlobalModals } from '@/components';

const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col w-full max-w-[600px] h-[100dvh] mx-auto bg-white relative overflow-hidden" role="application">
      <ScrollToTop />
      <GlobalModals />

      {/* Skip to Content - Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-brand-blue focus:text-white focus:rounded-full focus:font-semibold"
      >
        Skip to content
      </a>

      <main id="main-content" className="flex-1 min-h-0 relative">
        <AnimatePresence mode="wait">
          <Suspense fallback={<SplashScreen />}>
            <Outlet key={location.pathname} />
          </Suspense>
        </AnimatePresence>
      </main>
    </div>
  );
};


export default MainLayout;
