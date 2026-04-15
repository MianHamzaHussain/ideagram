import { Outlet, useLocation } from 'react-router-dom';
import { Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import SplashScreen from '@/pages/SplashScreen/SplashScreen';
import { ScrollToTop } from '@/components';

const AuthLayout = () => {
    const location = useLocation();

    return (
        <div className="min-h-screen flex flex-col w-full max-w-[600px] mx-auto bg-white transition-colors overflow-hidden">
            <main className="flex-1 flex flex-col w-full px-4 relative">
                <ScrollToTop />
                <AnimatePresence mode="wait">
                    <Suspense fallback={<SplashScreen />} key={location.pathname}>
                        <Outlet />
                    </Suspense>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default AuthLayout;
