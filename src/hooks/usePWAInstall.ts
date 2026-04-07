import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed',
    platform: string
  }>;
  prompt(): Promise<void>;
}

/**
 * Hook to handle PWA installation for both iOS and Android/Chrome.
 * Detects platform, standalone mode, and catches the beforeinstallprompt event.
 */
export const usePWAInstall = () => {
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Detect iOS and Android
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);

    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);

    // Detect if already installed (standalone mode)
    // @ts-ignore - navigator.standalone is iOS-specific
    const isIOSStandalone = (window.navigator as any).standalone;
    const isGenericStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(!!(isIOSStandalone || isGenericStandalone));

    // Android/Chrome beforeinstallprompt event
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  return { isIOS, isAndroid, isStandalone, deferredPrompt, handleInstall };
};
