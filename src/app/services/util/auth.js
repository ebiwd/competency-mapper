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
            withCredentials: true,
            headers: {
              Accept: 'application/hal+json',
              'Content-Type': 'application/hal+json',
              'X-CSRF-Token': this.csrf_token,
              Authorization: 'Basic'
            }
          }
        )
        .then(response => {
          this.currently_logged_in_user = response.data.user;
          resolve(response.data.user);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};
