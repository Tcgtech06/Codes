// Service Worker Registration Script
// This script registers the service worker without modifying existing code

(function() {
  'use strict';

  // Check if service workers are supported
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then(function(registration) {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);

          // Check for updates periodically
          setInterval(function() {
            registration.update();
          }, 60000); // Check every minute

          // Handle updates
          registration.addEventListener('updatefound', function() {
            const newWorker = registration.installing;
            
            newWorker.addEventListener('statechange', function() {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available, prompt user to refresh
                console.log('New content available; please refresh.');
                
                // Optionally auto-refresh after a delay
                setTimeout(function() {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                }, 1000);
              }
            });
          });
        })
        .catch(function(err) {
          console.log('ServiceWorker registration failed: ', err);
        });

      // Handle controller change (new service worker activated)
      navigator.serviceWorker.addEventListener('controllerchange', function() {
        console.log('Service Worker controller changed, reloading page');
        window.location.reload();
      });
    });
  }

  // Preload critical resources
  if ('IntersectionObserver' in window) {
    // Preload images when they're about to enter viewport
    const imageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px'
    });

    // Observe all images with data-src attribute
    document.addEventListener('DOMContentLoaded', function() {
      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(function(img) {
        imageObserver.observe(img);
      });
    });
  }

  // Prefetch links on hover for faster navigation
  if ('requestIdleCallback' in window) {
    const prefetchedLinks = new Set();
    
    document.addEventListener('mouseover', function(e) {
      const link = e.target.closest('a');
      if (link && link.href && link.origin === location.origin && !prefetchedLinks.has(link.href)) {
        requestIdleCallback(function() {
          const prefetchLink = document.createElement('link');
          prefetchLink.rel = 'prefetch';
          prefetchLink.href = link.href;
          document.head.appendChild(prefetchLink);
          prefetchedLinks.add(link.href);
        });
      }
    }, { passive: true });
  }

  // Cache API responses in memory for faster access
  const apiCache = new Map();
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  window.cachedFetch = function(url, options) {
    const cacheKey = url + JSON.stringify(options || {});
    const cached = apiCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return Promise.resolve(cached.response.clone());
    }

    return fetch(url, options).then(function(response) {
      if (response.ok) {
        apiCache.set(cacheKey, {
          response: response.clone(),
          timestamp: Date.now()
        });
      }
      return response;
    });
  };

  // Clear old cache entries periodically
  setInterval(function() {
    const now = Date.now();
    apiCache.forEach(function(value, key) {
      if (now - value.timestamp > CACHE_DURATION) {
        apiCache.delete(key);
      }
    });
  }, 60000); // Clean up every minute

})();
