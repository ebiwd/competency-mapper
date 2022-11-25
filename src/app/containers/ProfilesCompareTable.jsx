import React, { useState, useEffect } from 'react';
import Stars from './Stars';
import auth from '../services/util/auth';

const ProfilesCompareTable = props => {
  const frameworkName = props.frameworkName;
  const frameworkVersion = props.frameworkVersion;
  const profile1Id = props.profile1Id;
  const profile2Id = props.profile2Id;

  const profile1 = props.profile1;
  const profile2 = props.profile2;
  const framework = props.framework;
  const frameworkInfo = props.frameworkInfo;

  var competencyView = '';
  var expertise_levels = [];
  var expertise_levels_legend = [];
  var attribute_types = [];
  var frameworkFullName = '';
  var frameworkLogo = '';
  var frameworkDesc = '';
  var mapping1 = [];
  var mapping2 = [];
  var user_roles = auth.currently_logged_in_user.roles;

  const getExpertise = (competency, profileid) => {
    let mapping = '';
    if (profileid == 'profile1') {
      mapping = mapping1;
    } else {
      mapping = mapping2;
    }

    let obj = mapping.find(o => o.competency == competency);
    if (obj) {
      if (frameworkInfo) {
        let expertise = frameworkInfo[0].expertise_levels.find(
          level => level.id == obj.expertise
        );

        return expertise.rating_level;
      }
    } else {
      return 0;
    }
  };

  const getAttributeStatus = (attribute, profile) => {
    let mapping = '';
    if (profile == 'profile1') {
      mapping = profile1.profile_mapping;
    } else {
      mapping = profile2.profile_mapping;
    }
    if (mapping) {
      let attribute_check_status = mapping.find(o =>
        o.attributes.find(a => a == attribute)
      );
      return attribute_check_status ? true : false;
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

    if (profile1) {
      mapping1 = profile1.profile_mapping;
    }

    if (profile2) {
      mapping2 = profile2.profile_mapping;
    }

    if (framework) {
      competencyView = framework.map(item =>
        item.domains.map((domain, did) => (
          <ul>
            <li className="domain_list">
              <div className="row callout">
                <div className="column medium-8">
                  <h4 className="domain_title"> {domain.title}</h4>
                </div>
                <div className="column medium-2">
                  {profile1 ? profile1.title : ''}
                </div>
                <div className="column medium-2">
                  {profile2 ? profile2.title : ''}
                </div>
              </div>
              <ul>
                {domain.competencies.map((competency, cid) => (
                  <li key={cid} className="competency_list">
                    <div className="row">
                      <div className="column medium-8">{competency.title}</div>

                      <div className="column medium-2">
                        <img
                          src={`${
                            Stars[getExpertise(competency.id, 'profile1')].src
                          }`}
                          width="50%"
                        />
                      </div>
                      <div className="column medium-2">
                        <img
                          src={`${
                            Stars[getExpertise(competency.id, 'profile2')].src
                          }`}
                          width="50%"
                        />
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
    <div key="main">
      {generateProfileView()}

      {competencyView}
    </div>
  );
};

export default ProfilesCompareTable;
