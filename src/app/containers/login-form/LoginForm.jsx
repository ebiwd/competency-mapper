import React, { Component } from 'react';
import PropTypes from 'prop-types';

class LoginForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired
  };

  state = {
    username: '',
    password: ''
  };

  onChange = event => {
    this.setState({ [event.currentTarget.name]: event.currentTarget.value });
  };

  submit = () => {
    const { onSubmit } = this.props;
    const { username, password } = this.state;
    if (username && password) {
      onSubmit(username, password);
    }
  };

  render() {
    const { username, password } = this.state;
    return (
      <nav>
        {/* The wrapping in an `ul.menu.float-left > li` is necessary for the sticky header to work */}
        <ul className="menu float-left small-12">
          <li className="small-12 margin-bottom-large">
            <label className="columns small-4 medium-3 large-2 margin-top-large">
              <input
                value={username}
                name="username"
                onChange={event => this.onChange(event)}
                type="text"
                autoComplete="username"
                placeholder="Username"
              />
            </label>
            <label className="columns small-4 medium-3 large-2 margin-top-large">
              <input
                value={password}
                name="password"
                onChange={event => this.onChange(event)}
                type="password"
                autoComplete="current-password"
                placeholder="Password"
              />
            </label>
            <div className="columns small-4 medium-6 large-8 margin-top-large">
              <button
                className="button"
                type="button"
                onClick={() => this.submit()}
              >
                <i className="fa fa-key" aria-hidden="true" /> Login
              </button>
            </div>
          </li>
        </ul>
      </nav>
    );
  }
}

export default LoginForm;
