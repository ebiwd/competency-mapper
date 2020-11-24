import React, { Component } from 'react';
import PropTypes from 'prop-types';

import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

class LoginForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  state = {
    username: '',
    password: ''
  };

  onChange = event => {
    this.setState({ [event.currentTarget.name]: event.currentTarget.value });
  };

  OpenModal(e) {
    e.preventDefault();
    this.setState({ showModal: true });
  }

  CloseModal() {
    this.setState({ showModal: false });
    //console.log(this.state.showModal)
  }

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
        <a
          style={{ float: 'right', color: '#000' }}
          href={'#'}
          id="loginSwitch"
          onClick={e => this.OpenModal(e)}
        >
          Admin login <i className="fa fa-key" aria-hidden="true" />
        </a>
        <Modal
          open={this.state.showModal}
          onClose={e => this.CloseModal()}
          center
          classNames={{
            overlay: 'customOverlay',
            modal: 'customModal'
          }}
        >
          <ul id="loginForm" className="menu float-left small-12">
            <li className="small-12 margin-bottom-large">
              <div className="columns small-12 medium-12 large-12 margin-top-large">
                <h3>Admin login</h3>
                <p>
                  If you are a framework manager or content manager, please
                  login to continue
                </p>
              </div>
              <label className="columns small-12 medium-12 large-12 margin-top-large">
                <input
                  value={username}
                  name="username"
                  onChange={event => this.onChange(event)}
                  type="text"
                  autoComplete="username"
                  placeholder="Username"
                />
              </label>
              <label className="columns small-12 medium-12 large-12 margin-top-large">
                <input
                  value={password}
                  name="password"
                  onChange={event => this.onChange(event)}
                  type="password"
                  autoComplete="current-password"
                  placeholder="Password"
                />
              </label>
              <div className="columns small-12 medium-12 large-12 margin-top-large">
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
        </Modal>
      </nav>
    );
  }
}

export default LoginForm;
