/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
const Env = () => { };

(Env.init = () => {
  // eslint-disable-next-line no-useless-escape
  Env.emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  Env.mobile = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
  Env.telephone = /^\d{10}$/;
  Env.TTLV = 600000; // Time to live
  Env.TTR = 300000; // Time to Refresh
  Env.initial = 0;

  Env.refreshPage = () => {
    window.location.reload();
  };

  function resetTimer() {
    sessionStorage.setItem('initialTime', new Date());
  }

  window.onload = resetTimer;
  window.onmousedown = resetTimer;
  window.onmousemove = resetTimer;
  window.ontouchstart = resetTimer;
  window.onclick = resetTimer;
  window.onkeypress = resetTimer;
  window.addEventListener('scroll', resetTimer, true);

  const startDate = sessionStorage.getItem('initialtime');
  // Do your operations
  const endDate = new Date();

  Env.validateEmail = (email) => Env.emailRe.test(String(email).toLowerCase());

  Env.validateMobile = (mobile) => Env.mobile.test(String(mobile).toLowerCase());

  Env.validateTelephone = (telephone) => Env.telephone.test(String(telephone).toLowerCase());

  Env.initMap = () => {
    const componentForm = [
      'location',
      'locality',
      'administrative_area_level_1',
      'country',
      'postal_code',
    ];

    const autocompleteInput = document.getElementById('location');
    const autocomplete = new window.google.maps.places.Autocomplete(
      autocompleteInput,
    );

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert(`No details available for input: '${place.name}'`);
        return;
      }
      Env.physicalAddress = place.formatted_address;
      fillInAddress(place);
    });

    function fillInAddress(place) {
      // optional parameter
      // const addressNameFormat = {
      //   street_number: "short_name",
      //   route: "long_name",
      //   locality: "long_name",
      //   administrative_area_level_1: "short_name",
      //   country: "long_name",
      //   postal_code: "short_name",
      // };
      // const getAddressComp = function (type) {
      //   for (const component of place.address_components) {
      //     if (component.types[0] === type) {
      //       return component[addressNameFormat[type]];
      //     } else {
      //       return "";
      //     }
      //   }
      //   return "";
      // };
      document.getElementById('physicalAddress').value = place.name;
      // for (const component of componentForm) {
      //   // Location field is handled separately above as it has different logic.
      //   if (component !== "location") {
      //     document.getElementById(component).value =
      //       getAddressComp(component);
      //   }
      // }
      localStorage.setItem('businessCoordinates', place.geometry.location.lat());
      localStorage.setItem('residenceCoordinates', place.geometry.location.lng());

      return place;
    }

    return location;
  };
})();
