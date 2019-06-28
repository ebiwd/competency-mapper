import Headers from './headers';
import axios from 'axios';

class HttpService {
  static instance;
  headers = new Headers();

  constructor() {
    if (HttpService.instance) {
      return HttpService.instance;
    }

    HttpService.instance = this;
  }

  get(url) {
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
