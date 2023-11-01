/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
import { useEffect } from 'react';
import axios from 'axios';

const events = [
  'load',
  'mousemove',
  'mousedown',
  'click',
  'scroll',
  'keypress',
];

const AppLogout = ({ children }) => {
  let timer;

  useEffect(() => {
    // if (window.location.pathname !== '/') {
    Object.values(events).forEach((item) => {
      window.addEventListener(item, () => {
        resetTimer();
        handleTimer();
      });
    });
    // }
  }, []);

  const resetTimer = () => {
    if (timer) clearTimeout(timer);
  };

  const handleTimer = () => {
    let autoLogOutPeriod = 300000;

    if (sessionStorage.getItem('companySettings') !== undefined && sessionStorage.getItem('companySettings') !== null) {
      autoLogOutPeriod = JSON.parse(
        sessionStorage.getItem('companySettings'),
      ).filter((item) => item.name === 'AUTO_LOGOUT_PERIOD')[0] === undefined ? 300000 : JSON.parse(
          sessionStorage.getItem('companySettings'),
        ).filter((item) => item.name === 'AUTO_LOGOUT_PERIOD')[0]
          .value || 300000;
    }

    timer = setTimeout(() => {
      resetTimer();
      Object.values(events).forEach((item) => {
        window.removeEventListener(item, resetTimer);
      });
      logoutAction();
    }, autoLogOutPeriod);
  };

  const logoutAction = () => {
    const data = {
      userId: sessionStorage.getItem('userId'),
    };
    const auth = {
      Authorization: `Bearer ${sessionStorage.getItem('AuthToken')}`,
      'Access-Control-Allow-Origin': '*',
    };
    const config = { headers: auth };
    if (window.location.pathname !== '/') {
      axios
        .post(`${process.env.REACT_APP_HOST}/api/v1/auth/logout`, data, config)
        .then(async () => {
          localStorage.clear();
          window.location.pathname = '/';
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  return children;
};

export default AppLogout;
