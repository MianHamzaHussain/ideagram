import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import SplashScreen from '../../pages/SplashScreen/SplashScreen';
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop';

const MainLayout = () => {
  return (
    <div className="flex flex-col w-full max-w-[600px] h-[100dvh] mx-auto bg-white  relative overflow-hidden ">

      <ScrollToTop />

      <div className="flex-1 min-h-0">
        <Suspense fallback={<SplashScreen />}>
          <Outlet />
        </Suspense>
      </div>

    </div>
  );
};

export default MainLayout;
