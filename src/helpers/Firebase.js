import firebase from 'firebase';
import 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyC5zornGzxXH5tuw2weNLCJyHfQV7bSobE',
  authDomain: 'digital-field-application.firebaseapp.com',
  databaseURL: 'https://digital-field-application.firebaseio.com',
  projectId: 'digital-field-application',
  storageBucket: 'digital-field-application.appspot.com',
  messagingSenderId: '533403282738',
  appId: '1:533403282738:web:789122901386899c8bbb2b',
  measurementId: 'G-LEL65NY7ZC',
};

firebase.initializeApp(firebaseConfig);

// firebase.analytics();
firebase.analytics.isSupported().then((isSupported) => {
  if (isSupported) {
    // eslint-disable-next-line no-undef
    firebase.analytics();
  }
});

export default firebase;
