import React, { Component } from 'react';

import FrameworkButtons from '../components/framework-buttons/FrameworkButtons';
import { Link } from 'react-router-dom';

import { withSnackbar } from 'notistack';
import ActiveRequestsService from '../services/active-requests/active-requests';
import CompetencyService from '../services/competency/competency';
import PropTypes from 'prop-types';

import Navigation from './navigation/Navigation';
import LoginForm from './login-form/LoginForm';

import { login, logout } from '../services/auth/auth';

import Association from './Association';

import masterList from './masterList.json';

class Frameworks extends Component {
  // function Frameworks () {
  // activeRequests = new ActiveRequestsService();
  // competencyService = new CompetencyService();

  state = {
    frameworks: [],
    user: localStorage.getItem('user'),
    roles: localStorage.getItem('roles')
  };
  // const { roles, user } = this.props;
  static propTypes = {
    user: PropTypes.string.isRequired,
    roles: PropTypes.string.isRequired,
    onLogin: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired
  };

  onLogin = (username, password) => {
    // this.props.onLogin(username, password);
    this.handleLogin(username, password);
    // login(username, password);
  };

  onLogout = () => {
    this.props.onLogout();
  };

  handleLogin = async (username, password) => {
    try {
      await login(username, password);
      this.setState({
        user: localStorage.getItem('user'),
        roles: localStorage.getItem('roles')
      });
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

  // async componentDidMount() {
  //   try {
  //     // this.activeRequests.startRequest();
  //     // const frameworks = await this.competencyService.getAllVersionedFrameworks();
  //     // this.setState({ frameworks });
  //   } catch (error) {
  //     this.props.enqueueSnackbar('Unable to fetch framework data', {
  //       variant: 'error'
  //     });
  //     console.error(error);
  //   } finally {
  //     this.activeRequests.finishRequest();
  //   }
  // }

  render() {
    const { roles, user } = this.props;
    console.log(masterList);

    return (
      <div>
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
              {this.state.user && this.state.roles ? (
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
      </div>
    );
  }
}

export default withSnackbar(Frameworks);
