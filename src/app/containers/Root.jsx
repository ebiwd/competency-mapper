import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Masthead from '../containers/masthead/Masthead';
import ManageAttributes from './ManageAttributes';
import ManageCompetencies from './ManageCompetencies';
import ManageData from './ManageData';
import CompetencyDetails from './CompetencyDetails';
import CompetencyList from './CompetencyList';
import ResourceEdit from './ResourceEdit';
import ResourceCreate from './ResourceCreate';
import ResourceDetails from './ResourceDetails';
import ResourcesList from './ResourcesList';
import ResourcesHome from './ResourcesHome';
import ChangePassword from './ChangePassword';
import UserView from './UserView';
import About from '../components/about/About';
import Frameworks from './Frameworks';
import AttributeMap from './AttributeMap';
import CompetencySettings from './CompetencySettings';
import AttributeSettings from './AttributeSettings';
import AttributeDemap from './AttributeDemap';
import ProfileCreate from './ProfileCreate';
import ProfileCreateGuest from './ProfileCreateGuest';
import ProfileView from './ProfileView';
import ProfilesCompare from './ProfilesCompare';
import ProfileMapDownload from './ProfileMapDownload';
import ProfileViewGuest from './ProfileViewGuest';
import ProfileMapGuest from './ProfileMapGuest';
import ProfileEdit from './ProfileEdit';
import ProfileMap from './ProfileMap';
import ProfilesCompareSummary from './ProfilesCompareSummary';
import Documentation from './Documentation';
import Login from './Login';
import ManageFrameworks from '../containers/navigation/ManageFrameworks';
import Breadcrumbs from '../containers/Breadcrumbs';
import DevelopYourCourses from '../containers/DevelopYourCourses';
import { SnackbarProvider } from 'notistack';
import { login, logout } from '../services/auth/auth';
import ActiveRequestsService from '../services/active-requests/active-requests';
import auth from '../services/util/auth';
// import sitemapGenerator from './sitemapGenerator';

class Root extends Component {
  state = {
    isActive: false,
    roles: localStorage.getItem('roles') || '',
    user: {
      is_logged_in: false,
      roles: []
    }
  };
  activeRequests = new ActiveRequestsService();

  componentDidMount() {
    auth.getLoggedInUser().then(response => {
      this.setState({
        user: response
      });
    });

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

  handleLogout = () => {
    this.setState({ user: '', roles: '' });
    logout();
    document.location.reload();
  };

  render() {
    const { isActive, user } = this.state;
    return (
      <>
        <SnackbarProvider
          maxSnack={1}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          preventDuplicate
        >
          <Breadcrumbs />
          {/* <div className="vf-u-margin__top--200" /> */}
          <Switch>
            <Masthead
              roles={user.roles}
              user={user.username ? user.username : ''}
              isActive={isActive}
              onLogin={this.handleLogin}
              onLogout={this.handleLogout}
            />
          </Switch>

          <section id="main-content-area" className="row" role="main">
            <div>
              <Switch>
                <ProtectedRoute
                  condition={user.roles.includes('content_manager')}
                  path="/all-training-resources"
                  component={ResourcesList}
                />
                <ProtectedRoute
                  condition={user.roles.includes('content_manager')}
                  path="/training-resource/edit/:slug"
                  component={ResourceEdit}
                />
                <ProtectedRoute
                  condition={user.roles.includes('content_manager')}
                  path="/training-resource/create"
                  component={ResourceCreate}
                />

                {/* <Route
                  path="/training-resource/create"
                  component={ResourceCreate}
                /> */}

                <ProtectedRoute
                  condition={user.roles.includes('framework_manager')}
                  path="/framework/:framework/competency/:cid/attribute/:aid/settings"
                  component={AttributeSettings}
                />

                <ProtectedRoute
                  condition={user.roles.includes('framework_manager')}
                  path="/framework/:framework/manage/competencies/:cid/manage-attributes"
                  component={ManageAttributes}
                />
                <ProtectedRoute
                  condition={user.roles.includes('framework_manager')}
                  path="/framework/:framework/manage/competencies/:domainId?"
                  component={ManageCompetencies}
                />

                <ProtectedRoute
                  condition={user.roles.includes('framework_manager')}
                  path="/framework/:framework/manage/data/:domainId?"
                  component={ManageData}
                />

                <Route
                  path="/framework/:framework/:version/competency/details/:cid"
                  component={CompetencyDetails}
                />

                <ProtectedRoute
                  condition={user.roles.includes('framework_manager')}
                  path="/framework/:framework/competency/:id/settings"
                  component={CompetencySettings}
                />

                <Route
                  path="/framework/:framework/:version/profile/create/guest"
                  component={ProfileCreateGuest}
                />

                <ProtectedRoute
                  condition={user.roles.includes('framework_manager')}
                  path="/framework/:framework/:version/profile/create"
                  component={ProfileCreate}
                />

                <Route
                  path="/framework/:framework/:version/profile/view/guest"
                  component={ProfileViewGuest}
                />

                <Route
                  path="/framework/:framework/:version/profile/map/guest"
                  component={ProfileMapGuest}
                />

                <Route
                  path="/framework/:framework/:version/profile/view/:id/:alias"
                  component={ProfileView}
                />

                <Route
                  path="/framework/:framework/:version/profiles/compare/guest/summary"
                  component={ProfilesCompareSummary}
                />

                <Route
                  path="/framework/:framework/:version/profiles/compare/:profile1/:profile2"
                  component={ProfilesCompare}
                />

                <Route
                  path="/framework/:framework/:version/profile/map/download"
                  component={ProfileMapDownload}
                />

                <ProtectedRoute
                  condition={user.roles.includes('framework_manager')}
                  path="/framework/:framework/:version/profile/edit/:id"
                  component={ProfileEdit}
                />

                <ProtectedRoute
                  condition={user.roles.includes('framework_manager')}
                  path="/framework/:framework/:version/profile/map/:id"
                  component={ProfileMap}
                />

                <Route
                  path="/framework/:framework/:version"
                  component={CompetencyList}
                />

                {/*<Route*/}
                {/*  path="/framework/:framework/:version"*/}
                {/*  component={VFTabsCompetencyList}*/}
                {/*/>*/}

                <ProtectedRoute
                  condition={user.roles.includes('content_manager')}
                  path="/training-resources/:id/map/:framework"
                  component={AttributeMap}
                />

                <ProtectedRoute
                  condition={user.roles.includes('content_manager')}
                  path="/training-resources/:resource/demap/:attribute"
                  component={AttributeDemap}
                />

                <Route
                  path="/training-resources/:slug"
                  component={ResourceDetails}
                />

                <ProtectedRoute
                  condition={user.roles.includes('content_manager')}
                  path="/training-resources-home"
                  component={ResourcesHome}
                />

                <ProtectedRoute
                  condition={user.is_logged_in}
                  path="/user/change/password"
                  component={ChangePassword}
                />

                <ProtectedRoute
                  condition={user.is_logged_in}
                  path="/user/view"
                  component={UserView}
                />

                <ProtectedRoute
                  condition={user.is_logged_in}
                  path="/manage-frameworks"
                  component={ManageFrameworks}
                />

                <Route path="/documentation" component={Documentation} />
                <Route
                  path="/develop-your-courses"
                  component={DevelopYourCourses}
                />
                <Route path="/about" component={About} />
                <Route path="/login" component={Login} />
                {/* <Route path="/sitemap" component={sitemapGenerator} /> */}
                <Route path="/" component={Frameworks} />
              </Switch>
            </div>
          </section>
          {/* <Footer /> */}
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
