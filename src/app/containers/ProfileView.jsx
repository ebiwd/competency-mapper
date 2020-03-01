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

          <h2 style={{ marginTop: '1em', marginBottom: '1em' }}>
            {profile.title[0].value} -{' '}
            {profile.field_job_title[0] ? profile.field_job_title[0].value : ''}
          </h2>

          <div style={{ float: 'right' }}>
            {localStorage.getItem('roles') ? (
              <div>
                <Link to={`/framework/bioexcel/2.0/profile/edit/${profileId}`}>
                  {' '}
                  Edit <i class="icon icon-common icon-pencil-alt" />
                </Link>
              </div>
            ) : (
              <Link to={`/framework/bioexcel/2.0/profile/create`}>
                {' '}
                Create your profile <i class="icon icon-common icon-plus" />
              </Link>
            )}
          </div>

          <div className="row">
            <div className="column large-4">
              <center>
                <img
                  style={{ display: 'block', maxWidth: '200px' }}
                  src={profile.field_image[0] ? profile.field_image[0].url : ''}
                />
              </center>
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

              <p>
                {profile.field_additional_information[0]
                  ? Parser(profile.field_additional_information[0].value)
                  : ''}
              </p>
            </div>
            <p />
          </div>
          <Link
            className="button"
            to={`/framework/bioexcel/2.0/profile/map/${profileId}`}
          >
            {' '}
            Manage competencies <i class="icon icon-common icon-angle-right" />
          </Link>
          <table class="hover">
            <tbody>
              <tr>
                <td>
                  <h4> Competency profile </h4>
                </td>
                <td colspan="5">
                  <h4> Level of expertise </h4>
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
                  <h5>
                    Apply expertise in formal & natural sciences appropriate to
                    the disciplin
                  </h5>
                  <ul>
                    <li>
                      Knowledge
                      <ul>
                        <li>
                          Comprehends that a biological theory is not
                          necessarily true
                        </li>
                        <li>
                          Comprehends that models require experimental
                          validation
                        </li>
                        <li>
                          Fundamental scientific knowledge (biology, chemistry,
                          physics, mathematics)
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <ul>
                    <li>
                      Skill
                      <ul>
                        <li>Has an interdisciplinary view</li>
                        <li>
                          Asks relevant, hypothesis driven, well-defined
                          biological questions
                        </li>
                        <li>
                          Accurately judges the validity of his/her results
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <ul>
                    <li>
                      Attitude
                      <ul>
                        <li>Takes a comprehensive approach to problems</li>
                        <li>Allows for unexpected results</li>
                        <li>
                          Comprehends that results might be difficult to
                          interpret
                        </li>
                      </ul>
                    </li>
                  </ul>
                </td>
                <td>
                  <p>Specialist Knowledge</p>
                </td>
              </tr>

              <tr>
                <td>
                  <h5>User-driven service provision and support</h5>
                  <ul>
                    <li>
                      Knowledge
                      <ul>
                        <li>
                          Awareness of customer support practices and training
                          best practice
                        </li>
                        <li>
                          Knowledge of how own service fits in with broader
                          service landscape
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <ul>
                    <li>
                      Skill
                      <ul>
                        <li>Manages expectations effectively</li>
                      </ul>
                    </li>
                  </ul>
                  <ul>
                    <li>
                      Attitude
                      <ul>
                        <li>
                          Actively facilitates gathering of use cases and user
                          requirements, anticipates user problems
                        </li>
                      </ul>
                    </li>
                  </ul>
                </td>
                <td>
                  <p>Awareness</p>
                </td>
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
