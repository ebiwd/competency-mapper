import axios from 'axios';

export default {
  currently_logged_in_user: {
    id: null,
    username: '',
    is_logged_in: false,
    roles: []
  },
  no_of_times_api_has_been_called: 0,
  getLoggedInUser() {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `${process.env.REACT_APP_HTTPS_CMS_API_URL}/api/users?_format=json`
        )
        .then(response => {
          this.currently_logged_in_user = response.data.user;
          this.no_of_times_api_has_been_called += 1;
          // alert(this.no_of_times_api_has_been_called);
          resolve(response.data.user);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};
