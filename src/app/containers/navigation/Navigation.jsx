import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { apiUrl } from '../../services/http/http';
import auth from '../../services/util/auth';

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
    let token = localStorage.getItem('csrf_token');
    fetch(`${apiUrl}/api/authorisation/${this.state.user}?_format=json`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'X-CSRF-Token': token
      }
    })
      .then(Response => Response.json())
      .then(findresponse => {
        this.setState({
          frameworks: findresponse
        });
      });
  }
  render() {
    const { roles } = this.props;
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
          <Link className="vf-link" to="/all-training-resources">
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
          <span
            className="vf-link"
            href="#" // eslint-disable-line jsx-a11y/anchor-is-valid
            onClick={event => {
              event.preventDefault();
              auth.logout().then(() => {
                window.location.reload();
              });
            }}
            style={{ cursor: 'pointer' }}
          >
            Logout
          </span>
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
