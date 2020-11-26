import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import Parser from 'html-react-parser';

import { apiUrl } from '../services/http/http';
import ProfileService from '../services/profile/profile';
import ActiveRequestsService from '../services/active-requests/active-requests';
import { Link, Redirect } from 'react-router-dom';
import Collapsible from 'react-collapsible';
import ReactTooltip from 'react-tooltip';
import user_icon from './user_icon.png';
const $ = window.$;

export const ProfileViewGuest = props => {
  const frameworkName = props.location.pathname.split('/')[2];
  const frameworkVersion = props.location.pathname.split('/')[3];

  const [profile, setProfile] = useState();
  const [framework, setFramework] = useState();
  const [frameworkInfo, setFrameworkInfo] = useState();

  var competencyView = '';
  var expertise_levels = [];
  var expertise_levels_legend = [];
  var attribute_types = [];
  var frameworkFullName = '';
  var frameworkLogo = '';
  var frameworkDesc = '';
  var mapping = [];

  let profile2Expertise = '';
  let width2 = '';
  let floatRight = '';

  useEffect(() => {
    const fetchData = async () => {
      await setProfile(JSON.parse(localStorage.getItem('guestProfile')));

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
  }, []);

  const getExpertise = competency => {
    if (mapping) {
      let obj = mapping.find(o => o.competency == competency);
      if (obj) {
        if (frameworkInfo) {
          // let expertise = frameworkInfo[0].expertise_levels.find(
          //   level => level.id == obj.expertise
          // );
          let expertise = frameworkInfo
            .find(info => info.title.toLowerCase() === frameworkName)
            .expertise_levels.find(level => level.id == obj.expertise);
          return expertise;
        }
      } else {
        return '';
      }
    }
  };

  const getAttributeStatus = aid => {
    if (mapping) {
      let attribute_check_status = mapping.find(o =>
        o.attributes.find(a => a == aid)
      );
      return attribute_check_status;
    }
  };

  const getBarWidth = data => {
    let totalLevels = frameworkInfo.find(
      info => info.title.toLowerCase() === frameworkName
    ).expertise_levels.length;

    width2 = data ? 100 / ((totalLevels - 1) / data.rating_level) : 0;
    console.log(data);
    return width2;
  };

  const generateProfileView = () => {
    if (frameworkInfo) {
      console.log(frameworkInfo);
      frameworkInfo.map(info => {
        if (info.title.toLowerCase() === frameworkName) {
          frameworkFullName = info.title;
          frameworkLogo = info.logo[0].url;
          frameworkDesc = info.description;
          info.expertise_levels.map(
            //level => (expertise_levels[level.rating_level] = level.title)
            level =>
              expertise_levels_legend.push(
                <li style={{ textAlign: 'center' }}>
                  <div
                    data-tip={level.description ? level.description : 'NA'}
                    data-html={true}
                    data-type="info"
                    data-multiline={true}
                  >
                    <span className="badge secondary">
                      {' '}
                      {level.rating_level}{' '}
                    </span>{' '}
                    <span> {level.title}</span>
                  </div>
                  <ReactTooltip class="tooltip-custom" />
                </li>
              )
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
      console.log(mapping);
    }

    if (framework) {
      competencyView = framework.map(item =>
        item.domains.map(domain => (
          <div>
            <div className="row callout">
              <div className="column medium-12 ">
                <h5>{domain.title}</h5>{' '}
              </div>
            </div>
            {domain.competencies.map(competency => (
              <div>
                <div className="row">
                  <div className="column medium-8">
                    <span className="competency_title">
                      {' '}
                      {competency.title.length > 150
                        ? competency.title
                            .split(' ')
                            .splice(0, 18)
                            .join(' ') + ' ..'
                        : competency.title}
                    </span>
                  </div>
                  <div className="column medium-4">
                    <div className="fillerbg">
                      <div
                        className="fillerRight"
                        style={{
                          width: getBarWidth(getExpertise(competency.id)) + '%',
                          display: 'flow-root'
                        }}
                      >
                        <span
                          style={{
                            float:
                              getBarWidth(getExpertise(competency.id)) == 0
                                ? 'none'
                                : 'right'
                          }}
                          className="rating_level_number"
                        >
                          {getExpertise(competency.id)
                            ? getExpertise(competency.id).rating_level
                            : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="profile_collapsible">
                  <Collapsible
                    trigger={
                      <div className="open-close-title">
                        <i className="icon icon-common icon-angle-right icon-custom" />
                      </div>
                    }
                    triggerWhenOpen={
                      <div className="open-close-title">
                        <i className="icon icon-common icon-angle-down icon-custom" />
                      </div>
                    }
                  >
                    {attribute_types.map(attribute_type => {
                      return (
                        <div
                          className="accordion-item is-active"
                          data-accordion-item
                        >
                          <div className="row attribute_align_type">
                            <div className="column medium-8">
                              <strong> {attribute_type} </strong>
                            </div>
                            <div className="column medium-4" />
                          </div>
                          {competency.attributes
                            .filter(
                              attribute => attribute.type == attribute_type
                            )
                            .map(attribute => {
                              return (
                                <div className="row attribute_align">
                                  <div className="column medium-8">
                                    {attribute.title}
                                  </div>
                                  <div className="column medium-4">
                                    {getAttributeStatus(
                                      attribute.id,
                                      'profile1'
                                    ) ? (
                                      <i className="icon icon-common icon-check" />
                                    ) : (
                                      '-'
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      );
                    })}
                  </Collapsible>
                </div>
              </div>
            ))}
          </div>
        ))
      );
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {generateProfileView()}
      <nav>
        <Link to={'/'}>Home</Link> /{' '}
        <Link to={`/framework/${frameworkName}/${frameworkVersion}`}>
          {' '}
          {frameworkFullName} {frameworkVersion}{' '}
        </Link>{' '}
      </nav>
      {profile ? (
        <div id="profile">
          <h2 style={{ marginTop: '1em', marginBottom: '1em' }}>
            {profile.title} - {profile.job_title}
          </h2>

          <div style={{ float: 'right' }}>
            <ul>
              <li className="profile_navigation">
                <Link
                  to={`/framework/${frameworkName}/${frameworkVersion}/profile/create/guest`}
                >
                  Edit overview
                  <i className="icon icon-common icon-pencil-alt" />
                </Link>
              </li>
              <li className="profile_navigation">
                <Link
                  to={`/framework/${frameworkName}/${frameworkVersion}/profile/map/guest`}
                >
                  Map competencies <i className="icon icon-common icon-cog" />{' '}
                </Link>
              </li>
            </ul>
          </div>

          <div className={profile.publishing_status + ' row'}>
            <div className="column large-3">
              <center>
                <img
                  style={{ display: 'block', maxWidth: '150px' }}
                  src={profile.image[0] ? profile.image[0].url : user_icon}
                  //src='#'
                />
              </center>
              <p />
              <p style={{ textAlign: 'center' }}>
                {profile.gender ? profile.gender : ''}{' '}
                {profile.age ? profile.age + ' years' : ''}
              </p>
            </div>
            <div className="column large-9">
              <h3>Qualification and background</h3>
              <p>
                {profile.qualification_background
                  ? Parser(profile.qualification_background)
                  : ''}
              </p>

              <h3>Activities of current role</h3>
              <p>{profile.current_role ? Parser(profile.current_role) : ''}</p>

              <p>
                {profile.additional_information
                  ? Parser(profile.additional_information)
                  : ''}
              </p>
            </div>
            <p />
          </div>
          <p>&nbsp;</p>

          <div className="row">
            <div className="column medium-3">
              {' '}
              <h5 style={{ marginTop: '25px' }}>
                {frameworkFullName} {frameworkVersion} / Competencies
              </h5>
            </div>
            <div className="column medium-9 " />
          </div>
          <div className="row">
            <div className="column medium-12">
              <ul className="legend-inline" style={{ float: 'right' }}>
                {expertise_levels_legend}
              </ul>
            </div>
          </div>
          <hr />
          {competencyView}
        </div>
      ) : (
        'Loading profile'
      )}

      <form onSubmit={e => handlePrint(e)}>
        <div className="submit_fixed">
          <button className="button" type="submit">
            Print <i className="icon icon-common icon-print" />
          </button>
        </div>
      </form>
    </div>
  );
};

export const ViewGuestProfile = () => (
  <Switch>
    <Route
      exact
      path="/framework/:framework/:version/profile/view/guest"
      component={ProfileViewGuest}
    />
  </Switch>
);

export default ViewGuestProfile;
