import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import SplashScreen from '../../pages/SplashScreen/SplashScreen';
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop';

const AuthLayout = () => {
    return (
        <div className="min-h-screen flex flex-col w-full max-w-[600px] mx-auto  bg-white transition-colors">
            <main className="flex-1 flex flex-col w-full px-4">
                <ScrollToTop />
                <Suspense fallback={<SplashScreen />}>
                    <Outlet />
                </Suspense>
            </main>
        </div>
    );
};

export default AuthLayout;
