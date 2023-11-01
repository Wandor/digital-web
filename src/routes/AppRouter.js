import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import routes from './routes';
import ScrollToTop from './ScrollToTop';
import AppLogout from './AppLogout';
import InfoMessage from '../components/Common/InfoMessage';

function AppRouter() {
  return (
    <ErrorBoundary>
      <InfoMessage />
      <AppLogout>
        <ScrollToTop>
          <Switch>
            {routes.map((route, i) => (
              <Route key={i} path={route.path} exact={route.exact} component={route.component} />
            ))}
          </Switch>
        </ScrollToTop>
      </AppLogout>
    </ErrorBoundary>
  );
}

export default AppRouter;
