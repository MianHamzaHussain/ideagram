import { useState, useEffect } from 'react';


/**
 * Hook to handle PWA installation for both iOS and Android/Chrome.
 * Detects platform, standalone mode, and catches the beforeinstallprompt event.
 */
export const usePWAInstall = () => {
  const [isIOS] = useState(() => {
    const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent.toLowerCase() : '';
    return /iphone|ipad|ipod/.test(userAgent);
  });
  
  const [isAndroid] = useState(() => {
    const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent.toLowerCase() : '';
    return /android/.test(userAgent);
  });

  const [isStandalone] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isIOSStandalone = 'standalone' in window.navigator && (window.navigator as Navigator & { standalone?: boolean }).standalone;
    const isGenericStandalone = window.matchMedia('(display-mode: standalone)').matches;
    return !!(isIOSStandalone || isGenericStandalone);
  });

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Android/Chrome beforeinstallprompt event
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const checkInstallation = async () => {
      // Chrome/Android-only API to check if app is already installed
      if ('getInstalledRelatedApps' in navigator) {
        try {
          const relatedApps = await (navigator as any).getInstalledRelatedApps();
          const installed = relatedApps.find((app: any) => app.platform === 'webapp');
          setIsInstalled(!!installed);
        } catch (err) {
          console.warn('Failed to check PWA installation:', err);
        }
      }
    };

    window.addEventListener('beforeinstallprompt', handler);
    checkInstallation();

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstalled(true);
      }
    }
  };

  return { isIOS, isAndroid, isStandalone, isInstalled, deferredPrompt, handleInstall };
};
