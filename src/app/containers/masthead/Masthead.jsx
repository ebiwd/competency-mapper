import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import ProgressBar from '../../../shared/components/progress-bar/progress-bar';
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
    const { roles, user, isActive } = this.props;
    const bgStyle = {
      backgroundImage:
        'url(' +
        JSON.stringify(
          'https://www.ebi.ac.uk/training/static/media/catalogue_masthead.c4ba340d.jpg'
        ) +
        ')'
    };

    return (
      // <div data-sticky-container>
      //   <header
      //     id="masthead"
      //     className="masthead"
      //     data-sticky
      //     data-sticky-on="large"
      //     data-top-anchor="main-content-area:top"
      //     data-btm-anchor="main-content-area:bottom"
      //   >
      //     <div className="masthead-inner row">
      //       <div className="columns medium-12" id="local-title">
      //         <h1>
      //           <Link to="/">Competency Hub</Link>
      //         </h1>
      //       </div>
      //       {user && roles ? (
      //         <Navigation roles={roles} user={user} onLogout={this.onLogout} />
      //       ) : (
      //         <LoginForm onSubmit={this.onLogin} />
      //       )}
      //     </div>
      //     <ProgressBar isActive={isActive} />
      //   </header>
      // </div>
      <>
        <section
          className="vf-hero vf-hero--primary  vf-hero--block    vf-hero--1200 | vf-u-fullbleed"
          style={bgStyle}
          data-vf-google-analytics-region="masthead"
        >
          <div className="vf-hero__content | vf-stack vf-stack--400">
            <h1 className="vf-hero__heading">Competency Hub</h1>
            <h4 class="vf-hero__subheading">
              Supporting competency-based training and professional development.
            </h4>
          </div>
        </section>
        <div>
          <div className="vf-grid">
            <div />
            <div />
            <div />
            {user && roles ? (
              <Navigation roles={roles} user={user} onLogout={this.onLogout} />
            ) : (
              <LoginForm onSubmit={this.onLogin} />
            )}
            {/* <ProgressBar isActive={isActive} /> */}
          </div>
        </div>
      </>
    );
  }
}

export default Masthead;
