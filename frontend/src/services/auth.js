import * as constants from "../constants";
import axios from "axios";

const auth = {
   async login() {
      window.location = constants.APILOGIN;
   },
   async logout() {
      await axios.post(constants.APILOGOUT);
      window.location = "/login";
   },
};

export default auth;
