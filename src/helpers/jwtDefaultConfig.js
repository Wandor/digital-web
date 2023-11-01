// ** Auth Endpoints
export default {
  loginEndpoint: `${process.env.REACT_APP_HOST}/api/v1/auth/otpverify`,
  // eslint-disable-next-line quotes
  refreshEndpoint: `${process.env.REACT_APP_HOST}/api/v1/auth/refreshtoken`,
  // logoutEndpoint: "/jwt/logout",

  // ** This will be prefixed in authorization header with token
  tokenType: 'Bearer ',

  // ** Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'AuthToken',
  storageRefreshTokenKeyName: 'refreshToken',
};
