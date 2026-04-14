/// <reference types="vite/client" />

declare global {
  /**
   * BeforeInstallPromptEvent — PWA install prompt event.
   * Not yet part of the standard TypeScript DOM lib.
   */
  interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
    prompt(): Promise<void>;
  }

  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export {};
