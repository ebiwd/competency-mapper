class HttpService {
  constructor() {}

  async get(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return this.handleNotOkResponses(response);
      }
      return response;
    } catch (error) {
      return this.handleNetworkErrors(error);
    }
  }

  post() {}

  patch() {}

  handleNetworkErrors(error) {
    this.inform('Network problem!');
    return Promise.reject(error);
  }

  handleNotOkResponses(response) {
    const is500Error = response.status >= 500 && response.status < 600;

    if (is500Error) {
      this.inform('Unknown server error!');
    }

    return Promise.reject(response);
  }

  inform(message) {
    // TODO: inform error to the user through a toast service, for example.
    // window.alert(message);
  }
}

export default HttpService;
