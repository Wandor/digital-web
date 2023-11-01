/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-useless-escape */
/* eslint-disable no-use-before-define */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */

const convertedVapidKey = urlBase64ToUint8Array(
  'BOj6o6wkbaYdeBzpAZHI3sbxkhWWr-0BWYX4ktK4kMaBN0RfNXkUDkhZyBwIUIGsaGs07X-NyexrnfbF0CsJKsc',
);

const axios = require('axios');

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  // eslint-disable-next-line
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function sendSubscription(subscription) {
  // eslint-disable-next-line no-unused-vars

  return fetch(
    `${
      process.env.REACT_APP_HOST
    }/api/v1/notifications/subscribe/${sessionStorage.getItem('userId')}`,
    {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('AuthToken')}`,
        'Access-Control-Allow-Origin': '*',
      },
    },
  ).then((response) => response).catch((error) => error);
}

export function subscribeUser() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        if (!registration.pushManager) {
          console.log('Push manager unavailable.');
          return;
        }

        registration.pushManager
          .getSubscription()
          .then((existedSubscription) => {
            if (existedSubscription === null) {
              console.log('No subscription detected, make a request.');
              registration.pushManager
                .subscribe({
                  applicationServerKey: convertedVapidKey,
                  userVisibleOnly: true,
                })
                .then((newSubscription) => {
                  console.log('New subscription added.');
                  // sendSubscription(newSubscription);
                })
                .catch((e) => {
                  if (Notification.permission !== 'granted') {
                    console.log('Permission was not granted.');
                  } else {
                    console.error(
                      'An error ocurred during the subscription process.',
                      e,
                    );
                  }
                });
            } else {
              console.log('Existed subscription detected.');
              // sendSubscription(existedSubscription);
            }
          });
      })
      .catch((e) => {
        console.error(
          'An error ocurred during Service Worker registration.',
          e,
        );
      });
  }
}
