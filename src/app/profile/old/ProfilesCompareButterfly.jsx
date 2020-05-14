import React, { usecompetency_title, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { apiUrl } from '../../services/http/http';
import ProfileService from '../../services/profile/profile';
import ActiveRequestsService from '../../services/active-requests/active-requests';
import { Link, Redirect } from 'react-router-dom';
import RadarChart from 'react-svg-radar-chart';
import 'react-svg-radar-chart/build/css/index.css';
//import user_icon from './user_icon.png';
import Collapsible from 'react-collapsible';

export const ProfilesCompareButterfly = props => {
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
  var user_roles = localStorage.getItem('roles')
    ? localStorage.getItem('roles')
    : '';
  var competencies_array = [];
  var expertise_array = [];
  var profile1_expertise_obj = new Object();
  var profile2_expertise_obj = new Object();
  var chart_props = [];
  var leftData = [];
  var rightData = [];

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
        return expertise;
      }
    } else {
      return null;
    }
  };

  const getAttributeStatus = (attribute, profile) => {
    let mapping = '';
    if (profile == 'profile1') {
      mapping = profile1.profile_mapping;
    } else {
      mapping = profile2.profile_mapping;
    }
    //console.log(mapping)
    if (mapping) {
      let attribute_check_status = mapping.find(o =>
        o.attributes.find(a => a == attribute)
      );
      //console.log(attribute_check_status)
      return attribute_check_status ? true : false;
    }
  };

  const getAttributeRows = competency => {
    console.log('hi ' + competency);
  };

  const generateProfileView = () => {
    if (frameworkInfo) {
      frameworkInfo.map(info => {
        if (info.title.toLowerCase() === frameworkName) {
          frameworkFullName = info.title;
          frameworkLogo = info.logo[0].url;
          frameworkDesc = info.description;
          info.expertise_levels.map(
            (level, key) => (expertise_array[key] = level.id) //(expertise_levels[level.id] = level.title)
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

    if (profile1) {
      mapping1 = profile1.profile_mapping;
    }

    if (profile2) {
      mapping2 = profile2.profile_mapping;
    }

    if (frameworkInfo) {
      frameworkInfo.map(framework => {
        if (framework.title == 'BioExcel') {
          framework.expertise_levels.map((level, key) => {
            expertise_array[key] = level.id;
          });
        }
      });
    }

    if (framework) {
      competencyView = framework.map(item =>
        item.domains.map(domain =>
          domain.competencies.map(competency => {
            let profile1Expertise = getExpertise(competency.id, 'profile1');
            let profile2Expertise = getExpertise(competency.id, 'profile2');
            let width1 = profile1Expertise
              ? 100 / (3 / profile1Expertise.rating_level)
              : 0;
            let margin1 = 100 - width1;
            margin1 = margin1 == 100 ? 88 : margin1;

            let width2 = profile2Expertise
              ? 100 / (3 / profile2Expertise.rating_level)
              : 0;
            let floatRight = width2 == 0 ? 'none' : 'right';

            return (
              <>
                <div className="row">
                  <div className="column medium-6">
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
                  <div className="column medium-3">
                    <div className="fillerbg">
                      <div
                        className="fillerLeft"
                        style={{
                          width: width1 + '%',
                          marginLeft: margin1 + '%'
                        }}
                      >
                        <span
                          style={{ position: 'relative' }}
                          className="rating_level_number"
                        >
                          {profile1Expertise
                            ? profile1Expertise.rating_level
                            : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="column medium-3">
                    <div className="fillerbg">
                      <div
                        className="fillerRight"
                        style={{ width: width2 + '%', display: 'flow-root' }}
                      >
                        <span
                          style={{ float: floatRight }}
                          className="rating_level_number"
                        >
                          {profile2Expertise
                            ? profile2Expertise.rating_level
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
                        <span className="icon icon-common icon-angle-right icon-custom" />
                      </div>
                    }
                    triggerWhenOpen={
                      <div className="open-close-title">
                        <span className="icon icon-common icon-angle-down icon-custom" />
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
                            <div className="column medium-6">
                              <strong> {attribute_type} </strong>
                            </div>
                            <div className="column medium-3" />
                            <div className="column medium-3" />
                          </div>
                          {competency.attributes
                            .filter(
                              attribute => attribute.type == attribute_type
                            )
                            .map(attribute => {
                              return (
                                <div className="row attribute_align">
                                  <div className="column medium-6">
                                    {attribute.title}
                                  </div>
                                  <div className="column medium-3">
                                    {getAttributeStatus(
                                      attribute.id,
                                      'profile1'
                                    ) ? (
                                      <i className="icon icon-common icon-check" />
                                    ) : (
                                      '-'
                                    )}
                                  </div>
                                  <div className="column medium-3">
                                    {getAttributeStatus(
                                      attribute.id,
                                      'profile2'
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
              </>
            );
          })
        )
      );
    }
  };
  if (profile1) {
    chart_props[0] = {
      key: profile1.id,
      label: profile1.title
    };
  }

  if (profile2) {
    chart_props[1] = {
      key: profile2.id,
      label: profile2.title
    };
  }

  const handlePrint = e => {
    e.preventDefault();
    window.print();
  };

  return (
    <div id="">
      {generateProfileView()}
      <p>&nbsp; </p>
      <div className="row">
        <div className="column medium-6">
          <h5>
            {frameworkFullName} {frameworkVersion} / Competencies
          </h5>
        </div>
        <div className="column medium-3">
          <h5>{profile1.job_title}</h5>
        </div>
        <div className="column medium-3">
          <h5>{profile2.job_title}</h5>
        </div>
      </div>

      <hr />
      <div className="row">
        <div className="column medium-6">&nbsp;</div>
        <div className="column medium-3">
          <span>High</span> <span style={{ float: 'right' }}> Low</span>
        </div>
        <div className="column medium-3">
          <span>Low</span> <span style={{ float: 'right' }}> High</span>
        </div>
      </div>

      <div>{competencyView}</div>
      <div className="row">
        <div className="column medium-4">&nbsp;</div>
        <div className="column medium-4" style={{ textAling: 'center' }}>
          <a href="#" className="button" onClick={e => handlePrint(e)}>
            Print <i className="icon icon-common icon-print" />
          </a>
        </div>
        <div className="column medium-4" />
      </div>
    </div>
  );
};

export default ProfilesCompareButterfly;
