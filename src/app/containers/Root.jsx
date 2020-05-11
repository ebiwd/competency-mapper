import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Masthead from '../containers/masthead/Masthead';
import ManageAttributes from './ManageAttributes';
import ManageCompetencies from './ManageCompetencies';
import CompetencyDetails from './CompetencyDetails';
import CompetencyList from './CompetencyList';
import ResourceEdit from './ResourceEdit';
import ResourceCreate from './ResourceCreate';
import ResourceDetails from './ResourceDetails';
import ResourcesList from './ResourcesList';
import ResourcesHome from './ResourcesHome';
import ChangePassword from './ChangePassword';
import About from '../components/about/About';
import Frameworks from './Frameworks';
import ArticleCreate from './ArticleCreate';
import AttributeMap from './AttributeMap';
import CompetencySettings from './CompetencySettings';
import AttributeSettings from './AttributeSettings';
import AttributeDemap from './AttributeDemap';
import Profile from '../profile/Profile';

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

    this.setState({ isActive: this.activeRequests.isActive });
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

  handleActiveRequests = hasPendingRequests => {
    this.setState({ isActive: hasPendingRequests });
  };

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
                {/* Remove trailing slash */}
                <Route
                  path="/:url*(/+)"
                  exact
                  strict
                  render={({ location }) => (
                    <Redirect to={location.pathname.replace(/\/+$/, '')} />
                  )}
                />

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
                <ProtectedRoute
                  condition={!!user && roles.includes('framework_manager')}
                  path="/framework/:framework/competency/:cid/attribute/:aid/settings"
                  component={AttributeSettings}
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
                <Route
                  path="/framework/:framework/:version/competency/details/:cid"
                  component={CompetencyDetails}
                />
                <ProtectedRoute
                  condition={!!user && roles.includes('framework_manager')}
                  path="/framework/:framework/competency/:id/settings"
                  component={CompetencySettings}
                />
                <Route
                  path="/framework/:framework/:version/profile"
                  component={Profile}
                />
                <Route
                  path="/framework/:framework/:version"
                  component={CompetencyList}
                />
                <ProtectedRoute
                  condition={!!user && roles.includes('content_manager')}
                  path="/training-resources/:id/map/:framework"
                  component={AttributeMap}
                />
                <ProtectedRoute
                  condition={!!user && roles.includes('content_manager')}
                  path="/training-resources/:resource/demap/:attribute"
                  component={AttributeDemap}
                />
                <Route
                  path="/training-resources/:id"
                  component={ResourceDetails}
                />
                <Route
                  path="/all-training-resources"
                  component={ResourcesList}
                />
                <Route
                  path="/training-resources-home"
                  component={ResourcesHome}
                />
                <Route
                  path="/user/change/password"
                  component={ChangePassword}
                />
                <Route path="/article/create" component={ArticleCreate} />
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
