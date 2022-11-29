var API_SERVER, REACT_SERVER;
if (process.env.NODE_ENV === 'production') {
  API_SERVER = 'https://directorscut-q2mgsgixya-uc.a.run.app/';
  REACT_SERVER = 'https://directorscut.robertoseba.com';
} else {
  API_SERVER = 'http://192.168.15.10:8000';
  REACT_SERVER = 'http://192.168.15.10:3000';
}

export const SERVER = API_SERVER;
export const APIUSER = API_SERVER + '/api/account/silentauth/';
export const APILOGIN = API_SERVER + '/api/account/login/';
export const APIUPDATEUSER = API_SERVER + '/api/account/update/';
export const APISIGNUP = API_SERVER + '/api/account/create/';
export const APISEARCH = API_SERVER + '/api/core/directors/';
export const APITRENDING = API_SERVER + '/api/core/directors/trending/';
export const APIVERIFYEMAIL = API_SERVER + '/api/account/verify/';
export const APIFORGOTPASSWORD = API_SERVER + '/api/account/forgotpassword/';
export const APINEWPASSWORD = API_SERVER + '/api/account/newpassword/';
export const APILOGOUT = API_SERVER + '/api/account/logout/';
export const APIADDIMDBDIRECTOR = API_SERVER + '/api/core/directors/add/';
export const APIDIRECTOR = API_SERVER + '/api/core/user/directors/';
export const APIMOVIE_WISH_WATCH = API_SERVER + '/api/core/user/movies/';
export const LOGOUT = REACT_SERVER;
