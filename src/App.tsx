import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { lazy } from 'react'

// Layouts (Keep eager for better root consistency)
import MainLayout from './layouts/MainLayout/MainLayout'
import AuthLayout from './layouts/AuthLayout/AuthLayout'

// Pages (Lazy Loaded)
const LoginPage = lazy(() => import('./pages/LoginPage/LoginPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPassword/ForgotPassword'))
const ProfilePage = lazy(() => import('./pages/ProfilePage/ProfilePage'))
const HomePage = lazy(() => import('./pages/HomePage/HomePage'))
const ReportDetailPage = lazy(() => import('./pages/ReportDetailPage/ReportDetailPage'))
const CreatePostPage = lazy(() => import('./pages/CreatePostPage/CreatePostPage'))

import ProtectedRoute from './components/auth/ProtectedRoute'
import PublicRoute from './components/auth/PublicRoute'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
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
        ],
      },
      {
        path: '/report/:id',
        element: <ReportDetailPage />,
      },
      {
        path: '/create-post',
        element: <CreatePostPage />,
      },
    ],
  },
  {
    element: <PublicRoute />,
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
])

import { Suspense } from 'react'
import SplashScreen from './pages/SplashScreen/SplashScreen'
import PWAInstallPrompt from './components/PWAInstallPrompt/PWAInstallPrompt'

function App() {
  return (
    <>
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
    </>
  )
}

export default App

