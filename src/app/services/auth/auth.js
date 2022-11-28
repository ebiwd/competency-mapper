import HttpService from '../http/http';
import axios from 'axios';

const http = new HttpService();
const loginUrl = '/user/login?_format=json';

export async function login(username, password) {
  const credentials = { name: username, pass: password };
  try {
    const response = await http.post(loginUrl, credentials);
    const { data } = response;
    localStorage.setItem('roles', data.current_user.roles);
    localStorage.setItem('csrf_token', data.csrf_token);
    localStorage.setItem('logout_token', data.logout_token);
    localStorage.setItem('user', data.current_user.name);
    localStorage.setItem('userid', data.current_user.uid);
    console.log(localStorage.getItem('roles'));
    return data;
  } catch (error) {
    logout();
    alert(`Login failed with ${error.response.data}`);
  }
}

export function logout() {
  let logout_token = localStorage.getItem('logout_token');
  axios
    .get(
      `${
        process.env.REACT_APP_HTTPS_CMS_API_URL
      }/user/logout?_format=json&token=${logout_token}`,
      {
        withCredentials: true
      }
    )
    .then(() => {
      localStorage.removeItem('roles');
      localStorage.removeItem('csrf_token');
      localStorage.removeItem('logout_token');
      localStorage.removeItem('userid');
      localStorage.removeItem('user');
    });
}

export async function getLoggedInUser() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${process.env.REACT_APP_HTTPS_CMS_API_URL}/api/users?_format=json`)
      .then(response => {
        resolve(response.data.user);
      })
      .catch(error => {
        reject(error);
      });
  });
}
