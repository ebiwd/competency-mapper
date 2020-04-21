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
import ReactTooltip from 'react-tooltip';
import RadarChart from 'react-svg-radar-chart';
import 'react-svg-radar-chart/build/css/index.css';

import Radar from 'react-d3-radar';

export const ProfilesCompareGraph = props => {
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
  var competencies_array = [];
  var expertise_array = [];
  var profile1_expertise_obj = new Object();
  var profile2_expertise_obj = new Object();
  var fake_string = [];

  // useEffect(() => {
  //   const fetchData = async () => {
  //     await fetch(
  //       `${apiUrl}/api/profiles?_format=json&id=${profile1Id}&timestamp=${Date.now()}`
  //     )
  //       .then(Response => Response.json())
  //       .then(findresponse => {
  //         setProfile1(findresponse);
  //       });

  //     await fetch(
  //       `${apiUrl}/api/profiles?_format=json&id=${profile2Id}&timestamp=${Date.now()}`
  //     )
  //       .then(Response => Response.json())
  //       .then(findresponse => {
  //         setProfile2(findresponse);
  //       });

  //     await fetch(`${apiUrl}/api/version_manager?_format=json`)
  //       .then(Response => Response.json())
  //       .then(findresponse => {
  //         setFrameworkInfo(findresponse);
  //       });

  //     await fetch(
  //       `${apiUrl}/api/${frameworkName}/${frameworkVersion}?_format=json`
  //     )
  //       .then(Response => Response.json())
  //       .then(findresponse => {
  //         setFramework(findresponse);
  //       });
  //   };
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
        return expertise.id;
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
        item.domains.map((domain, did) =>
          domain.competencies.map((competency, cid) => {
            let test1 = getExpertise(competency.id, 'profile1');
            let test2 = getExpertise(competency.id, 'profile2');

            competencies_array.push({
              key: competency.id,
              label: competency.title
            });
            profile1_expertise_obj[competency.id] = test1
              ? expertise_array.indexOf(test1)
              : 0;
            profile2_expertise_obj[competency.id] = test2
              ? expertise_array.indexOf(test2)
              : 0;
          })
        )
      );
    }
  };
  if (profile1) {
    fake_string[0] = {
      key: profile1.id,
      label: profile1.title,
      values: profile1_expertise_obj
    };
  }

  if (profile2) {
    fake_string[1] = {
      key: profile2.id,
      label: profile2.title,
      values: profile2_expertise_obj
    };
  }

  const small_array = [
    { key: 5659, label: 'title1' },
    { key: 5660, label: 'title2' }
  ];

  return (
    <div id="svgParent">
      {generateProfileView()}

      {profile1 ? (
        <div className="profile_legend" id="profile1_legend">
          {profile1.title}
        </div>
      ) : (
        'loading profiles'
      )}

      {profile2 ? (
        <div className="profile_legend" id="profile2_legend">
          {profile2.title}
        </div>
      ) : (
        ''
      )}

      {competencies_array.length > 0 ? (
        <Radar
          width={500}
          height={500}
          padding={70}
          domainMax={3}
          highlighted={null}
          onHover={point => {
            if (point) {
              //console.log('hovered over a data point');
            } else {
              //console.log('not over anything');
            }
          }}
          data={{
            variables: competencies_array,
            sets: fake_string
          }}
        />
      ) : (
        ''
      )}
    </div>
  );
};

export default ProfilesCompareGraph;
