import React, { useEffect, useState } from 'react';
import './App.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import useUserStore, { getUser } from './stores/userStore.js';
import RoutesWrapper from './routes/RoutesWrapper.jsx';

function App() {
  const [canQuery, setCanQuery] = useState(false);
  const reactLocation = useLocation();
  const navigate = useNavigate();
  const { fetch: originalFetch } = window;
  const { user, setUser } = useUserStore();

  useEffect(() => {
    (async () => {
      window.fetch = async (...args) => {
        const [url, options = {}] = args;

        if (options.method.toLowerCase() === 'patch') {
          options.headers['Content-Type'] = 'application/merge-patch+json';
        }

        const response = await originalFetch.apply(this, [url, options]);
        const clonedResponse = response.clone();
        if (clonedResponse.ok === false) {
          try {
            const jsonResponse = await clonedResponse.json();
            let msg = '';
            if (jsonResponse.message) msg += jsonResponse.message + '<br>';
            if (jsonResponse.violations) {
              for (const entry of jsonResponse.violations) {
                msg += `${entry['propertyPath']} : ${entry['message']}<br>`;
              }
            }
            if (jsonResponse['hydra:description']) msg += jsonResponse['hydra:description'] + '<br>';
          } catch {
          } finally {
            if (clonedResponse.status === 401 && reactLocation.pathname !== '/') {
              setUser(null);
              navigate('/');
            }
          }
        }
        return response;
      };

      if (user === null && localStorage.getItem('token') !== null) {
        await getUser();
      }

      setCanQuery(true);
    })();
  }, []);

  return (
    <>
      <main className="min-vh-100">
        <RoutesWrapper canQuery={canQuery} />
      </main>
    </>
  );
}
export default App;
