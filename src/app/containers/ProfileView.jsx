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

export const ProfileView = props => {
  const frameworkName = props.location.pathname.split('/')[2];
  const frameworkVersion = props.location.pathname.split('/')[3];
  const profileId = props.location.pathname.split('/')[6];
  const alias = props.location.pathname.split('/')[7];

  const [profile, setProfile] = useState();
  useEffect(() => {
    const fetchData = async () => {
      await fetch(`${apiUrl}/node/${profileId}?_format=json`)
        .then(Response => Response.json())
        .then(findresponse => {
          setProfile(findresponse);
        });
    };
    fetchData();
  }, [profileId]);

  const checkAlias = () => {
    if (profile.path[0].alias.substring(1) != alias) {
      props.history.push(
        `/framework/${frameworkName}/${frameworkVersion}/profile/view/${profileId}${
          profile.path[0].alias
        }`
      );
    }
  };

  return (
    <div>
      {profile ? (
        <div>
          {checkAlias()}
          <Link to={`/framework/bioexcel/2.0/profile/edit/${profileId}`}>
            {' '}
            Edit{' '}
          </Link>

          <h2 style={{ marginTop: '1em', marginBottom: '1em' }}>
            {profile.title[0].value} -{' '}
            {profile.field_job_title[0] ? profile.field_job_title[0].value : ''}
          </h2>
          <div className="row">
            <div className="column large-4">
              <p>
                <img
                  style={{ display: 'block', maxWidth: '200px' }}
                  src={profile.field_image[0] ? profile.field_image[0].url : ''}
                />
              </p>
              <p />
              <p style={{ textAlign: 'center' }}>
                {profile.field_gender[0] ? profile.field_gender[0].value : ''}{' '}
                {profile.field_age[0]
                  ? '| ' + profile.field_age[0].value + ' years'
                  : ''}
              </p>
            </div>
            <div className="column large-8">
              <h3>Qualification and background</h3>
              <p>
                {profile.field_qualification_background[0]
                  ? Parser(profile.field_qualification_background[0].value)
                  : ''}
              </p>

              <h3>Acitivities of current role</h3>
              <p>
                {profile.field_current_role[0]
                  ? Parser(profile.field_current_role[0].value)
                  : ''}
              </p>
            </div>
            <p />
          </div>

          <table class="hover">
            <tbody>
              <tr>
                <td>
                  <h4> Competencies </h4>
                </td>
                <td colspan="5">
                  <h4> Level of expertise </h4>
                </td>
              </tr>

              <tr>
                <td />
                <td>
                  <strong> Not applicable</strong>{' '}
                </td>
                <td>
                  <strong>Awareness</strong>
                </td>
                <td>
                  <strong>Working knowledge</strong>
                </td>
                <td>
                  <strong>Specialist knowledge</strong>
                </td>
              </tr>

              <tr>
                <td>
                  <h5>Scientific competencies</h5>
                </td>
                <td colspan="5" />
              </tr>

              <tr>
                <td>
                  Apply expertise in formal &amp; natural sciences appropriate
                  to the discipline, and follow best practice in experimental
                  design{' '}
                </td>
                <td />
                <td />
                <td />
                <td>
                  <i class="fas fa-check" />{' '}
                </td>
              </tr>
              <tr>
                <td>
                  {' '}
                  -- Skill - Asks relevant, hypothesis driven, well-defined
                  biological questions <i class="fas fa-check" />
                </td>
                <td />
                <td />
                <td />
                <td />
              </tr>
              <tr>
                <td>
                  {' '}
                  -- Attitude - Comprehends that results might be difficult to
                  interpret <i class="fas fa-check" />
                </td>
                <td />
                <td />
                <td />
                <td />
              </tr>
              <tr>
                <td>
                  {' '}
                  -- Attitude - Accurately judges the validity of his/her
                  results <i class="fas fa-check" />
                </td>
                <td />
                <td />
                <td />
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        'Loaing profile'
      )}
    </div>
  );
};

export const ViewProfile = () => (
  <Switch>
    <Route
      exact
      path="/framework/:framework/:version/profile/view/:id/:alias"
      component={ProfileView}
    />
  </Switch>
);

export default ViewProfile;
