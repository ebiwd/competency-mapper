import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { apiUrl } from '../services/http/http';
import ProfileService from '../services/profile/profile';
import ActiveRequestsService from '../services/active-requests/active-requests';
import { Link, Redirect } from 'react-router-dom';
import Collapsible from 'react-collapsible';
import user_icon from './user_icon.png';
import Parser from 'html-react-parser';

export const ProfileMap = props => {
  const [profile, setProfile] = useState();
  const [framework, setFramework] = useState();
  const [frameworkInfo, setFrameworkInfo] = useState();

  const frameworkName = props.location.pathname.split('/')[2];
  const frameworkVersion = props.location.pathname.split('/')[3];
  const profileId = props.location.pathname.split('/')[6];
  var competencyForm = '';
  var expertise_levels = [];
  var attribute_types = [];
  var frameworkFullName = '';
  var frameworkLogo = '';
  var frameworkDesc = '';

  useEffect(() => {
    const fetchData = async () => {
      await fetch(`${apiUrl}/node/${profileId}?_format=json`)
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

  const handleSubmit = e => {
    e.preventDefault();
    alert('Form processed');
  };

  const generateForm = () => {
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

    console.log(attribute_types);

    if (framework) {
      competencyForm = framework.map(item =>
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
                                            <div className="column medium-1">
                                              <input
                                                type="checkbox"
                                                id={attribute.id}
                                              />
                                            </div>
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
                        <select>
                          {expertise_levels.map((key, value) => (
                            <option
                              value={key}
                              data-level-id={value}
                              data-competency-id={competency.id}
                            >
                              {key}
                            </option>
                          ))}
                        </select>
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
      {generateForm()}
      {profile ? (
        <div>
          <div className="row">
            <h2>Competency mapping: {frameworkFullName} </h2>

            <div className="column medium-12">
              <div className="row">
                <div className="column medium-3">
                  <img
                    src={
                      profile.field_image[0]
                        ? profile.field_image[0].url
                        : user_icon
                    }
                    width="150px"
                  />
                  <h5>{profile.title[0].value} </h5>{' '}
                  <h5>{profile.field_job_title[0].value} </h5>
                  <Link
                    to={`/framework/bioexcel/2.0/profile/view/${profileId}/alias`}
                  >
                    {' '}
                    <i class="icon icon-common icon-angle-left" /> Profile
                    overview{' '}
                  </Link>
                </div>
                <div className="column medium-6 form_intro">
                  <p>
                    The form below is listing competencies from{' '}
                    {frameworkFullName} competency framework. A competency is an
                    observable ability of any professional, integrating multiple
                    components such as knowledge, skills and behaviours. A
                    competency profile lists and defines all the competencies
                    that an individual might need to fulfil a particular role,
                    or that define specific user groups.
                  </p>
                  <p>
                    You may assign a level expertise against each competency.
                    The levels of expertise are:-
                    <ul>
                      {expertise_levels.map(level => (
                        <li>{level}</li>
                      ))}
                    </ul>
                  </p>
                </div>
                <div className="column medium-3">
                  <img src={frameworkLogo} />
                  <br />
                </div>
              </div>

              <div className="competency_section">
                {
                  <form onSubmit={e => handleSubmit(e)}>
                    {competencyForm}
                    <div className="submit_fixed">
                      <button className="button" type="submit">
                        Save <i class="icon icon-common icon-save" />
                      </button>
                    </div>
                  </form>
                }
              </div>
            </div>
          </div>
        </div>
      ) : (
        'Loading'
      )}
    </div>
  );
};

export const MapProfile = () => (
  <Switch>
    <Route
      exact
      path="/framework/:framework/:version/profile/map/:id"
      component={ProfileMap}
    />
  </Switch>
);

export default MapProfile;
