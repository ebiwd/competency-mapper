import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import Collapsible from 'react-collapsible';
import ReactTooltip from 'react-tooltip';
import { ProfileHeader } from './ProfileHeader';
import { ProfilePrint } from './ProfilePrint';
import ActiveRequestsService from '../services/active-requests/active-requests';
import CompetencyService from '../services/competency/competency';
import ProfileService from '../services/profile/profile';

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

  const getAttributeStatus = aid => {
    if (mapping) {
      let attribute_check_status = mapping.find(o =>
        o.attributes.find(a => a == aid)
      );
      return attribute_check_status;
    }
  };

  const generateProfileView = () => {
    if (frameworkInfo) {
      frameworkInfo.map(info => {
        if (info.title.toLowerCase() === frameworkName) {
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

    let index = 0;
    expertise_levels.map((level, key) => {
      expertise_levels_legend.push(
        "<li class='legend'>  <div class='legend_number'> " +
          index +
          '</div>' +
          level +
          '</li>'
      );
      index++;
    });

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
                  <h4>
                    Levels of expertise{' '}
                    <span
                      data-tip={
                        "<ul class='legend_container'>" +
                        expertise_levels_legend +
                        '</ul> '
                      }
                      data-html={true}
                      data-type="light"
                    >
                      <i class="icon icon-common icon-info" />
                    </span>
                  </h4>
                  <ReactTooltip />
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
                                            <div className="column medium-12">
                                              <span
                                                className={
                                                  getAttributeStatus(
                                                    attribute.id
                                                  )
                                                    ? 'attribute_selected'
                                                    : 'attribute_not_selected'
                                                }
                                              >
                                                {getAttributeStatus(
                                                  attribute.id
                                                ) ? (
                                                  <i class="icon icon-common icon-check" />
                                                ) : (
                                                  ''
                                                )}{' '}
                                                {attribute.title}
                                              </span>
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
                        <h5>
                          {getExpertise(competency.id)
                            ? getExpertise(competency.id)
                            : 'Not applicable'}
                        </h5>
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
                    <i class="icon icon-common icon-pencil-alt" />
                  </Link>
                </li>
                <li className="profile_navigation">
                  <Link to={`/framework/bioexcel/2.0/profile/map/${profileId}`}>
                    Map competencies <i class="icon icon-common icon-cog" />{' '}
                    {console.log(localStorage.getItem('roles'))}
                  </Link>
                </li>
              </ul>
            ) : (
              <Link to={`/framework/bioexcel/2.0/profile/create`}>
                Create your profile <i class="icon icon-common icon-plus" />
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
