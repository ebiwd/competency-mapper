import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, Link } from 'react-router-dom';

import User from './User';
import Roster from './Roster';
import Frameworks from './Frameworks';
import Competencies from './CompetencyList';
import ManageCompetencies from './ManageCompetencies';
import ManageAttributes from './ManageAttributes';
import CompetencyDetails from './CompetencyDetails';
import ResourcesList from './ResourcesList';
import ResourceDetails from './ResourceDetails';
import ResourceCreate from './ResourceCreate';
import ResourceEdit from './ResourceEdit';
import changePassword from './changePassword';

const $ = window.$;
class Root extends React.Component {
  componentDidMount() {
    $(document).foundation();
    $(document).foundationExtendEBI();
  }

  render() {
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
          </header>
        </div>

        <section id="main-content-area" className="row" role="main">
          <div className="small-12 large-12 medium-12 columns">
            <main>
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
                <Route
                  path="/all-training-resources"
                  component={ResourcesList}
                />
                <Route path="/roster" component={Roster} />
                <Route
                  path="/user/change/password"
                  component={changePassword}
                />
                <Route path="/" component={Frameworks} />
              </Switch>
            </main>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default Root;
