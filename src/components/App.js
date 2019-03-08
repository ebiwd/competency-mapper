import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { HashRouter } from 'react-router-dom'
import Home from './Home'
import Roster from './Roster'
import Frameworks from './Frameworks'
import Competencies from './CompetencyList'
import ManageCompetency from './ManageCompetency'
import ManageAttribute from './ManageAttribute'
import CompetencyDetails from './CompetencyDetails'
import ResourcesList from './ResourcesList'
import ResourceDetails from './ResourceDetails'
import ResourceCreate from './ResourceCreate'
import ResourceEdit from './ResourceEdit'
import changePassword from './changePassword'


const App = () => (

  <main>
	<HashRouter basename={'/competency-mapper'}>
	    <Switch>
	      <Route exact path='/' component={Frameworks}/>
	      <Route exact path='/roster' component={Roster}/>
	      <Route exact  path='/framework/:name' component={Competencies} />
	      <Route exact path='/framework/:name/manage/competencies' component={ManageCompetency} />
	      <Route exact path='/framework/:name/manage/competencies/:cid/manage-attributes' component={ManageAttribute} />
	      <Route exact path='/framework/:name/competency/details/:id' component={CompetencyDetails} />
            <Route exact path='/all-training-resources' component={ResourcesList} />
            <Route exact path='/training-resources/:id' component={ResourceDetails} />
            <Route exact path='/training-resource/create' component={ResourceCreate} />
            <Route exact path='/training-resource/edit/:nid' component={ResourceEdit} />
            <Route exact path='/user/change/password' component={changePassword} />
	    </Switch>
	</HashRouter>
  </main>
);

export default App;
