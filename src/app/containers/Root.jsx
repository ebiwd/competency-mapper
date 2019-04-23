import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';

import Roster from './Roster';
import User from './User';
import Frameworks from './Frameworks';
import Competencies from './CompetencyList';
import ManageCompetencies from './ManageCompetencies';
import ManageAttributes from './ManageAttributes';
import CompetencyDetails from './CompetencyDetails';
import ResourcesList from './ResourcesList';
import ResourceDetails from './ResourceDetails';
import ResourceCreate from './ResourceCreate';
import ResourceEdit from './ResourceEdit';
import ChangePassword from './ChangePassword';
import ProgressBar from '../../shared/components/progress-bar/progress-bar';

import ActiveRequestsService from '../services/active-requests/active-requests';

const $ = window.$;
class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false
    };

    this.activeRequests = new ActiveRequestsService();
  }

  componentWillMount() {
    this.subcription = this.activeRequests.addEventListener(
      this.handleActiveRequests
    );
  }

  componentDidMount() {
    $(document).foundation();
    $(document).foundationExtendEBI();
  }

  componentWillUnmount() {
    if (this.subcription) {
      this.activeRequests.removeEventListener(this.subcription);
    }
  }

  handleActiveRequests = hasPendingRequests =>
    this.setState({ isActive: hasPendingRequests });

  render() {
    const { isActive } = this.state;
    return (
      <React.Fragment>
        <div data-sticky-container>
          <header
            id="masthead"
            className="masthead"
            data-sticky
            data-sticky-on="large"
            data-top-anchor="main-content-area:top"
            data-btm-anchor="main-content-area:bottom"
          >
            <div className="masthead-inner row">
              <div className="columns medium-12" id="local-title">
                <h1>
                  <Link to="/">Competency Mapper</Link>
                </h1>
              </div>
              <User />
            </div>
            <ProgressBar isActive={isActive} />
          </header>
        </div>

        <section id="main-content-area" className="row" role="main">
          <main className="column">
            <Switch>
              <Route
                path="/framework/:framework/manage/competencies/:cid/manage-attributes"
                component={ManageAttributes}
              />
              <Route
                path="/framework/:framework/manage/competencies/:cid?"
                component={ManageCompetencies}
              />
              <Route
                path="/framework/:framework/competency/details/:cid"
                component={CompetencyDetails}
              />
              <Route path="/framework/:framework" component={Competencies} />
              <Route
                path="/training-resource/edit/:nid"
                component={ResourceEdit}
              />
              <Route
                path="/training-resource/create"
                component={ResourceCreate}
              />
              <Route
                path="/training-resources/:id"
                component={ResourceDetails}
              />
              <Route path="/all-training-resources" component={ResourcesList} />
              <Route path="/roster" component={Roster} />
              <Route path="/user/change/password" component={ChangePassword} />
              <Route path="/" component={Frameworks} />
            </Switch>
          </main>
        </section>
      </React.Fragment>
    );
  }
}

export default Root;
