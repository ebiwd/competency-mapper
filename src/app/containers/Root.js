import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import User from './User';
import Roster from './Roster';
import Frameworks from './Frameworks';
import Competencies from './CompetencyList';
import ManageCompetency from './ManageCompetency';
import ManageAttributes from './ManageAttributes';
import CompetencyDetails from './CompetencyDetails';
import ResourcesList from './ResourcesList';
import ResourceDetails from './ResourceDetails';
import ResourceCreate from './ResourceCreate';
import ResourceEdit from './ResourceEdit';
import changePassword from './changePassword';

const Root = () => (
  <React.Fragment>
    <div data-sticky-container>
      <div className="top-bar" style={{ width: '100%' }}>
        <div className="top-bar-left">
          <ul className="dropdown menu" data-dropdown-menu>
            <li className="menu-text">
              <i className="fas fa-link" /> Competency Mapper
            </li>
            <li>
              <a href="#">
                <i className="fas fa-home" /> Home
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fas fa-question-circle" /> Support
              </a>
            </li>
          </ul>
        </div>

        <div className="top-bar-right">
          <User />
        </div>
      </div>
    </div>

    <div
      data-sticky-container=""
      className="sticky-container"
      style={{ height: '100px' }}
    >
      <header
        id="masthead"
        className="masthead  sticky meta-background-color meta-background-image is-anchored is-at-top"
      >
        <div className="row masthead-inner">
          <div className="columns medium-12" id="local-title">
            <h1>
              <a href="../../" title="Back to [service-name] homepage">
                Competency Mapper
              </a>
            </h1>
          </div>
        </div>
      </header>
    </div>

    <div className="row" id="content">
      <div className="small-12 large-12 medium-12 columns">
        <main>
          <Switch>
            <Route
              path="/framework/:name/manage/competencies/:cid/manage-attributes"
              component={ManageAttributes}
            />
            <Route
              path="/framework/:name/manage/competencies"
              component={ManageCompetency}
            />
            <Route
              path="/framework/:name/competency/details/:id"
              component={CompetencyDetails}
            />
            <Route path="/framework/:name" component={Competencies} />
            <Route
              path="/training-resource/edit/:nid"
              component={ResourceEdit}
            />
            <Route
              path="/training-resource/create"
              component={ResourceCreate}
            />
            <Route path="/training-resources/:id" component={ResourceDetails} />
            <Route path="/all-training-resources" component={ResourcesList} />
            <Route path="/roster" component={Roster} />
            <Route path="/user/change/password" component={changePassword} />
            <Route path="/" component={Frameworks} />
          </Switch>
        </main>
      </div>
    </div>
  </React.Fragment>
);

export default Root;
