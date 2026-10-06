import React from 'react';
import 'uno.css';
import 'react-responsive-pagination/themes/classic.css';
import { createRoot } from 'react-dom/client';
import App from './react/App';
import { BrowserRouter } from 'react-router-dom';
// Bootstrap Bundle JS
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

if (!process.env.GOOGLE_CLIENT_ID_FRONT) {
  throw new Error('GOOGLE_CLIENT_ID not found');
}

const root = document.getElementById('root');
if (root) {
  const queryClient = new QueryClient();

  createRoot(root).render(
    <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID_FRONT}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

if ('serviceWorker' in navigator && process.env.APP_ENV === 'prod') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker === null) return;
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // window.location.reload();
            }
          };
        };
        return registration;
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
