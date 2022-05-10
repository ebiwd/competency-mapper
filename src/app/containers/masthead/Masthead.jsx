import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

//import ProgressBar from '../../../shared/components/progress-bar/progress-bar';
import Navigation from '../navigation/Navigation';
import LoginForm from '../login-form/LoginForm';
import { createBrowserHistory } from 'history';

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
    // const { roles, user, isActive } = this.props;

    const { roles, user, location } = this.props;
    const avoidPath = location.pathname;
    console.log(location.pathname);
    const bgStyle = {
      backgroundImage:
        'url(' +
        JSON.stringify(
          'https://acxngcvroo.cloudimg.io/v7/https://dev-competency-mapper.pantheonsite.io/themes/custom/ebi_academy/images/mastheads/CH_Jigsaw.jpg'
        ) +
        ')',
      marginBottom: 0
    };

    return (
      <>
        {!avoidPath.includes('profile/view') &&
        !avoidPath.includes('profile/create') &&
        !avoidPath.includes('profiles/compare') &&
        !avoidPath.includes('profile/edit') ? (
          <>
            <section className="vf-hero | vf-u-fullbleed" style={bgStyle}>
              <div className="vf-hero__content | vf-box | vf-stack vf-stack--400">
                <h1 className="vf-hero__heading">
                  {/*<a className="vf-hero__heading_link" href="/">*/}
                  Competency Hub
                  {/*</a>*/}
                </h1>
                <p className="vf-hero__subheading">
                  Supporting competency-based training and professional
                  development.
                </p>
                <p className="vf-hero__text">
                  Browse competencies, career profiles and training resources to
                  advance your career.
                </p>{' '}
                <Link className="vf-hero__link" to="/about">
                  Learn more about the Competency Hub
                  <svg
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 12c0 6.627 5.373 12 12 12s12-5.373 12-12S18.627 0 12 0C5.376.008.008 5.376 0 12zm13.707-5.209l4.5 4.5a1 1 0 010 1.414l-4.5 4.5a1 1 0 01-1.414-1.414l2.366-2.367a.25.25 0 00-.177-.424H6a1 1 0 010-2h8.482a.25.25 0 00.177-.427l-2.366-2.368a1 1 0 011.414-1.414z"
                      fill=""
                      fillRule="nonzero"
                    />
                  </svg>
                </Link>
              </div>
            </section>
            <div className="vf-grid">
              <div />
              <div />
              <div />
              <div />
              <div />
              <div>
                {user && roles ? (
                  <Navigation
                    roles={roles}
                    user={user}
                    onLogout={this.onLogout}
                  />
                ) : (
                  '' // <LoginForm onSubmit={this.onLogin} />
                )}
                {/*<ProgressBar isActive={isActive} />*/}
              </div>
            </div>
          </>
        ) : (
          ''
        )}
      </>
    );
  }
}

export default Masthead;
