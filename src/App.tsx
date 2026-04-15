import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import MainLayout from '@/layouts/MainLayout/MainLayout';
import AuthLayout from '@/layouts/AuthLayout/AuthLayout';

// Components
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PublicRoute from '@/components/auth/PublicRoute';
import { ErrorBoundary, PWAInstallPrompt } from '@/components';
import { RouteErrorFallback } from '@/components/ErrorBoundary';
import SplashScreen from '@/pages/SplashScreen/SplashScreen';

// Pages
const LoginPage = lazy(() => import('@/pages/LoginPage/LoginPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage/ForgotPasswordPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage/ProfilePage'));
const HomePage = lazy(() => import('@/pages/HomePage/HomePage'));
const ReportDetailPage = lazy(() => import('@/pages/ReportDetailPage/ReportDetailPage'));
const CreatePostPage = lazy(() => import('@/pages/CreatePostPage/CreatePostPage'));
const SearchPage = lazy(() => import('@/pages/SearchPage/SearchPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage/NotificationsPage'));

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    errorElement: <RouteErrorFallback />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/',
            element: <HomePage />,
          },
          {
            path: '/profile',
            element: <ProfilePage />,
          },
          {
            path: '/report/:id',
            element: <ReportDetailPage />,
          },
          {
            path: '/create-post',
            element: <CreatePostPage />,
          },
          {
            path: '/search',
            element: <SearchPage />,
          },
          {
            path: '/notifications',
            element: <NotificationsPage />,
          },
        ],
      },
    ],
  },

  {
    element: <PublicRoute />,
    errorElement: <RouteErrorFallback />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: '/login',
            element: <LoginPage />,
          },
          {
            path: '/forgot-password',
            element: <ForgotPasswordPage />,
          },
        ],
      },
    ],
  },
  // Catch all - redirect home
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

function App() {
  return (
    <ErrorBoundary>
      <PWAInstallPrompt />
      <Suspense fallback={<SplashScreen />}>
        <RouterProvider router={router} />
      </Suspense>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </ErrorBoundary>
  )
}

export default App

