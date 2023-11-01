/* eslint-disable react/function-component-definition */
/* eslint-disable max-len */
import React from 'react';
import { Alert } from 'react-bootstrap';

function AlertDisplay(props) {
  return (
    <Alert
      dismissible
      variant={props.error ? 'danger' : props.success ? 'success' : 'warning'}
      className="rounded"
      onClose={props.closeAlert}
    >
      {props.error ? props.errorMessage : props.success ? props.successMessage : props.warningMessage}
    </Alert>
  );
}

AlertDisplay.defaultProps = {
  error: false,
  errorMessage: '',
  success: false,
  successMessage: '',
};

export default AlertDisplay;
