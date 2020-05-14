import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import Collapsible from 'react-collapsible';
import ReactTooltip from 'react-tooltip';
import { ProfileHeader } from '../map/ProfileHeader';
import { ProfilePrint } from '../view/ProfilePrint';
import ActiveRequestsService from '../../services/active-requests/active-requests';
import CompetencyService from '../../services/competency/competency';
import ProfileService from '../../services/profile/profile';

const competencyService = new CompetencyService();
const profileService = new ProfileService();
const activeRequestsService = new ActiveRequestsService();

export const ProfileView = ({ match }) => {
  const {
    framework: frameworkName,
    version: frameworkVersion,
    id: profileId
  } = match.params;

  const [profile, setProfile] = useState();
  const [framework, setFramework] = useState();
  const [frameworkInfo, setFrameworkInfo] = useState();

  let competencyView = '';
  let expertise_levels = [];
  let expertise_levels_legend = [];
  let attribute_types = [];
  let mapping = [];
  let user_roles = localStorage.getItem('roles') || '';

  let profile2Expertise = '';
  let width2 = '';
  let floatRight = '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        activeRequestsService.startRequest();
        const [profile, frameworkInfo, framework] = await Promise.all([
          profileService.getProfile(profileId),
          competencyService.getAllVersionedFrameworks(),
          competencyService.getVersionedFramework(
            frameworkName,
            frameworkVersion
          )
        ]);
        setProfile(profile);
        setFrameworkInfo(frameworkInfo);
        setFramework(framework);
      } finally {
        activeRequestsService.finishRequest();
      }
    };

    fetchData();
  }, [profileId, frameworkName, frameworkVersion]);

  // const checkAlias = () => {
  //   if (profile) {
  //     let url_alias = profile.url_alias;

  //     if (profile.url_alias != alias) {
  //       props.history.push(
  //         `/framework/${frameworkName}/${frameworkVersion}/profile/view/${profileId}${url_alias}`
  //       );
  //     }
  //   }
  // };

  const getExpertise = competency => {
    if (mapping) {
      let obj = mapping.find(o => o.competency == competency);
      if (obj) {
        if (frameworkInfo) {
          let expertise = frameworkInfo[0].expertise_levels.find(
            level => level.id == obj.expertise
          );
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
    width2 = data ? 100 / (3 / data.rating_level) : 0;
    return width2;
  };

  const generateProfileView = () => {
    if (frameworkInfo) {
      console.log(frameworkInfo);
      frameworkInfo.map(info => {
        if (info.title.toLowerCase() === frameworkName) {
          info.expertise_levels.map(
            level => (expertise_levels[level.rating_level] = level.title)
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

    let index = 0;
    expertise_levels.map((level, key) => {
      expertise_levels_legend.push(
        <li style={{ textAlign: 'center' }}>
          <span className="badge secondary"> {key} </span> <span> {level}</span>
        </li>
      );
      index++;
    });

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

  return (
    <div>
      {generateProfileView()}
      {profile && (
        <div id="profile">
          {/* checkAlias() */}

          <h2 style={{ marginTop: '1em', marginBottom: '1em' }}>
            {`${profile.title} - ${profile.job_title}`}
          </h2>

          <div style={{ float: 'right' }}>
            {user_roles.search('framework_manager') != -1 ? (
              <ul>
                <li className="profile_navigation">
                  <Link
                    to={`/framework/bioexcel/2.0/profile/edit/${profileId}`}
                  >
                    Edit overview
                    <i className="icon icon-common icon-pencil-alt" />
                  </Link>
                </li>
                <li className="profile_navigation">
                  <Link to={`/framework/bioexcel/2.0/profile/map/${profileId}`}>
                    Map competencies <i className="icon icon-common icon-cog" />{' '}
                    {console.log(localStorage.getItem('roles'))}
                  </Link>
                </li>
              </ul>
            ) : (
              <Link to={`/framework/bioexcel/2.0/profile/create`}>
                Create your profile <i className="icon icon-common icon-plus" />
              </Link>
            )}
          </div>

          <ProfileHeader {...profile} />

          {competencyView}
        </div>
      )}

      <div className="submit_fixed">
        <ProfilePrint />
      </div>
    </div>
  );
};

export default ProfileView;
