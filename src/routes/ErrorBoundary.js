/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import * as Icon from 'react-feather';
import { Button } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      eventId: '', // add this to state
      errorInfo: '',
      hasError: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidMount() {
    // eslint-disable-next-line no-console
    Sentry.withScope((scope) => {
      scope.setExtras(localStorage.getItem('error'));
      const eventId = Sentry.captureException(localStorage.getItem('error'));
      this.setState({ eventId, errorInfo: localStorage.getItem('error') });
    });
  }

  componentDidCatch(error, errorInfo) {
    Sentry.withScope((scope) => {
      scope.setExtras(errorInfo);
      const eventId = Sentry.captureException(error);
      this.setState({ eventId, errorInfo });
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="page-wrapper">
          <div className="error-content">
            <div className="d-table">
              <div className="d-tablecell">
                <Icon.Frown className="icon" />
                <h1>404</h1>
                <h4>An error occured!</h4>
                <p>
                  An error occured while performing your previous transaction!
                </p>
                <Link
                  to="#"
                  className="back-link"
                  onClick={() => window.location.reload()}
                >
                  Reload
                </Link>
            &nbsp;
                <Button
                  to="#"
                  style={{ borderRadius: '100px' }}
                  variant="outline-secondary"
                  onClick={() => Sentry.showReportDialog({ eventId: this.state.eventId })}
                >
                  Report Issue
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
};

export default withRouter(ErrorBoundary);
