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
import Collapsible from 'react-collapsible';

export const ProfileView = props => {
  const frameworkName = props.location.pathname.split('/')[2];
  const frameworkVersion = props.location.pathname.split('/')[3];
  const profileId = props.location.pathname.split('/')[6];
  const alias = props.location.pathname.split('/')[7];

  const [profile, setProfile] = useState();
  const [framework, setFramework] = useState();
  const [frameworkInfo, setFrameworkInfo] = useState();

  var competencyView = '';
  var expertise_levels = [];
  var attribute_types = [];
  var frameworkFullName = '';
  var frameworkLogo = '';
  var frameworkDesc = '';
  var mapping = [];

  useEffect(() => {
    const fetchData = async () => {
      await fetch(
        `${apiUrl}/api/profiles?_format=json&id=${profileId}&timestamp=${Date.now()}`
      )
        .then(Response => Response.json())
        .then(findresponse => {
          setProfile(findresponse);
        });

      await fetch(`${apiUrl}/api/version_manager?_format=json`)
        .then(Response => Response.json())
        .then(findresponse => {
          setFrameworkInfo(findresponse);
        });

      await fetch(
        `${apiUrl}/api/${frameworkName}/${frameworkVersion}?_format=json`
      )
        .then(Response => Response.json())
        .then(findresponse => {
          setFramework(findresponse);
        });
    };
    fetchData();
  }, [profileId]);

  // const checkAlias = () => {
  //   if (profile.path[0].alias.substring(1) != alias) {
  //     props.history.push(
  //       `/framework/${frameworkName}/${frameworkVersion}/profile/view/${profileId}${
  //         profile.path[0].alias
  //       }`
  //     );
  //   }
  // };

  const getExpertise = competency => {
    let obj = mapping.find(o => o.competency == competency);
    if (obj) {
      if (frameworkInfo) {
        let expertise = frameworkInfo[0].expertise_levels.find(
          level => level.id == obj.expertise
        );
        return expertise.title;
      }
    } else {
      return '';
    }
  };

  const generateProfileView = () => {
    if (frameworkInfo) {
      frameworkInfo.map(info => {
        if (info.title.toLowerCase() === frameworkName) {
          frameworkFullName = info.title;
          frameworkLogo = info.logo[0].url;
          frameworkDesc = info.description;
          info.expertise_levels.map(
            level => (expertise_levels[level.id] = level.title)
          );
        }
      });
      frameworkInfo.map(info => {
        if (info.title.toLowerCase() === frameworkName) {
          info.attribute_types.map(
            attribute => (attribute_types[attribute.id] = attribute.title)
          );
        }
      });
    }

    if (profile) {
      mapping = profile.profile_mapping;
    }

    if (framework) {
      competencyView = framework.map(item =>
        item.domains.map((domain, did) => (
          <ul>
            <li className="domain_list">
              <div className="row callout">
                <div className="column medium-9">
                  <h4 className="domain_title"> {domain.title}</h4>
                </div>
                <div className="column medium-3">
                  <h4>Levels of expertise</h4>
                </div>
              </div>
              <ul>
                {domain.competencies.map((competency, cid) => (
                  <li className="competency_list">
                    <div className="row">
                      <div className="column medium-9">
                        <Collapsible
                          trigger={
                            <div className="open-close-title">
                              <h5>
                                {competency.title}
                                <span className="icon icon-common icon-angle-right icon-custom">
                                  <p className="show-for-sr">show more</p>
                                </span>
                              </h5>
                            </div>
                          }
                          triggerWhenOpen={
                            <div className="open-close-title">
                              <h5>
                                {competency.title}
                                <span className="icon icon-common icon-angle-down icon-custom">
                                  <p className="show-for-sr">show less</p>
                                </span>
                              </h5>
                            </div>
                          }
                        >
                          <ul>
                            {attribute_types.map(attribute_type => {
                              return (
                                <li className="attribute_type">
                                  {attribute_type}
                                  <ul>
                                    {competency.attributes
                                      .filter(
                                        attribute =>
                                          attribute.type == attribute_type
                                      )
                                      .map(attribute => (
                                        <li className="attribute_title">
                                          <div className="row">
                                            <div className="column medium-1" />
                                            <div className="column medium-11">
                                              <label
                                                className="attribute_label"
                                                for={attribute.id}
                                              >
                                                {' '}
                                                {attribute.title}
                                              </label>
                                            </div>
                                          </div>
                                        </li>
                                      ))}
                                  </ul>
                                </li>
                              );
                            })}
                          </ul>
                        </Collapsible>
                      </div>
                      <div className="column medium-3">
                        {getExpertise(competency.id)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        ))
      );
    }
  };

  return (
    <div>
      {generateProfileView()}
      {profile ? (
        <div>
          {
            //checkAlias()
          }

          <h2 style={{ marginTop: '1em', marginBottom: '1em' }}>
            {profile.title} - {profile.job_title}
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
                  src={profile.image[0] ? profile.image[0].url : ''}
                />
              </center>
              <p />
              <p style={{ textAlign: 'center' }}>
                {profile.gender ? profile.gender : ''}{' '}
                {profile.age ? '| ' + profile.age + ' years' : ''}
              </p>
            </div>
            <div className="column large-8">
              <h3>Qualification and background</h3>
              <p>
                {profile.qualification_background
                  ? Parser(profile.qualification_background)
                  : ''}
              </p>

              <h3>Acitivities of current role</h3>
              <p>{profile.current_role ? Parser(profile.current_role) : ''}</p>

              <p>Additional information</p>
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
          {competencyView}
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
