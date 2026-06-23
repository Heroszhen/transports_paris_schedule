import 'uno.css';
import { createRoot } from 'react-dom/client';
import App from './react/App.jsx';
import { BrowserRouter } from 'react-router-dom';
// Bootstrap Bundle JS
import 'bootstrap/dist/js/bootstrap.bundle.min';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
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
