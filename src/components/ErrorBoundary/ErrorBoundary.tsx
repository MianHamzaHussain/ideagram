import React, { Component, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'react-feather';
import { useRouteError } from 'react-router-dom';

/**
 * Shared Premium Error UI Layout
 */
interface ErrorFallbackUIProps {
  error: any;
  resetErrorBoundary: () => void;
}

const ErrorFallbackUI = ({ error, resetErrorBoundary }: ErrorFallbackUIProps) => {
  return (
    <div className="flex items-center justify-center min-h-[100dvh] w-full max-w-[600px] mx-auto bg-[#F2F4F7] py-6 px-[10px] font-inter overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
        className="bg-white w-full p-8 rounded-[32px] shadow-[0_24px_48px_rgba(9,30,66,0.08)] flex flex-col items-center text-center gap-6 relative"
      >
        <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center text-brand-red mb-2">
          <AlertCircle size={48} />
        </div>

        <div className="space-y-3">
          <h2 className="headline-30 text-neutral-900 px-2">Something went wrong</h2>
          <p className="body-m text-neutral-500 leading-relaxed">
            An unexpected error occurred. Our team has been notified.
          </p>
        </div>

        {import.meta.env.DEV && (
          <div className="w-full text-center overflow-auto max-h-[140px]">
            <p className="text-[14px] font-medium text-brand-red break-words leading-5 px-4">
              {error?.message || (typeof error === 'string' ? error : 'Unknown Error')}
            </p>
          </div>
        )}

        <div className="w-full space-y-3 pt-2">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={resetErrorBoundary}
            className="w-full h-[56px] bg-brand-blue text-white rounded-full flex items-center justify-center gap-3 font-bold text-[16px] shadow-lg shadow-blue-100 transition-all hover:bg-primary-400 active:bg-primary-500"
          >
            <RefreshCw size={20} />
            Refresh Application
          </motion.button>

          <button 
            onClick={() => window.location.href = '/'}
            className="w-full h-[48px] text-neutral-500 font-semibold text-sm hover:text-neutral-900 transition-colors flex items-center justify-center"
          >
            Back to Safety
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/**
 * Fallback for React Router (errorElement)
 * This is a functional component because useRouteError is a hook.
 */
export const RouteErrorFallback = () => {
  const error = useRouteError();
  const reset = () => window.location.reload();
  return <ErrorFallbackUI error={error} resetErrorBoundary={reset} />;
};

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: any;
}

/**
 * Top-level Catch-all Error Boundary (Native Class Component)
 * Zero dependencies, high premium UI.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallbackUI 
          error={this.state.error} 
          resetErrorBoundary={() => {
            this.setState({ hasError: false, error: null });
            window.location.reload();
          }} 
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
