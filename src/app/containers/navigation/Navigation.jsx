import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { apiUrl } from '../../services/http/http';
import HttpService from '../../services/http/http';

const http = new HttpService();

const $ = window.$;

class Navigation extends Component {
  navRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      frameworks: []
    };
  }

  componentDidMount() {
    $(this.navRef.current).foundation();
    fetch(`${apiUrl}/api/authorisation/${this.state.user}?_format=json`, {
      method: 'GET',
      credentials: 'include'
    })
      .then(Response => Response.json())
      .then(findresponse => {
        this.setState({
          frameworks: findresponse
        });
        //console.log(findresponse)
      });
  }

  logout = () => {
    const { onLogout } = this.props;
    onLogout();
  };

  render() {
    const { roles, user } = this.props;
    const frameworkResources = (
      <li key="navigation">
        <a // eslint-disable-line jsx-a11y/anchor-is-valid
          tabIndex="0"
          className="dropdown-on-dark-background"
        >
          Manage Competencies
        </a>
        <ul className="menu vertical">
          {this.state.frameworks ? (
            this.state.frameworks.map(framework => {
              return (
                <li key={framework}>
                  <Link
                    to={`/framework/${framework
                      .toLowerCase()
                      .replace(/\s+/g, '')}/manage/data`}
                  >
                    {framework}
                  </Link>
                </li>
              );
            })
          ) : (
            <li style={{ color: '#000' }}>
              No Framework assigned to this user.
            </li>
          )}
        </ul>
      </li>
    );

    const trainingResources = (
      <li key="resources">
        <Link to="/all-training-resources">Manage Training Resources</Link>
      </li>
    );

    const userDropdown = (
      <li key="dropdown-on-light-background">
        <a // eslint-disable-line jsx-a11y/anchor-is-valid
          tabIndex="0"
          className="dropdown-on-light-background"
        >
          <i className="fas fa-user" /> Hi {user}
        </a>
        <ul className="menu vertical">
          <li key="myaccount">
            <Link to={'/user/view'}>My account</Link>
          </li>
          <li key="changepwd">
            <Link to={'/user/change/password'}>Change password</Link>
          </li>
          <li>
            <a // eslint-disable-line jsx-a11y/anchor-is-valid
              onClick={this.logout}
            >
              Logout
            </a>
          </li>
        </ul>
      </li>
    );

    return (
      <nav ref={this.navRef}>
        <ul
          className="dropdown menu float-left"
          data-dropdown-menu
          data-description="navigational"
        >
          {roles.includes('framework_manager') && frameworkResources}
          {roles.includes('content_manager') && trainingResources}
        </ul>
        <ul
          className="dropdown menu float-right"
          data-dropdown-menu
          data-description="user tasks"
        >
          {userDropdown}
        </ul>
      </nav>
    );
  }
}

export default Navigation;
