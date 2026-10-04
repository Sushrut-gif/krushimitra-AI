/**
 * KrushiMitra AI PWA Registration Helper
 */

export function registerServiceWorker({ onUpdate, onSuccess } = {}) {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  // Register once page loads
  const handleLoad = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('[PWA] Service Worker registered with scope:', registration.scope);

      if (onSuccess) {
        onSuccess(registration);
      }

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;

        installingWorker.addEventListener('statechange', () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // New content is available once current tabs are closed or refreshed
              console.log('[PWA] New content is available; please refresh.');
              if (onUpdate) {
                onUpdate(registration);
              }
            } else {
              // Content is cached for offline use
              console.log('[PWA] Content is cached for offline use.');
            }
          }
        });
      });
    } catch (error) {
      console.warn('[PWA] Service worker registration failed:', error);
    }
  };

  if (document.readyState === 'complete') {
    handleLoad();
  } else {
    window.addEventListener('load', handleLoad);
  }

  // Also listen for controller changes
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
