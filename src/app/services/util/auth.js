import axios from 'axios';

export default {
  csrf_token: localStorage.getItem('csrf_token'),
  currently_logged_in_user: {
    id: null,
    username: '',
    is_logged_in: false,
    roles: []
  },
  getLoggedInUser() {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `${process.env.REACT_APP_HTTPS_CMS_API_URL}/api/users?_format=json`,
          {
            withCredentials: true
          }
        )
        .then(response => {
          this.currently_logged_in_user = response.data.user;
          resolve(response.data.user);
        })
        .catch(error => {
          console.log('error caught', error);
          reject(error);
        });
    });
  },
  logout() {
    return new Promise((resolve, reject) => {
      let logout_token = localStorage.getItem('logout_token');
      axios
        .get(
          `${
            process.env.REACT_APP_HTTPS_CMS_API_URL
          }/user/logout?_format=json&token=${logout_token}&timestamp=${Date.now()}`,
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
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};
