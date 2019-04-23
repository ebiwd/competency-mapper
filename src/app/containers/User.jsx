import React from 'react';
import { Link } from 'react-router-dom';

import { apiUrl } from '../services/competency/competency';

const $ = window.$;

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      roles: '',
      user: ''
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.roles !== nextState.roles || this.state.user !== nextState.user
    );
  }

  componentDidMount() {
    if (localStorage.getItem('roles')) {
      this.setState({
        roles: localStorage.getItem('roles'),
        user: localStorage.getItem('user')
      });
    }
    $(this.refs.nav).foundation();
  }

  handleLogin() {
    let username = this.refs.username.value;
    let password = this.refs.password.value;
    let url = `${apiUrl}/user/login?_format=json`;
    fetch(url, {
      credentials: 'include',
      method: 'POST',
      cookies: 'x-access-token',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: username,
        pass: password
      })
    })
      .then(resp => resp.json())
      .then(data => {
        if (data.message) {
          //console.log("Bad credentials")
          alert('Bad credentials');
        } else {
          localStorage.setItem('roles', data.current_user.roles);
          localStorage.setItem('csrf_token', data.csrf_token);
          localStorage.setItem('logout_token', data.logout_token);
          localStorage.setItem('user', data.current_user.name);
          localStorage.setItem('userid', data.current_user.uid);
          // console.log(data);
          this.setState({ roles: localStorage.getItem('roles') });
          this.setState({ user: localStorage.getItem('user') });
          // TODO: remove this
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      });
  }

  handleLogout() {
    fetch(
      `${apiUrl}` +
        '/user/logout?csrf_token=' +
        localStorage.getItem('csrf_token'),
      {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then(resp => resp)
      .then(
        data => this.setState({ userid: '' }),
        localStorage.removeItem('roles'),
        localStorage.removeItem('csrf_token'),
        localStorage.removeItem('logout_token'),
        this.setState({ roles: '' }),
        setTimeout(() => {
          window.location.reload();
        }, 1000)
      );
  }

  render() {
    let output = '';
    if (localStorage.getItem('roles')) {
      output = (
        <nav ref="nav" id="local-nav">
          <ul
            className="dropdown menu float-left"
            data-dropdown-menu
            data-description="navigational"
          >
            {localStorage.getItem('roles').includes('framework_manager') ? (
              <li>
                <a // eslint-disable-line jsx-a11y/anchor-is-valid
                  tabIndex="0"
                  className="dropdown-on-dark-background"
                >
                  Manage Competencies
                </a>
                <ul className="menu vertical">
                  <li>
                    <Link to="/framework/bioexcel/manage/competencies">
                      BioExcel
                    </Link>
                  </li>
                  <li>
                    <Link to="/framework/corbel/manage/competencies">
                      CORBEL
                    </Link>
                  </li>
                  <li>
                    <Link to="/framework/iscb/manage/competencies">ISCB</Link>
                  </li>
                  <li>
                    <Link to="/framework/ritrain/manage/competencies">
                      RITrain
                    </Link>
                  </li>
                  <li>
                    <Link to="/framework/nhs/manage/competencies">NHS</Link>
                  </li>
                </ul>
              </li>
            ) : (
              ''
            )}
            {localStorage.getItem('roles').includes('content_manager') ? (
              <li>
                <Link to="/all-training-resources">
                  Manage Training Resources
                </Link>
              </li>
            ) : (
              ''
            )}
          </ul>
          <ul
            className="dropdown menu float-right"
            data-dropdown-menu
            data-description="user tasks"
          >
            <li>
              <a // eslint-disable-line jsx-a11y/anchor-is-valid
                tabIndex="0"
                className="dropdown-on-light-background"
              >
                <i className="fas fa-user" /> Hi {this.state.user}
              </a>
              <ul className="menu vertical">
                <li>
                  <Link to={'/user/change/password'}>Change password</Link>
                </li>
                <li>
                  <a // eslint-disable-line jsx-a11y/anchor-is-valid
                    onClick={() => this.handleLogout()}
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      );
    } else {
      output = (
        <div style={{ width: '500px', right: '10px' }}>
          <form id={'login_form'}>
            <div className="row">
              <div className="large-5 columns">
                <input
                  ref={'username'}
                  type={'text'}
                  placeholder={'Username'}
                />
              </div>
              <div className="large-4 columns">
                <input
                  ref={'password'}
                  type={'password'}
                  placeholder={'Password'}
                />
              </div>
              <div className="large-3 columns">
                <button className="button" onClick={() => this.handleLogin()}>
                  <i className="fa fa-key" aria-hidden="true" /> Login
                </button>
              </div>
            </div>
          </form>
        </div>
      );
    }

    return output;
  }
}

export default User;
