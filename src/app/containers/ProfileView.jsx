import React, { useState, useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import Parser from 'html-react-parser';
import { apiUrl } from '../services/http/http';
import { Link } from 'react-router-dom';

import ReactTooltip from 'react-tooltip';
import { ProfileComparisonModal } from '../../shared/components/ProfileComparisonModal';
import auth from '../services/util/auth';
import { MetaTags } from 'react-meta-tags';
import { Helmet } from 'react-helmet';

export const ProfileView = props => {
  let history = useHistory();
  const frameworkName = props.location.pathname.split('/')[2];
  const frameworkVersion = props.location.pathname.split('/')[3];
  const profileId = props.location.pathname.split('/')[6];

  const [profile, setProfile] = useState();
  const [profiles, setProfiles] = useState();
  const [selectedProfileId, setSelectedProfileId] = useState();
  const [framework, setFramework] = useState();
  const [frameworkInfo, setFrameworkInfo] = useState();
  // const [showModal, setShowModal] = useState(false);
  const [comparisonError, setComparisonError] = useState(null);
  const [userFrameworks, setUserFrameworks] = useState([]);

  const redirectToCompare = e => {
    if (selectedProfileId) {
      history.push(
        `/framework/${frameworkName}/${frameworkVersion}/profiles/compare/${
          profile.id
        }/${selectedProfileId}`
      );
    } else {
      setComparisonError('Select a role to compare');
    }
  };

  const needTimeStamp = auth.currently_logged_in_user.is_logged_in
    ? '&timestamp=' + Date.now()
    : '';

  var competencyView = '';
  var expertise_levels_legend = [];
  var attribute_types = [];
  var frameworkFullName = '';
  var mapping = [];
  var user_roles = auth.currently_logged_in_user.roles;
  var userName = auth.currently_logged_in_user.username;
  var domainsList = '';

  let width2 = '';

  useEffect(() => {
    const fetchData = async () => {
      await fetch(
        `${apiUrl}/api/${frameworkName}/${frameworkVersion}/profiles/?_format=json&source=competencyhub&timestamp=${needTimeStamp}`
      )
        .then(Response => Response.json())
        .then(findresponse => {
          const profilesExcludingCurrentProfile = findresponse.filter(
            p =>
              // p.id !== props.match.params.id && p.publishing_status === 'Live'
              p.id !== profileId && p.publishing_status === 'Live'
          );
          setProfiles(profilesExcludingCurrentProfile);
        });
      await fetch(
        `${apiUrl}/api/${frameworkName}/${frameworkVersion}/profiles?_format=json&id=${profileId}&source=competencyhub&timestamp=${needTimeStamp}`
      )
        .then(Response => Response.json())
        .then(findresponse => {
          setProfile(findresponse);
        });

      await fetch(
        `${apiUrl}/api/version_manager?_format=json&source=competencyhub&${needTimeStamp}`
      )
        .then(Response => Response.json())
        .then(findresponse => {
          setFrameworkInfo(findresponse);
        });

      await fetch(
        `${apiUrl}/api/${frameworkName}/${frameworkVersion}?_format=json&source=competencyhub&timestamp=${needTimeStamp}`
      )
        .then(Response => Response.json())
        .then(findresponse => {
          setFramework(findresponse);
        });

      if (userName) {
        await fetch(`${apiUrl}/api/authorisation/${userName}?_format=json`, {
          method: 'GET',
          credentials: 'include'
        })
          .then(Response => Response.json())
          .then(findresponse => {
            setUserFrameworks(findresponse);
          });
      }
    };
    fetchData();
    //}, [profileId, frameworkVersion, frameworkName, userName, showModal]);
  }, [profileId, frameworkVersion, frameworkName, userName, needTimeStamp]);

  const getExpertise = competency => {
    if (mapping) {
      let obj = mapping.find(o => o.competency === competency);
      if (obj) {
        if (frameworkInfo) {
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

  // {document.addEventListener("DOMContentLoaded", function (event) {
  //   // console.log(document.querySelectorAll('[data-profileid]'))
  //   document.getElementById('bc_location').innerText = 'Prakash'
  // })}

  const getBarWidth = data => {
    let totalLevels = frameworkInfo.find(
      info => info.title.toLowerCase() === frameworkName
    ).expertise_levels.length;
    width2 = data ? 100 / ((totalLevels - 1) / data.rating_level) : 0;
    return width2;
  };

  const generateProfileView = () => {
    if (frameworkInfo) {
      frameworkInfo.map((info, infoIndex) => {
        if (info.title.toLowerCase() === frameworkName) {
          frameworkFullName = info.title;
          info.expertise_levels.map((level, levelIndex) =>
            expertise_levels_legend.push(
              <li
                key={levelIndex}
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
                <ReactTooltip
                  className="tooltip-custom"
                  style={{ color: 'fff' }}
                />
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
      competencyView = framework.map((item, itemIndex) =>
        item.domains.map((domain, domainIndex) => (
          <React.Fragment key={itemIndex + domainIndex}>
            <div key={domainIndex}>
              <div>
                <div class="vf-u-padding__top--800" />
                <h4>{domain.title}</h4>{' '}
                <span style={{ visibility: 'hidden' }}>
                  {(domainsList += domain.title + ',')}
                </span>
              </div>
            </div>
            <div>
              <div>
                {domain.competencies.map((competency, compIndex) => (
                  <React.Fragment key={compIndex}>
                    <div className="vf-grid vf-grid__col-4">
                      <div className="vf-grid__col--span-3">
                        <details className="vf-details" close>
                          <summary className="vf-details--summary">
                            {competency.title}
                          </summary>
                          {attribute_types.map((attribute_type, typeIndex) => {
                            return (
                              <div key={typeIndex}>
                                <div />
                                <ul className="vf-list">
                                  <div>
                                    <strong> {attribute_type} </strong>
                                  </div>
                                  {competency.attributes
                                    .filter(
                                      attribute =>
                                        attribute.type === attribute_type
                                    )
                                    .map((attribute, attrIndex) => {
                                      return (
                                        <li
                                          key={attrIndex}
                                          className="vf-list__item"
                                        >
                                          <span style={{ marginRight: '20px' }}>
                                            {getAttributeStatus(
                                              attribute.id,
                                              'profile1'
                                            ) ? (
                                              <i className="icon icon-common icon-check" />
                                            ) : (
                                              '-'
                                            )}
                                          </span>
                                          <span>{attribute.title}</span>
                                        </li>
                                      );
                                    })}
                                </ul>
                              </div>
                            );
                          })}
                        </details>
                      </div>
                      <div className="vf-grid__col--span-1">
                        <div className="fillerbg">
                          <div
                            className="fillerRight"
                            style={{
                              width:
                                getBarWidth(getExpertise(competency.id)) + '%',
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
                  </React.Fragment>
                ))}
              </div>
            </div>
          </React.Fragment>
        ))
      );
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div key={'unique'}>
      {generateProfileView()}
      {profile ? (
        <>
          <MetaTags>
            <title>{`${profile.title} - ${profile.job_title}`}</title>
            <meta
              property="og:title"
              content={`${profile.title} - ${profile.job_title}`}
            />
            <meta property="og:type" content="website" />
            <meta
              property="og:url"
              content={`https://competency.ebi.ac.uk${
                props.history.location.pathname
              }`}
            />
            <meta
              property="og:image"
              content="https://acxngcvroo.cloudimg.io/v7/https://cms.competency.ebi.ac.uk/themes/custom/ebi_academy/images/mastheads/CH_Jigsaw.jpg"
            />
            <meta
              property="og:description"
              content="Career profiles describe the background and activities of a specific professional role and list the competencies that a person in that role should have and at which level they are required"
            />
            <meta
              name="description"
              content="Career profiles describe the background and activities of a specific professional role and list the competencies that a person in that role should have and at which level they are required"
            />
            <meta
              property="keywords"
              content={`career profile, career development, ${domainsList}`}
            />
          </MetaTags>
          <Helmet>
            <link rel="canonical" href={props.location.pathname} />
          </Helmet>
          <div key={profileId} id="profile">
            <div style={{ float: 'right' }}>
              {user_roles.includes('framework_manager') &&
              userFrameworks.length > 0 &&
              userFrameworks.includes(frameworkFullName) ? (
                <ul>
                  <li className="profile_navigation">
                    <Link
                      className="vf-button vf-button--primary vf-button--sm"
                      to={`/framework/${frameworkName}/${frameworkVersion}/profile/edit/${profileId}`}
                    >
                      Edit overview
                      <i className="icon icon-common icon-pencil-alt" />
                    </Link>
                  </li>
                  <li className="profile_navigation">
                    <Link
                      className="vf-button vf-button--primary vf-button--sm"
                      to={`/framework/${frameworkName}/${frameworkVersion}/profile/map/${profileId}`}
                    >
                      Map competencies{' '}
                      <i className="icon icon-common icon-cog" />{' '}
                    </Link>
                  </li>
                </ul>
              ) : (
                <ProfileComparisonModal
                  profiles={profiles}
                  profile={profile}
                  includeGuestProfile={true}
                  comparisonError={comparisonError}
                  setSelectedProfileId={id => {
                    setSelectedProfileId(id);
                  }}
                  redirectToCompare={() => {
                    redirectToCompare();
                  }}
                />
              )}
            </div>
            <h1
              style={{ marginTop: '1em', marginBottom: '1em' }}
              data-profileid="1"
            >
              {profile.title} - {profile.job_title}
            </h1>

            <div className={profile.publishing_status + ' embl-grid'}>
              <div>
                <center>
                  <img
                    alt=""
                    style={{ display: 'block', maxWidth: '200px' }}
                    src={profile.image[0] ? profile.image[0].url : ''}
                    width={'auto'}
                    height={'auto'}
                    loading="lazy"
                  />
                </center>
                <p />
                <p style={{ textAlign: 'center' }}>
                  {profile.gender !== 'None' ? (
                    <div>
                      <p>
                        {profile.gender &&
                        profile.gender === 'Prefernottosay' ? (
                          <p> Gender: Prefer not to say </p>
                        ) : (
                          ''
                        )}
                      </p>
                      <p>
                        {profile.gender &&
                        profile.gender !== 'Prefernottosay' ? (
                          <p> Gender: {profile.gender} </p>
                        ) : (
                          ''
                        )}
                      </p>
                    </div>
                  ) : (
                    ''
                  )}
                  {profile.age ? profile.age + ' years' : ''}
                </p>
              </div>
              <div>
                <h2>Qualification and background</h2>
                <div>
                  {profile.qualification_background
                    ? Parser(profile.qualification_background)
                    : ''}
                </div>

                <h2>Activities of current role</h2>
                <div>
                  {profile.current_role ? Parser(profile.current_role) : ''}
                </div>

                <div>
                  {profile.additional_information
                    ? Parser(profile.additional_information)
                    : ''}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="column medium-3">
                {' '}
                <h3 style={{ marginTop: '25px' }}>
                  {frameworkFullName} {frameworkVersion} / Competencies
                </h3>
              </div>
              <div className="column medium-9 " />
            </div>
            <div className="row">
              <div className="column medium-12">
                <ul
                  className="vf-list legend-inline"
                  style={{ float: 'right' }}
                >
                  {expertise_levels_legend}
                </ul>
              </div>
            </div>
            <hr />
            {competencyView}
          </div>
        </>
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
