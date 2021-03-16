import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { apiUrl } from '../../services/http/http';
import HttpService from '../../services/http/http';
//import ManageFrameworks from './ManageFrameworks';

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
    //$(this.navRef.current).foundation();
    fetch(`${apiUrl}/api/authorisation/${this.state.user}?_format=json`, {
      method: 'GET',
      credentials: 'include'
    })
      .then(Response => Response.json())
      .then(findresponse => {
        this.setState({
          frameworks: findresponse
        });
      });
  }

  logout = () => {
    const { onLogout } = this.props;
    onLogout();
  };

  render() {
    const { roles, user } = this.props;
    const frameworkResources = (
      <>
        <li className="vf-list__item" key="navigation">
          <Link
            className="vf-link"
            to="/manage-frameworks" // eslint-disable-line jsx-a11y/anchor-is-valid
            tabIndex="0"
          >
            Manage frameworks
          </Link>
        </li>
        <li className="vf-list__item" style={{ padding: '5px' }}>
          |
        </li>
      </>
    );

    const trainingResources = (
      <>
        <li className="vf-list__item" key="resources">
          <Link className="vf-link" to="all-training-resources">
            Manage Training Resources
          </Link>
        </li>
        <li className="vf-list__item" style={{ padding: '5px' }}>
          |
        </li>
      </>
    );

    const userDropdown = (
      <>
        <li
          className="vf-list__item"
          key="myaccount"
          style={{ padding: '5px' }}
        >
          <Link className="vf-link" to={'/user/view'}>
            My account
          </Link>
        </li>
        <li
          className="vf-list__item"
          key="changepwd"
          style={{ padding: '5px' }}
        >
          <Link className="vf-link" to={'/user/change/password'}>
            Change password
          </Link>
        </li>
        <li className="vf-list__item" style={{ padding: '5px' }}>
          <a
            className="vf-link"
            href="#" // eslint-disable-line jsx-a11y/anchor-is-valid
            onClick={this.logout}
          >
            Logout
          </a>
        </li>
      </>
    );

    return (
      <div>
        <div className="vf-breadcrumbs">
          <ul className="vf-breadcrumbs__list | vf-list vf-list--inline">
            {roles.includes('framework_manager') && frameworkResources}
            {roles.includes('content_manager') && trainingResources}
            {userDropdown}
          </ul>
        </div>
      </div>
    );
  }
}

export default Navigation;
