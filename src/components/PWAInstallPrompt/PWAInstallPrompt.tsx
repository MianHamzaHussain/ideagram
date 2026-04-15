import { useState, useEffect } from 'react';
import { X, MoreVertical } from 'react-feather';
import { usePWAInstall } from '@/hooks';
import logo from '@/assets/logo.png';

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
  const { isIOS, isAndroid, isStandalone, isInstalled, deferredPrompt, handleInstall } = usePWAInstall();
  // Best Practice: Initialize modal state based on platform detection immediately
  const [showModal, setShowModal] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isDismissed = sessionStorage.getItem('pwa_modal_dismissed');
    
    // iOS shows immediately if conditions are met. 
    // Android starts as false because it requires a 2s delay handled in useEffect.
    return !!(!isStandalone && !isDismissed && isIOS);
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('pwa_modal_dismissed');
    
    // If running in standalone mode, never show the prompt
    if (isStandalone) {
      setShowModal(false);
      return;
    }

    // Android/Chrome detection (isInstalled works on Chromium)
    // If not standalone, not dismissed, and (Android OR definitely installed elsewhere)
    const shouldShowAlternative = !isStandalone && !isDismissed && (isAndroid || isInstalled);

    if ((shouldShowAlternative || (isIOS && !isStandalone && !isDismissed)) && !showModal) {
      // Allow immediate display for iOS, but use timer for Android/Installed consistent feel
      if (isIOS) setShowModal(true);
      else {
        const timer = setTimeout(() => setShowModal(true), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [isAndroid, isStandalone, showModal]);

  const handleDismiss = () => {
    setShowModal(false);
    sessionStorage.setItem('pwa_modal_dismissed', 'true');
  };

  const onInstallClick = async () => {
    if (isInstalled) {
      handleDismiss();
      return;
    }

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
            <h3 className="text-xl font-jakarta font-bold text-center leading-none">
              {isInstalled ? "Ideagram is Ready" : "Install Ideagram"}
            </h3>
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
              {isInstalled 
                ? "Ideagram is already installed. Open it from your home screen for the best experience."
                : "Fast, easy, and always one tap away on your home screen."}
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

          {/* Manual Android Instructions (Firefox/Others) */}
          {isAndroid && !isInstalled && !deferredPrompt && !isRefreshing && (
            <div className="w-full max-w-[320px] mb-2 px-2 animate-fade-in">
              <p className="text-[13px] font-medium text-neutral-600 mb-4 text-center leading-relaxed">
                Your browser requires manual installation. Follow these simple steps:
              </p>
              <ul className="space-y-4 text-neutral-600 text-[0.85rem]">
                <li className="flex items-start gap-4">
                  <div className="w-5 h-5 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0 mt-[2px]">
                    <span className="text-brand-blue text-[11px] font-bold">1</span>
                  </div>
                  <p className="leading-relaxed">
                    Tap the <span className="font-bold text-neutral-900 inline-flex items-center gap-1.5 whitespace-nowrap">Menu <MoreVertical size={14} className="mb-0.5" /></span> icon in your browser
                  </p>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-5 h-5 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0 mt-[2px]">
                    <span className="text-brand-blue text-[11px] font-bold">2</span>
                  </div>
                  <p className="leading-relaxed">
                    Select <span className="font-bold text-neutral-900">"Install"</span> or <span className="font-bold text-neutral-900">"Add to Home Screen"</span>
                  </p>
                </li>
              </ul>
              
              <p className="text-[11px] text-neutral-400 mt-6 text-center leading-relaxed px-4">
                Not seeing the menu? <button onClick={() => window.location.reload()} className="underline font-medium text-neutral-500">Refresh</button> to try again.
              </p>
            </div>
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
            onClick={(isAndroid || isInstalled) ? onInstallClick : handleDismiss}
            disabled={isRefreshing}
            className="w-full py-4 bg-[#0065FF] text-white font-jakarta font-bold text-lg rounded-2xl shadow-lg shadow-blue-100 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isRefreshing ? "Refreshing..." : (isInstalled ? "Open Ideagram" : (deferredPrompt ? "Install Now" : "Got it"))}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PWAInstallPrompt;
