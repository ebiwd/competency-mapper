import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

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
      <div class="top-bar" style={{width:"100%"}}>
        <div class="top-bar-right" id="userarea">
          <ul class="dropdown menu" data-dropdown-menu>
            <li class="menu-text">You are Framework Manager</li>
            <li>
              <a href="#">Manage Competencies</a>
              <ul class="menu vertical">
                <li>
                  <a href="/framework/bioexcel/manage/competencies">BioExcel</a>
                </li>
                <li>
                  <a href="/framework/corbel/manage/competencies">CORBEL</a>
                </li>
                <li>
                  <a href="/framework/iscb/manage/competencies">ISCB</a>
                </li>
                <li>
                  <a href="/framework/ritrain/manage/competencies">RITrain</a>
                </li>
                <li>
                  <a href="/framework/nhs/manage/competencies">NHS</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="/all-training-resources">Manage Training Resources</a>
            </li>
            <li>
              <a href="#">My Profile</a>
            </li>
            <li>
              <a href="#">Logout</a>
            </li>
          </ul>
        </div>

        <div class="top-bar-left">
          <ul class="dropdown menu" data-dropdown-menu>
            <li class="menu-text">
              <i class="fas fa-link" /> Competency Mapper
            </li>
            <li>
              <a href="#">
                <i class="fas fa-home" /> Home
              </a>
            </li>
            <li>
              <a href="#">
                <i class="fas fa-question-circle" /> Support
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div
      data-sticky-container=""
      class="sticky-container"
      style={{height: "100px"}}
    >
      <header
        id="masthead"
        class="masthead  sticky meta-background-color meta-background-image is-anchored is-at-top">
        <div class="row masthead-inner">
          <div class="columns medium-12" id="local-title">
            <h1>
              <a href="../../" title="Back to [service-name] homepage">
                Competency Mapper
              </a>
            </h1>
          </div>
        </div>
      </header>
    </div>

    <div class="row" id="content">
      <div class="small-12 large-12 medium-12 columns">
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
