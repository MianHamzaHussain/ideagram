import { useState, useEffect } from 'react';
import { X } from 'react-feather';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import logo from '../../assets/logo.png';

const SafariShareIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 12v7a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-7" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

const SafariPlusIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="4" ry="4" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const PWAInstallPrompt = () => {
  const { isIOS, isAndroid, isStandalone, deferredPrompt, handleInstall } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('pwa_modal_dismissed');

    // Show if not already installed AND not dismissed AND (is iOS OR is Android)
    const shouldShow = !isStandalone && !isDismissed && (isIOS || isAndroid);

    if (shouldShow) {
      if (isIOS) {
        setShowModal(true);
      } else if (isAndroid) {
        // Delay Android modal to ensure the beforeinstallprompt event is caught
        const timer = setTimeout(() => setShowModal(true), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [isIOS, isAndroid, isStandalone]);

  const handleDismiss = () => {
    setShowModal(false);
    sessionStorage.setItem('pwa_modal_dismissed', 'true');
  };

  const onInstallClick = async () => {
    if (deferredPrompt) {
      await handleInstall();
      handleDismiss();
    } else if (isAndroid) {
        // If on Android and no prompt, refresh to try to get it
        setIsRefreshing(true);
        setTimeout(() => {
            window.location.reload();
        }, 300);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-black/40 animate-fade-in flex flex-col justify-end text-neutral-900 overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0" onClick={handleDismiss} />

      {/* Sheet Modal with Rounded Top - Full width (100%) */}
      <div className="relative w-full h-auto max-h-[90dvh] bg-white rounded-t-[32px] overflow-hidden shadow-[0_-8px_30px_rgba(0,0,0,0.1)] animate-slide-up flex flex-col font-inter">

        {/* Header Section */}
        <div className="relative w-full pt-6 pb-0 px-6 flex items-center justify-center">
            <h3 className="text-xl font-jakarta font-bold text-center leading-none">Install Ideagram</h3>
            <button
                onClick={handleDismiss}
                className="absolute top-5 right-6 p-2 text-neutral-400 hover:text-neutral-600 transition-colors z-10"
            >
                <X size={20} />
            </button>
        </div>

        <div className="overflow-y-auto px-6 pt-0 pb-6 flex flex-col items-center">
          {/* Brand Logo Section */}
          <div className="flex flex-col items-center text-center mb-5 w-full animate-fade-in">
            <div className="w-12 h-12 flex items-center justify-center mb-1">
              <img
                src={logo}
                alt="Ideagram Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-neutral-500 text-sm font-inter leading-relaxed max-w-[240px]">
              Fast, easy, and always one tap away on your home screen.
            </p>
          </div>

          {/* Platform Specific Content */}
          {isIOS && (
            <div className="w-full max-w-[320px] mb-2">
                {/* iOS Instructions */}
                <ul className="space-y-4 text-neutral-600 text-[0.9rem]">
                  <li className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-[#0065FF] shrink-0 mt-[6px]" />
                    <p className="leading-relaxed">
                      Tap the <span className="font-bold text-neutral-900 inline-flex items-center gap-1.5 whitespace-nowrap">Share <SafariShareIcon size={14} className="mb-0.5" /></span> icon in Safari
                    </p>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-[#0065FF] shrink-0 mt-[6px]" />
                    <p className="leading-relaxed">
                      Select <span className="font-bold text-neutral-900 inline-flex items-center gap-1.5 whitespace-nowrap">Add to Home Screen <SafariPlusIcon size={14} className="mb-0.5" /></span>
                    </p>
                  </li>
                </ul>
            </div>
          )}

          {isAndroid && !deferredPrompt && !isRefreshing && (
              <p className="text-[11px] text-neutral-400 mt-1 text-center leading-relaxed max-w-[240px]">
                  Don't see the install prompt? <br />
                  <span className="font-medium text-neutral-500">Tap Install to refresh and enable.</span>
              </p>
          )}

          {isRefreshing && (
               <p className="text-xs font-medium text-[#0065FF] animate-pulse">
                   Refreshing...
               </p>
          )}
        </div>

        {/* Action Button Section */}
        <div className="px-6 pb-8 pt-2 bg-white">
          <button
            onClick={isAndroid ? onInstallClick : handleDismiss}
            disabled={isRefreshing}
            className="w-full py-4 bg-[#0065FF] text-white font-jakarta font-bold text-lg rounded-2xl shadow-lg shadow-blue-100 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isRefreshing ? "Refreshing..." : (isAndroid ? "Install" : "Got it")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PWAInstallPrompt;
