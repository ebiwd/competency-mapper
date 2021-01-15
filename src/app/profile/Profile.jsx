import React from 'react';

import { Switch, Route } from 'react-router-dom';

import { ProtectedRoute } from '../containers/Root';
import ProfileEditGuest from './edit/ProfileEditGuest';
import ProfileEdit from './edit/ProfileEdit';

// old components to replace
import ProfileMapGuest from './old/map/ProfileMapGuest';
import ProfileMap from './old/map/ProfileMap';
import ProfileViewGuest from './old/view/ProfileViewGuest';
import ProfileView from './old/view/ProfileView';
import ProfilesCompare from './old/compare/ProfilesCompare';

export const Profile = React.memo(() => {
  const roles = localStorage.getItem('roles') || '';
  const user = localStorage.getItem('user') || '';

  return (
    <Switch>
      {/* edit */}
      <Route
        path="/framework/:framework/:version/profile/edit/guest"
        component={ProfileEditGuest}
      />
      <ProtectedRoute
        condition={!!user && roles.includes('framework_manager')}
        path="/framework/:framework/:version/profile/edit/:profileId?"
        component={ProfileEdit}
      />

      {/* map */}
      <Route
        path="/framework/:framework/:version/profile/map/guest"
        component={ProfileMapGuest}
      />
      <Route
        path="/framework/:framework/:version/profile/map/:id"
        component={ProfileMap}
      />

      {/* view */}
      <Route
        path="/framework/:framework/:version/profile/view/guest"
        component={ProfileViewGuest}
      />
      <Route
        path="/framework/:framework/:version/profile/view/:id/:alias"
        component={ProfileView}
      />

      {/* compare */}
      <Route
        path="/framework/:framework/:version/profile/compare/:profile1Id/:profile2Id"
        component={ProfilesCompare}
      />
    </Switch>
  );
});

export default Profile;
