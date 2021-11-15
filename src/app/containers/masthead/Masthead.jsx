import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

//import ProgressBar from '../../../shared/components/progress-bar/progress-bar';
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
    //const { roles, user, isActive } = this.props;
    const { roles, user } = this.props;
    const bgStyle = {
      backgroundImage:
        'url(' +
        JSON.stringify(
          'https://acxngcvroo.cloudimg.io/v7/https://cms.competency.ebi.ac.uk/themes/custom/ebi_academy/images/mastheads/CH_Jigsaw.jpg'
        ) +
        ')'
    };

    return (
      <>
        <section
          className="vf-hero vf-hero--primary vf-hero--800 | vf-u-fullbleed"
          style={bgStyle}
          data-vf-google-analytics-region="masthead"
        >
          <div className="vf-hero__content | vf-stack vf-stack--400">
            <h1 className="vf-hero__heading">Competency Hub</h1>
            <h4 className="vf-hero__subheading">
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
