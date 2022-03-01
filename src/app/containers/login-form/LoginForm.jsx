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
      showModal: false,
      username: '',
      password: ''
    };
  }

  // state = {
  //   username: "",
  //   password: ""
  // };

  onChange = event => {
    this.setState({ [event.currentTarget.name]: event.currentTarget.value });
  };

  OpenModal(e) {
    e.preventDefault();
    this.setState({ showModal: true });
  }

  CloseModal() {
    this.setState({ showModal: false });
  }

  submit = () => {
    console.log('this.submit');
    const { onSubmit } = this.props;
    const { username, password } = this.state;
    if (username && password) {
      onSubmit(username, password);
    }
  };

  render() {
    const { username, password } = this.state;
    return (
      <>
        {/* The wrapping in an `ul.menu.float-left > li` is necessary for the sticky header to work */}
        {/*<button
          style={{ float: 'right' }}
          href={'#'}
          //id="loginSwitch"
          onClick={e => this.OpenModal(e)}
          className="vf-button vf-button--sm vf-button--tertiary vf-button--outline"
        >
          Admin login <i className="fa fa-key" aria-hidden="true" />
        </button>*/}
        <div>
          <h3>
            <a href="#" onClick={e => this.OpenModal(e)}>
              Login as administrator
            </a>
          </h3>
          <p>Manage frameworks and competencies.</p>
        </div>
        <Modal
          open={this.state.showModal}
          onClose={e => this.CloseModal()}
          center
          classNames={{
            overlay: 'customOverlay',
            modal: 'customModal'
          }}
        >
          <div>
            <h3>Admin login</h3>
            <p>
              If you are a framework manager or content manager, please login to
              continue
            </p>
          </div>
          <div className="vf-form__item">
            <input
              value={username}
              name="username"
              onChange={event => this.onChange(event)}
              type="text"
              autoComplete="username"
              placeholder="Username"
              className="vf-form__input"
            />
          </div>
          <div className="vf-form__item">
            <input
              value={password}
              name="password"
              onChange={event => this.onChange(event)}
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              className="vf-form__input"
            />
          </div>
          <div>
            <button
              className="vf-button vf-button--sm vf-button--primary"
              onClick={() => this.submit()}
            >
              <i className="fa fa-key" aria-hidden="true" /> Login
            </button>
          </div>
        </Modal>
      </>
    );
  }
}

export default LoginForm;
