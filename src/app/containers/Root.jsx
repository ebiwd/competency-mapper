import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Masthead from '../containers/masthead/Masthead';
import ManageAttributes from './ManageAttributes';
import ManageCompetencies from './ManageCompetencies';
import CompetencyDetails from './CompetencyDetails';
import Competencies from './CompetencyList';
import ResourceEdit from './ResourceEdit';
import ResourceCreate from './ResourceCreate';
import ResourceDetails from './ResourceDetails';
import ResourcesList from './ResourcesList';
import ChangePassword from './ChangePassword';
import About from '../components/about/About';
import Frameworks from './Frameworks';

import { SnackbarProvider } from 'notistack';
import { login, logout } from '../services/auth/auth';
import ActiveRequestsService from '../services/active-requests/active-requests';

const $ = window.$;

class Root extends Component {
  state = {
    isActive: false,
    roles: localStorage.getItem('roles') || '',
    user: localStorage.getItem('user') || ''
  };
  activeRequests = new ActiveRequestsService();

  componentDidMount() {
    $(document).foundation();
    $(document).foundationExtendEBI();
    this.subcription = this.activeRequests.addEventListener(
      this.handleActiveRequests
    );

    window.addEventListener('storage', this.detectUserChangesFromOtherTabs);
  }

  componentWillUnmount() {
    if (this.subcription) {
      this.activeRequests.removeEventListener(this.subcription);
    }
    window.removeEventListener('storage', this.detectUserChangesFromOtherTabs);
  }

  handleActiveRequests = hasPendingRequests =>
    this.setState({ isActive: hasPendingRequests });

  detectUserChangesFromOtherTabs = ({ key, newValue }) => {
    if (key === 'user') {
      if (newValue) {
        this.setState({
          user: localStorage.getItem('user'),
          roles: localStorage.getItem('roles')
        });
      } else {
        this.setState({ user: '', roles: '' });
      }
    }
  };

  handleLogin = async (username, password) => {
    try {
      await login(username, password);
      this.setState({
        user: localStorage.getItem('user'),
        roles: localStorage.getItem('roles')
      });
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

  handleLogout = () => {
    this.setState({ user: '', roles: '' });
    logout();
  };

  render() {
    const { isActive, roles, user } = this.state;
    return (
      <>
        <SnackbarProvider
          maxSnack={1}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          preventDuplicate
        >
          <Masthead
            roles={roles}
            user={user}
            isActive={isActive}
            onLogin={this.handleLogin}
            onLogout={this.handleLogout}
          />

          <section id="main-content-area" className="row" role="main">
            <main className="column">
              <Switch>
                <ProtectedRoute
                  condition={!!user && roles.includes('content_manager')}
                  path="/training-resource/edit/:nid"
                  component={ResourceEdit}
                />
                <ProtectedRoute
                  condition={!!user && roles.includes('content_manager')}
                  path="/training-resource/create"
                  component={ResourceCreate}
                />
                <Route
                  condition={!!user && roles.includes('framework_manager')}
                  path="/training-resources/:id"
                  component={ResourceDetails}
                />
                <Route
                  path="/all-training-resources"
                  component={ResourcesList}
                />
                <ProtectedRoute
                  condition={!!user && roles.includes('framework_manager')}
                  path="/framework/:framework/manage/competencies/:cid/manage-attributes"
                  component={ManageAttributes}
                />
                <ProtectedRoute
                  condition={!!user && roles.includes('framework_manager')}
                  path="/framework/:framework/manage/competencies/:domainId?"
                  component={ManageCompetencies}
                />
                <ProtectedRoute
                  condition={!!user && roles.includes('framework_manager')}
                  path="/framework/:framework/competency/details/:cid"
                  component={CompetencyDetails}
                />
                <Route path="/framework/:framework" component={Competencies} />
                <Route
                  path="/user/change/password"
                  component={ChangePassword}
                />
                <Route path="/about" component={About} />
                <Route path="/" component={Frameworks} />
              </Switch>
            </main>
          </section>
        </SnackbarProvider>
      </>
    );
  }
}

export default Root;

class ProtectedRoute extends Component {
  render() {
    const { component: Component, condition, ...props } = this.props;
    return (
      <Route
        {...props}
        render={props =>
          condition ? <Component {...props} /> : <Redirect to="/" />
        }
      />
    );
  }
}
