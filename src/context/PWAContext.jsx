import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { registerServiceWorker } from '../utils/pwaRegister';

const PWAContext = createContext(null);

const DISMISS_KEY = 'krushimitra_pwa_prompt_dismissed';

export function PWAProvider({ children }) {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return localStorage.getItem(DISMISS_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  // Check if running in standalone mode (already installed PWA)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkStandalone = () => {
      const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
      const isStandaloneNavigator = window.navigator.standalone === true;
      if (isStandaloneMedia || isStandaloneNavigator) {
        setIsInstalled(true);
        setIsInstallable(false);
      }
    };

    checkStandalone();

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIosDevice);

    // Online / Offline listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Capture beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // App installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log('[PWA] KrushiMitra AI successfully installed as PWA.');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Register service worker with update callback
    registerServiceWorker({
      onUpdate: (registration) => {
        setIsUpdateAvailable(true);
        setWaitingWorker(registration.waiting);
      },
      onSuccess: () => {
        console.log('[PWA] Service Worker active and caching.');
      },
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Prompt user to install
  const promptInstall = useCallback(async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('[PWA] User choice outcome:', outcome);
        if (outcome === 'accepted') {
          setIsInstalled(true);
          setIsInstallable(false);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.warn('[PWA] Prompt install error:', err);
      }
    } else if (isIOS && !isInstalled) {
      // Show iOS step-by-step guidance modal
      setShowIOSPrompt(true);
    }
  }, [deferredPrompt, isIOS, isInstalled]);

  // Dismiss install banner
  const dismissInstallPrompt = useCallback(() => {
    setIsDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, 'true');
    } catch {
      // Ignore
    }
  }, []);

  // Re-open install prompt if user clicks navbar button
  const openInstallDialog = useCallback(() => {
    if (isInstallable && deferredPrompt) {
      promptInstall();
    } else if (isIOS) {
      setShowIOSPrompt(true);
    }
  }, [isInstallable, deferredPrompt, isIOS, promptInstall]);

  // Update App to latest version
  const updateApp = useCallback(() => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  }, [waitingWorker]);

  // Request notifications
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) return 'unsupported';
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (err) {
      console.warn('[PWA] Notification request error:', err);
      return 'denied';
    }
  }, []);

  return (
    <PWAContext.Provider
      value={{
        isOnline,
        isInstallable,
        isInstalled,
        isDismissed,
        isIOS,
        showIOSPrompt,
        setShowIOSPrompt,
        isUpdateAvailable,
        promptInstall,
        openInstallDialog,
        dismissInstallPrompt,
        updateApp,
        requestNotificationPermission,
      }}
    >
      {children}
    </PWAContext.Provider>
  );
}

export function usePWA() {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
}
