import Headers from './headers';
import axios from 'axios';

export const apiUrl = process.env.REACT_APP_API_URL;

axios.defaults.baseURL = apiUrl;

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
    return axios.get(url);
  }

  post(url, body, option = 'hal+json') {
    return axios.post(url, body, {
      headers: this.headers.get(option),
      withCredentials: true
    });
  }

  patch(url, body, option = 'hal+json') {
    return axios.patch(url, body, {
      headers: this.headers.get(option),
      withCredentials: true
    });
  }
}

export default HttpService;
