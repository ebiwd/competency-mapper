import HttpService from '../http/http';

const http = new HttpService();
const loginUrl = '/user/login?_format=json';
const logoutUrl = '/user/logout';

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
    return data;
  } catch (error) {
    logout();
    throw error;
  }
}

export function logout() {
  localStorage.removeItem('roles');
  localStorage.removeItem('csrf_token');
  localStorage.removeItem('logout_token');
  localStorage.removeItem('userid');
  localStorage.removeItem('user');
  return http.post(logoutUrl);
}
