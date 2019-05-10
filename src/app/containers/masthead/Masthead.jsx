import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Navigation from '../navigation/Navigation';
import LoginForm from '../login-form/LoginForm';

class Masthead extends Component {
  static propTypes = {
    user: PropTypes.string.isRequired,
    roles: PropTypes.string.isRequired,
    onLogin: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired
  };

  onLogin = (username, password) => {
    this.props.onLogin(username, password);
  };

  onLogout = () => {
    this.props.onLogout();
  };

  render() {
    const { roles, user } = this.props;

    return (
      <div data-sticky-container>
        <header
          id="masthead"
          className="masthead"
          data-sticky
          data-sticky-on="large"
          data-top-anchor="main-content-area:top"
          data-btm-anchor="main-content-area:bottom"
        >
          <div className="masthead-inner row">
            <div className="columns medium-12" id="local-title">
              <h1>
                <Link to="/">Competency Mapper</Link>
              </h1>
            </div>
            {user && roles ? (
              <Navigation roles={roles} user={user} onLogout={this.onLogout} />
            ) : (
              <LoginForm onSubmit={this.onLogin} />
            )}
          </div>
        </header>
      </div>
    );
  }
}

export default Masthead;
