import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import reportWebVitals from './reportWebVitals';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import './assets/css/style.css';
import './assets/css/responsive.css';
import AppRouter from './routes/AppRouter';
import 'react-datepicker/dist/react-datepicker.css';
import './index.css';
import 'react-phone-input-2/lib/style.css';
import 'lightgallery.js/dist/css/lightgallery.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import './assets/css/jquery-ui.css';
import { subscribeUser } from './subscription';
import 'react-js-cron/dist/styles.css';

Sentry.init({
  dsn: 'https://72ee6a00c949477d85e3e096cdd35976@o1014999.ingest.sentry.io/5998062',
  integrations: [new Integrations.BrowserTracing()],
  environment: 'production',
  autoSessionTracking: true,
  attachStacktrace: true,
  tracesSampleRate: 1.0,
});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
    ,
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

serviceWorkerRegistration.register();

// if (sessionStorage.getItem('AuthToken') !== null) {
//   subscribeUser();
// }
