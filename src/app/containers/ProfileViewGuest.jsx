import React, { useState, useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import Parser from 'html-react-parser';

import { apiUrl } from '../services/http/http';
//import ProfileService from '../services/profile/profile';
//import ActiveRequestsService from '../services/active-requests/active-requests';
import { Link } from 'react-router-dom';
import Collapsible from 'react-collapsible';
import ReactTooltip from 'react-tooltip';
import user_icon from './user_icon.png';
import { ProfileComparisonModal } from '../../shared/components/ProfileComparisonModal';
// import masterList from './masterList.json';

export const ProfileViewGuest = props => {
  let history = useHistory();
  const frameworkName = props.location.pathname.split('/')[2];
  const frameworkVersion = props.location.pathname.split('/')[3];

  const [profile, setProfile] = useState();
  const [profiles, setProfiles] = useState();
  const [selectedProfileId, setSelectedProfileId] = useState();
  const [comparisonError, setComparisonError] = useState(null);
  const [framework, setFramework] = useState();
  const [frameworkInfo, setFrameworkInfo] = useState();

  var competencyView = '';
  //var expertise_levels = [];
  var expertise_levels_legend = [];
  var attribute_types = [];
  var frameworkFullName = '';
  //var frameworkLogo = '';
  //var frameworkDesc = '';
  var mapping = [];

  //let profile2Expertise = '';
  let width2 = '';
  //let floatRight = '';

  const redirectToCompare = e => {
    if (selectedProfileId) {
      history.push(
        `/framework/${frameworkName}/${frameworkVersion}/profiles/compare/guest/${selectedProfileId}`
      );
    } else {
      setComparisonError('Select a role to compare');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await setProfile(JSON.parse(localStorage.getItem('guestProfile')));

      await fetch(
        `${apiUrl}/api/version_manager?_format=json&source=competencyhub`
      )
        .then(Response => Response.json())
        .then(findresponse => {
          setFrameworkInfo(findresponse);
        });

      await fetch(
        `${apiUrl}/api/${frameworkName}/${frameworkVersion}?_format=json&source=competencyhub`
      )
        .then(Response => Response.json())
        .then(findresponse => {
          setFramework(findresponse);
        });
      await fetch(
        `${apiUrl}/api/${frameworkName}/${frameworkVersion}/profiles/?_format=json&source=competencyhub`
      )
        .then(Response => Response.json())
        .then(findresponse => {
          const profilesExcludingCurrentProfile = findresponse.filter(
            p =>
              // p.id !== props.match.params.id && p.publishing_status === 'Live'
              p.id !== 'guest' && p.publishing_status === 'Live'
          );
          setProfiles(profilesExcludingCurrentProfile);
        });
    };
    fetchData();
  }, [frameworkName, frameworkVersion]);

  const getExpertise = competency => {
    if (mapping) {
      let obj = mapping.find(o => o.competency === competency);
      if (obj) {
        if (frameworkInfo) {
          // let expertise = frameworkInfo[0].expertise_levels.find(
          //   level => level.id == obj.expertise
          // );
          let expertise = frameworkInfo
            .find(info => info.title.toLowerCase() === frameworkName)
            .expertise_levels.find(level => level.id === obj.expertise);
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
        o.attributes.find(a => a === aid)
      );
      return attribute_check_status;
    }
  };

  const getBarWidth = data => {
    let totalLevels = frameworkInfo.find(
      info => info.title.toLowerCase() === frameworkName
    ).expertise_levels.length;

    width2 = data ? 100 / ((totalLevels - 1) / data.rating_level) : 0;
    return width2;
  };

  const generateProfileView = () => {
    if (frameworkInfo) {
      frameworkInfo.map(info => {
        if (info.title.toLowerCase() === frameworkName) {
          frameworkFullName = info.title;
          //frameworkLogo = info.logo[0].url;
          //frameworkDesc = info.description;
          info.expertise_levels.map((level, index) =>
            expertise_levels_legend.push(
              <li
                key={level.rating_level}
                className="vf-list__item"
                style={{ textAlign: 'center' }}
              >
                <div
                  data-tip={level.description ? level.description : 'NA'}
                  data-html={true}
                  data-type="info"
                  data-multiline={true}
                >
                  <span className="vf-badge vf-badge--tertiary">
                    {' '}
                    {level.rating_level}{' '}
                  </span>{' '}
                  <span> {level.title}</span>
                </div>
                <ReactTooltip className="tooltip-custom" />
              </li>
            )
          );
        }
        return null;
      });
      frameworkInfo.map(info => {
        if (info.title.toLowerCase() === frameworkName) {
          info.attribute_types.map(
            attribute => (attribute_types[attribute.id] = attribute.title)
          );
        }
        return null;
      });
    }

    if (profile) {
      mapping = profile.profile_mapping;
      document.getElementById('bc_location').innerText =
        profile.title + ' - ' + profile.job_title;
    }

    if (framework) {
      competencyView = framework.map(item =>
        item.domains.map((domain, domainIndex) => (
          <div key={domainIndex}>
            <div className="row callout">
              <div className="column medium-12 ">
                <h5>{domain.title}</h5>{' '}
              </div>
            </div>
            {domain.competencies.map((competency, compIndex) => (
              <div key={compIndex}>
                <div className="vf-grid vf-grid__col-4">
                  <div className="vf-grid__col--span-3">
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
                  <div className="vf-grid__col--span-1">
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
                              getBarWidth(getExpertise(competency.id)) === 0
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
                    {attribute_types.map((attribute_type, typeIndex) => {
                      return (
                        <div
                          key={typeIndex}
                          className="accordion-item is-active"
                          data-accordion-item
                        >
                          <div className="vf-grid vf-grid__col-4 attribute_align_type">
                            <div className="vf-grid__col--span-3">
                              <strong> {attribute_type} </strong>
                            </div>
                            <div className="vf-grid__col--span-1" />
                          </div>
                          {competency.attributes
                            .filter(
                              attribute => attribute.type === attribute_type
                            )
                            .map((attribute, attrIndex) => {
                              return (
                                <div
                                  key={attrIndex}
                                  className="vf-grid vf-grid__col-4 attribute_align"
                                >
                                  <div className="vf-grid__col--span-3">
                                    {attribute.title}
                                  </div>
                                  <div className="vf-grid__col--span-1">
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
      {profile ? (
        <div id="profile">
          <h1 style={{ marginTop: '1em', marginBottom: '1em' }}>
            {profile.title} - {profile.job_title}
          </h1>

          <div style={{ float: 'right' }}>
            <ProfileComparisonModal
              profiles={profiles}
              profile={profile}
              comparisonError={comparisonError}
              setSelectedProfileId={id => {
                setSelectedProfileId(id);
              }}
              redirectToCompare={e => {
                redirectToCompare(e);
              }}
            />
            <ul>
              <li className="profile_navigation">
                <Link
                  className="vf-link"
                  to={`/framework/${frameworkName}/${frameworkVersion}/profile/create/guest`}
                >
                  Edit profile{' '}
                  <i className="icon icon-common icon-pencil-alt" />
                </Link>
              </li>
            </ul>
          </div>

          <div
            className={profile.publishing_status + ' vf-grid vf-grid__col-4'}
          >
            <div className="vf-grid__col--span-1">
              <center>
                <img
                  alt=""
                  style={{ display: 'block', maxWidth: '150px' }}
                  src={profile.image[0] ? profile.image[0].url : user_icon}
                  //src='#'
                />
              </center>
              <p />
              <div style={{ textAlign: 'center' }}>
                {profile.gender !== 'None' ? (
                  <div>
                    {profile.gender && profile.gender === 'Prefernottosay' ? (
                      <p> Gender: Prefer not to say </p>
                    ) : (
                      ''
                    )}

                    {profile.gender && profile.gender !== 'Prefernottosay' ? (
                      <span> Gender: {profile.gender} </span>
                    ) : (
                      ''
                    )}
                  </div>
                ) : (
                  ''
                )}

                {profile.age ? <p> Age: {profile.age + ' years'} </p> : ''}
              </div>
            </div>
            <div className="vf-grid__col--span-3">
              <h3>Qualification and background</h3>

              {profile.qualification_background
                ? Parser(profile.qualification_background)
                : ''}

              <h3>Activities of current role</h3>
              {profile.current_role ? Parser(profile.current_role) : ''}

              {profile.additional_information
                ? Parser(profile.additional_information)
                : ''}
            </div>
            <p />
          </div>

          <div className="vf-grid vf-grid__col-4">
            <div className="vf-grid__col--span-1">
              <h5 style={{ marginTop: '25px' }}>
                {frameworkFullName} {frameworkVersion} / Competencies
              </h5>
            </div>
            <div className="vf-grid__col--span-3">
              <ul className="vf-list legend-inline" style={{ float: 'right' }}>
                {expertise_levels_legend}
              </ul>
            </div>
          </div>
          <div className="row">
            <div className="column medium-12" />
          </div>
          <hr />
          {competencyView}
        </div>
      ) : (
        'Loading profile'
      )}

      <form onSubmit={e => handlePrint(e)}>
        <div className="submit_fixed">
          <button className="vf-button vf-button--secondary" type="submit">
            Print <i className="icon icon-common icon-print" />
          </button>
          <p style={{ paddingTop: '30px' }}>
            [Please enable background graphics in the print preview in order to
            get better print output]
          </p>
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
