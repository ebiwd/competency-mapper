import React from 'react';

import { Switch, Route } from 'react-router-dom';

import { ProtectedRoute } from '../containers/Root';
import ProfileCreateGuest from './create/ProfileCreateGuest';
import ProfileCreate from './create/ProfileCreate';

// import ProfileCreate from './old/ProfileCreate';
// import ProfileView from './old/ProfileView';
// import ProfilesCompare from './old/ProfilesCompare';
// import ProfileMap from './old/ProfileMap';
// import ProfileEdit from './old/ProfileEdit';
// import ProfilePreview from './old/ProfilePreview';

export const Profile = React.memo(() => {
  const roles = localStorage.getItem('roles') || '';
  const user = localStorage.getItem('user') || '';

  return (
    <Switch>
      {/* create or edit profile */}
      <Route
        path="/framework/:framework/:version/profile/create/guest"
        component={ProfileCreateGuest}
      />

      <ProtectedRoute
        condition={!!user && roles.includes('framework_manager')}
        path="/framework/:framework/:version/profile/create/:profileId?"
        component={ProfileCreate}
      />

      {/* map */}

      {/* <Route
  path="/framework/:framework/:version/profile/map/guest"
  component={ProfileMapGuest}
/> */}
      {/* <Route
  path="/framework/:framework/:version/profile/map/:id"
  component={ProfileMap}
/> */}

      {/* view */}
      {/* <Route
        path="/framework/:framework/:version/profile/view/guest"
        component={ProfileViewGuest}
      /> */}
      {/* <Route
        path="/framework/:framework/:version/profile/view/:id/:alias"
        component={ProfileView}
      /> */}

      {/* compare */}
      {/* 
      <Route
        path="/framework/:framework/:version/profile/compare/:profile1/:profile2"
        component={ProfilesCompare}
      />
 */}
    </Switch>
  );
});

export default Profile;
