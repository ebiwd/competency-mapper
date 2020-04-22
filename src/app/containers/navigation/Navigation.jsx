import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const $ = window.$;

class Navigation extends Component {
  navRef = React.createRef();

  componentDidMount() {
    $(this.navRef.current).foundation();
  }

  logout = () => {
    const { onLogout } = this.props;
    onLogout();
  };

  render() {
    const { roles, user } = this.props;

    const frameworkResources = (
      <li>
        <a // eslint-disable-line jsx-a11y/anchor-is-valid
          tabIndex="0"
          className="dropdown-on-dark-background"
        >
          Manage Competencies
        </a>
        <ul className="menu vertical">
          <li>
            <Link to="/framework/bioexcel/manage/competencies">BioExcel</Link>
          </li>
          <li>
            <Link to="/framework/corbel/manage/competencies">CORBEL</Link>
          </li>
          <li>
            <Link to="/framework/iscb/manage/competencies">ISCB</Link>
          </li>
          <li>
            <Link to="/framework/ritrain/manage/competencies">RITrain</Link>
          </li>
          <li>
            <Link to="/framework/nhs/manage/competencies">NHS</Link>
          </li>
          <li>
            <Link to="/framework/cineca/manage/competencies">CINECA</Link>
          </li>
        </ul>
      </li>
    );

    const trainingResources = (
      <li>
        <Link to="/all-training-resources">Manage Training Resources</Link>
      </li>
    );

    const userDropdown = (
      <li>
        <a // eslint-disable-line jsx-a11y/anchor-is-valid
          tabIndex="0"
          className="dropdown-on-light-background"
        >
          <i className="fas fa-user" /> Hi {user}
        </a>
        <ul className="menu vertical">
          <li>
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
      <nav ref={this.navRef} className="hide-for-print">
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
