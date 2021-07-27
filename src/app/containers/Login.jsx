import React, { Component } from 'react';
import PropTypes from 'prop-types';

import LoginForm from './login-form/LoginForm';
import { login, logout } from '../services/auth/auth';

class Login extends Component {
  static propTypes = {
    user: PropTypes.string.isRequired,
    roles: PropTypes.string.isRequired,
    onLogin: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired
  };

  onLogin = (username, password) => {
    login(username, password);
  };

  onLogout = () => {
    logout();
  };

  render() {
    //const { roles, user, isActive } = this.props;
    const { roles, user } = this.props;

    return (
      <div>
        {user && roles ? (
          <h2>You are logged in</h2>
        ) : (
          <LoginForm onSubmit={this.onLogin} />
        )}
      </div>
    );
  }
}

export default Login;
