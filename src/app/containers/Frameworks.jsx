import React, { Component } from 'react';
import FrameworkButtons from '../components/framework-buttons/FrameworkButtons';
import { Link } from 'react-router-dom';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import LoginForm from './login-form/LoginForm';
import Footer from '../components/Footer';
import { login } from '../services/auth/auth';
import Association from './Association';
import masterList from './masterList.json';
import auth from '../services/util/auth';
import { MetaTags } from 'react-meta-tags';
import { Helmet } from 'react-helmet';

class Frameworks extends Component {
  state = {
    frameworks: []
  };
  static propTypes = {
    user: PropTypes.string.isRequired,
    roles: PropTypes.string.isRequired,
    onLogin: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired
  };

  onLogin = (username, password) => {
    this.handleLogin(username, password);
  };

  onLogout = () => {
    this.props.onLogout();
  };

  handleLogin = async (username, password) => {
    try {
      await login(username, password);
      document.location.reload();
    } catch (error) {
      window.console.error(error);
      if (error.response) {
        switch (error.response.status) {
          case 400:
            window.alert(error.response.data.message);
            return;
          default:
            window.alert(
              'Sorry, there was an unknown login problem, please try again.'
            );
        }
        window.alert(
          'Sorry, there was an unknown login problem, please try again.'
        );
      }
    }
  };

  render() {
    return (
      <div>
        <MetaTags>
          <title>Competency hub</title>
          <meta property="og:title" content="Competency hub" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://competemcy.ebi.ac.uk" />
          <meta
            property="og:image"
            content="https://acxngcvroo.cloudimg.io/v7/https://cms.competency.ebi.ac.uk/themes/custom/ebi_academy/images/mastheads/CH_Jigsaw.jpg"
          />
          <meta
            property="og:description"
            content="The Competency Hub is a repository of competency frameworks that define the abilities required by professionals in a specific area of life sciences and relate them to training resources and career profiles"
          />
          <meta
            name="description"
            content="The Competency Hub is a repository of competency frameworks that define the abilities required by professionals in a specific area of life sciences and relate them to training resources and career profiles"
          />
          <meta
            property="keywords"
            content="competency, life sciences, career development, computational biology, bioinformatics"
          />
        </MetaTags>
        <Helmet>
          <link rel="canonical" href={this.props.location.pathname} />
        </Helmet>
        <section className="vf-u-fullbleed vf-u-background-color-ui--grey--light vf-u-padding__top--800">
          <h2>Who is the Competency Hub for?</h2>
          <FrameworkButtons frameworkDetails={masterList} />

          <div className="vf-u-padding__top--800" />
        </section>
        <div className="vf-u-margin__top--1200" />
        <div>
          <h2>Do more with the Competency Hub</h2>
          <div className="vf-grid">
            <div>
              <h3>
                <Link to="/develop-your-courses">Develop your courses</Link>
              </h3>
              <p>
                Use competency frameworks and career profiles to design your
                training.
              </p>
            </div>
            <div>
              <h3>
                <Link to="/documentation">Review API Documentation</Link>
              </h3>
              <p>
                Learn how to list frameworks and query framework data with our
                API.
              </p>
            </div>
            <div>
              {auth.currently_logged_in_user.is_logged_in ? (
                <div>
                  <h3>You are logged-in</h3>
                  <p>You can manage frameworks and competencies.</p>
                </div>
              ) : (
                <LoginForm onSubmit={this.onLogin} />
              )}
            </div>
          </div>
        </div>

        <div className="vf-u-margin__top--1200" />
        <h2>In association with</h2>
        <div className="vf-grid vf-grid__col-3">
          {masterList.map(framework => {
            return <Association framework={framework} />;
          })}
        </div>
        <div className="vf-u-margin__top--800" />
        <Footer />
      </div>
    );
  }
}

export default withSnackbar(Frameworks);
