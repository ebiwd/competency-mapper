import Headers from './headers';
import axios from 'axios';

const checkUser = localStorage.getItem('userid');

export const apiUrl = checkUser
  ? process.env.REACT_APP_HTTPS_CMS_API_URL
  : process.env.REACT_APP_API_URL;

// export const apiUrl = process.env.REACT_APP_HTTPS_CMS_API_URL;

/* note that for API requests that include the _links: {type: {href:''}} parameter, the request fails if the href value
is preceded with HTTPS. it only works if HTTP is used instead. Drupal responds with an error message such as:
message: "Type https://cms.competency.ebi.ac.uk/rest/type/node/training_resource does not correspond to an entity on
this site." but when HTTP is used instead of HTTPS, Drupal is able to recognise the resource. Thus, to avoid this error,
we use process.env.REACT_APP_HTTP_CMS_API_URL as seen in the variable declared below.
NOTE that, the href mentioned here is not referring to the address of the API request, rather we are referring to the
href value passed in the _links.type.href request parameter as stated above.
 */
export const apiUrlWithHTTP = process.env.REACT_APP_HTTP_CMS_API_URL;

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
    return axios.post(apiUrl + url, body, {
      headers: this.headers.get(option),
      withCredentials: true
    });
  }

  patch(url, body, option = 'hal+json') {
    return axios.patch(apiUrl + url, body, {
      headers: this.headers.get(option),
      withCredentials: true
    });
  }
}

export default HttpService;
