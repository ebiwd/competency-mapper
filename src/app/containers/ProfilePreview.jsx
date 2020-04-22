import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
//import CKEditor from 'react-ckeditor-component';
import Parser from 'html-react-parser';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import FileUpload from './FileUpload';
import { apiUrl } from '../services/http/http';
import ProfileService from '../services/profile/profile';
import ActiveRequestsService from '../services/active-requests/active-requests';
import { Link, Redirect } from 'react-router-dom';

export const ProfilePreview = props => {
  // const frameworkName = props.location.pathname.split('/')[2];
  // const frameworkVersion = props.location.pathname.split('/')[3];
  // const profileId = props.location.pathname.split('/')[6];

  // const [profile, setProfile] = useState();
  // useEffect(() => {
  //   const fetchData = async () => {
  //     await fetch(`${apiUrl}/node/${profileId}?_format=json`)
  //           .then(Response => Response.json())
  //           .then(findresponse => {
  //             setProfile(findresponse)
  //           });
  //   };
  //   fetchData();

  // },[profileId]);
  console.log(props);

  return (
    <div>
      <Link
        to={{
          pathname: '/framework/bioexcel/2.0/profile/create'
        }}
      >
        {' '}
        Back to editing{' '}
      </Link>
      <h2>Profile title: {props.location.state.title}</h2>

      <div className="row">
        <div className="column large-4">
          <p>
            <img style={{ display: 'block' }} src="" />
          </p>
          <p />
          <p />
        </div>
        <div className="column large-8">
          <strong>Activities of current role</strong>
          <p />

          <strong>Qualification and background</strong>
          <p />
        </div>
      </div>
      <p />
    </div>
  );
};

export const PreviewProfile = () => (
  <Switch>
    <Route
      exact
      path="/framework/:framework/:version/profile/preview"
      component={ProfilePreview}
    />
  </Switch>
);

export default ProfilePreview;
