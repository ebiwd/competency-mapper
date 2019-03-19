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

const App = () => (
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
      <Route path="/training-resource/edit/:nid" component={ResourceEdit} />
      <Route path="/training-resource/create" component={ResourceCreate} />
      <Route path="/training-resources/:id" component={ResourceDetails} />
      <Route path="/all-training-resources" component={ResourcesList} />
      <Route path="/roster" component={Roster} />
      <Route path="/user/change/password" component={changePassword} />
      <Route path="/" component={Frameworks} />
    </Switch>
  </main>
);

export default App;
