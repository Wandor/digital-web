import React from 'react';

function Loader(props) {
  return (
    <div className="loader" style={{ top: `${props.top}%` }}>
      <div className="spinner-border text-success" role="status">
        <span className="sr-only">{props.message}</span>
      </div>
    </div>
  );
}

Loader.defaultProps = {
  message: 'Loading...',
  top: '50',
};

export default Loader;
