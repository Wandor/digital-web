import React from 'react';

class Footer extends React.Component {
  render() {
    return (
      <footer className="footer mt-2">
        <p>
          ©
          {' '}
          <a href="http://www.opentechglobal.co.ke/" rel="noopener noreferrer" target="_blank">
            Opentech Global Services Ltd
          </a>
          ,
          {' '}
          All Rights Reserved.
        </p>
      </footer>
    );
  }
}

export default Footer;
