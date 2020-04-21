import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import Parser from 'html-react-parser';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import FileUpload from './FileUpload';
import { apiUrl } from '../services/http/http';
import ProfileService from '../services/profile/profile';
import ActiveRequestsService from '../services/active-requests/active-requests';
import { Link, Redirect } from 'react-router-dom';
import Collapsible from 'react-collapsible';
import ReactTooltip from 'react-tooltip';

const ProfilesCompareTable = props => {
  const frameworkName = props.frameworkName;
  const frameworkVersion = props.frameworkVersion;
  const profile1Id = props.profile1Id;
  const profile2Id = props.profile2Id;

  // const [profile1, setProfile1] = useState();
  // const [profile2, setProfile2] = useState();
  // const [framework, setFramework] = useState();
  // const [frameworkInfo, setFrameworkInfo] = useState();
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

  // useEffect(() => {
  // const fetchData = async () => {
  //   await fetch(
  //     `${apiUrl}/api/profiles?_format=json&id=${profile1Id}&timestamp=${Date.now()}`
  //   )
  //     .then(Response => Response.json())
  //     .then(findresponse => {
  //       setProfile1(findresponse);
  //     });

  //   await fetch(
  //     `${apiUrl}/api/profiles?_format=json&id=${profile2Id}&timestamp=${Date.now()}`
  //   )
  //     .then(Response => Response.json())
  //     .then(findresponse => {
  //       setProfile2(findresponse);
  //     });

  //   await fetch(`${apiUrl}/api/version_manager?_format=json`)
  //     .then(Response => Response.json())
  //     .then(findresponse => {
  //       setFrameworkInfo(findresponse);
  //     });

  //   await fetch(
  //     `${apiUrl}/api/${frameworkName}/${frameworkVersion}?_format=json`
  //   )
  //     .then(Response => Response.json())
  //     .then(findresponse => {
  //       setFramework(findresponse);
  //     });
  // };
  //   fetchData();
  // }, []);

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
        return expertise.title;
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
                        {getExpertise(competency.id, 'profile1')
                          ? getExpertise(competency.id, 'profile1')
                          : 'Not applicable'}
                      </div>
                      <div className="column medium-2">
                        {getExpertise(competency.id, 'profile1')
                          ? getExpertise(competency.id, 'profile2')
                          : 'Not applicable'}
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
