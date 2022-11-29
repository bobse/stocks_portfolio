import * as constants from '../constants';
import axios from 'axios';

const auth = {
  async login(credentials) {
    const headers = { 'Content-Type': 'application/json' };
    return axios.post(constants.APILOGIN, credentials, { headers });
  },

  saveToken(data) {
    localStorage.setItem('token', JSON.stringify(data));
  },

  saveProfile(userData) {
    const profile = this.getProfile();
    if (profile) {
      profile.user = userData;
      this.saveToken(profile);
    }
  },

  getProfile() {
    return JSON.parse(localStorage.getItem('token'));
  },

  getAccessToken() {
    const userToken = JSON.parse(localStorage.getItem('token'));
    if (userToken) {
      return userToken['token'];
    }
  },

  isAuthenticated() {
    const token = this.getProfile();
    var currentTime = new Date();
    if (token && new Date(token['expiry']) > currentTime) {
      return true;
    } else {
      return false;
    }
  },

  getLastLogin() {
    const previousLogin = JSON.parse(localStorage.getItem('token'));
    if (previousLogin) {
      return previousLogin['user']['previous_login'];
    }
  },
  removeToken() {
    localStorage.removeItem('token');
  },
  logout() {
    const headers = {
      Authorization: 'Token ' + this.getAccessToken(),
      'Content-Type': 'application/json',
    };
    axios
      .post(constants.APILOGOUT, '', { headers })
      .then(() => {
        window.location = constants.LOGOUT;
        this.removeToken();
      })
      .catch(() => {});
  },

  silentAuth() {
    if (this.isAuthenticated()) {
      const headers = {
        Authorization: 'Token ' + this.getAccessToken(),
        'Content-Type': 'application/json',
      };
      axios.post(constants.APIUSER, '', { headers }).then(response => {
        let data = this.getProfile();
        data['user'] = response.data;
        this.saveToken(data);
      });
    }
  },

  async verifyEmail(inputData) {
    const data = { token: inputData[0], uidb64: inputData[1] };
    return await axios.post(constants.APIVERIFYEMAIL, data);
  },
};

export default auth;
