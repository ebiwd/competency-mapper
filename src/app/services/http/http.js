import Headers from './headers';
import axios from 'axios';

const checkUser = localStorage.getItem('userid');

// export const apiUrl = checkUser
//   ? process.env.REACT_APP_CMS_API_URL
//   : process.env.REACT_APP_API_URL;

export const apiUrl = process.env.REACT_APP_CMS_API_URL;

axios.defaults.baseURL = apiUrl;

const needTimeStamp = checkUser ? '&timestamp=' + Date.now() : '';

class HttpService {
  static instance;
  headers = new Headers();

  constructor() {
    if (HttpService.instance) {
      return HttpService.instance;
    }

    HttpService.instance = this;
  }

  get(url, credentialType = '') {
    if (credentialType) {
      return axios.get(url, {
        headers: this.headers.get(credentialType),
        withCredentials: true
      });
    }
    return axios.get(url + '&source=competencyhub' + needTimeStamp);
  }

  post(url, body, option = 'hal+json') {
    return axios.post(process.env.REACT_APP_CMS_API_URL + url, body, {
      headers: this.headers.get(option),
      withCredentials: true
    });
  }

  patch(url, body, option = 'hal+json') {
    return axios.patch(process.env.REACT_APP_CMS_API_URL + url, body, {
      headers: this.headers.get(option),
      withCredentials: true
    });
  }
}

export default HttpService;
