import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import Parser from 'html-react-parser';

import { apiUrl } from '../../services/http/http';
import ProfileService from '../../services/profile/profile';
import ActiveRequestsService from '../../services/active-requests/active-requests';
import { Link, Redirect } from 'react-router-dom';
import Collapsible from 'react-collapsible';
import ReactTooltip from 'react-tooltip';

const $ = window.$;

export const ProfileViewGuest = props => {
  return <div>hi</div>;
};

export const ViewGuestProfile = () => (
  <Switch>
    <Route
      exact
      path="/framework/:framework/:version/profile/guest"
      component={ProfileViewGuest}
    />
  </Switch>
);

export default ViewGuestProfile;
