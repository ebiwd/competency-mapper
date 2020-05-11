import React from 'react';

import { Switch, Route } from 'react-router-dom';

import ProfileCreateGuest from './create/ProfileCreateGuest';
import ProfileCreate from './create/ProfileCreate';

// import ProfileCreate from './old/ProfileCreate';
// import ProfileView from './old/ProfileView';
// import ProfilesCompare from './old/ProfilesCompare';
// import ProfileMap from './old/ProfileMap';
// import ProfileEdit from './old/ProfileEdit';
// import ProfilePreview from './old/ProfilePreview';

export const Profile = React.memo(() => {
  return (
    <Switch>
      {/* create */}
      <Route
        path="/framework/:framework/:version/profile/create/guest"
        component={ProfileCreateGuest}
      />
      <Route
        path="/framework/:framework/:version/profile/create"
        component={ProfileCreate}
      />

      {/* view */}
      {/*       <Route
        path="/framework/:framework/:version/profile/create/guest"
        component={ProfileCreateGuest}
      />

      <Route
        path="/framework/:framework/:version/profile/create"
        component={ProfileCreate}
      />

      <Route
        path="/framework/:framework/:version/profile/map"
        component={ProfileMap}
      />

      <Route
        path="/framework/:framework/:version/profile/guest"
        component={ProfileViewGuest}
      />

      <Route
        path="/framework/:framework/:version/profile/view/:id/:alias"
        component={ProfileView}
      />

      <Route
        path="/framework/:framework/:version/profiles/compare/:profile1/:profile2"
        component={ProfilesCompare}
      />

      <Route
        path="/framework/:framework/:version/profile/preview"
        component={ProfilePreview}
      />

      <Route
        path="/framework/:framework/:version/profile/view/:id/:alias"
        component={ProfileView}
      />

      <Route
        path="/framework/:framework/:version/profiles/compare/:profile1/:profile2"
        component={ProfilesCompare}
      />

      <Route
        path="/framework/:framework/:version/profile/edit/:id"
        component={ProfileEdit}
      />
 */}
    </Switch>
  );
});

export default Profile;
