import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import React from 'react';
import ReactDOMClient from 'react-dom/client';
import './index.css';
import App from './App';
import './fonts/HutchinsonGuest.woff2';

ReactDOMClient.createRoot(
  document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
);

serviceWorkerRegistration.register();