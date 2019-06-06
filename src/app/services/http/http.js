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
    // return this.executeFetch(url);
    return axios.get(url);
  }

  post(url, body) {
    // return this.executeFetch(url, {
    //   method: 'POST',
    //   credentials: 'include',
    //   headers: this.headers.get(),
    //   body: body,
    // });
    return axios.post(url, body, {
      headers: this.headers.get(),
      withCredentials: true
    });
  }

  patch(url, body) {
    //return this.executeFetch(url, {
    //  method: 'PATCH',
    //  credentials: 'include',
    //  headers: this.headers.get(),
    //  body: body,
    //});
    return axios.patch(url, body, {
      headers: this.headers.get(),
      withCredentials: true
    });
  }

  // async executeFetch(url, options = {}) {
  //   try {
  //     const response = await fetch(url, options);
  //     if (!response.ok) {
  //       return this.handleNotOkResponses(response);
  //     }
  //     return response;
  //   } catch (error) {
  //     return this.handleNetworkErrors(error);
  //   }
  // }

  // handleNetworkErrors(error) {
  //   this.inform('Network problem!');
  //   return Promise.reject(error);
  // }

  // handleNotOkResponses(response) {
  //   const is500Error = response.status >= 500 && response.status < 600;

  //   if (is500Error) {
  //     this.inform('Unknown server error!');
  //   }

  //   return Promise.reject(response);
  // }

  // inform(message) {
  //   // TODO: inform error to the user through a toast service, for example.
  //   // window.alert(message);
  // }
}

export default HttpService;
