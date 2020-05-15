import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';

import { apiUrl } from '../../../services/http/http';

import { Link, useParams } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import ProfilesCompareButterfly from './ProfilesCompareButterfly';
import user_icon from '../../../../assets/user_icon.png';

const $ = window.$;

export const ProfilesCompare = (props) => {
  const {
    framework: frameworkName,
    version: frameworkVersion,
    profile1Id,
    profile2Id,
  } = useParams();
  var expertise_levels = [];
  var expertise_levels_legend = [];

  const [profile1, setProfile1] = useState();
  const [profile2, setProfile2] = useState();
  const [framework, setFramework] = useState();
  const [frameworkInfo, setFrameworkInfo] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: these could be easy replaced with calls from the service
        await fetch(
          `${apiUrl}/api/${frameworkName}/${frameworkVersion}/profiles?_format=json&id=${profile1Id}&timestamp=${Date.now()}`
        )
          .then((Response) => Response.json())
          .then((findresponse) => {
            setProfile1(findresponse);
          });

        await fetch(
          `${apiUrl}/api/${frameworkName}/${frameworkVersion}/profiles?_format=json&id=${profile2Id}&timestamp=${Date.now()}`
        )
          .then((Response) => Response.json())
          .then((findresponse) => {
            setProfile2(findresponse);
          });

        await fetch(`${apiUrl}/api/version_manager?_format=json`)
          .then((Response) => Response.json())
          .then((findresponse) => {
            setFrameworkInfo(findresponse);
          });

        await fetch(
          `${apiUrl}/api/${frameworkName}/${frameworkVersion}?_format=json`
        )
          .then((Response) => Response.json())
          .then((findresponse) => {
            setFramework(findresponse);
          });
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  if (frameworkInfo) {
    frameworkInfo.map((info) => {
      if (info.title.toLowerCase() === frameworkName) {
        info.expertise_levels.map(
          (level) => (expertise_levels[level.rating_level] = level.title)
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

  const clickGraphTab = () => {
    setTimeout(formatRadarChart, 2000);
  };

  const clickButterflyTab = () => {
    setTimeout(formatButterfly, 100);
  };

  // I hate this anti-pattern

  const formatRadarChart = () => {
    $('svg').css('width', '50%');
    $('svg').parent().css('text-align', 'center');
    $('svg > g > g > g:first-child > text')
      .eq(0)
      .text('Specialist Knowledge')
      .css('font-weight', 'bold');
    $('svg > g > g > g:first-child > text')
      .eq(1)
      .text('Working Knowledge')
      .css('font-weight', 'bold');
    $('svg > g > g > g:first-child > text')
      .eq(2)
      .text('Awareness')
      .css('font-weight', 'bold');

    $('text').each(function (key, value) {
      var x = $(this).attr('x');
      var sign = Math.sign(x);
      var dx = sign ? (sign == 1 ? '100' : '-100') : '0';
      var y = $(this).attr('y');
      var item = $(this).text();
      var choppedItem1 = '';
      var choppedItem2 = '';

      if (item.length > 60) {
        choppedItem1 = item.substring(0, 60);
        choppedItem2 = item.substring(60, 120);
        $(this).html(
          '<tspan x=' +
            x +
            ' y=' +
            y +
            ' dx=' +
            dx +
            ' >' +
            choppedItem1 +
            '</tspan>' +
            '<tspan x=' +
            x +
            ' y=' +
            y +
            ' dy="15" dx=' +
            dx +
            ' >' +
            choppedItem2 +
            '... </tspan>'
        );
      } else {
        $(this).html(
          '<tspan x=' +
            x +
            ' y=' +
            y +
            ' dx=' +
            dx +
            ' dy="15" >' +
            item +
            '</tspan>'
        );
      }
    });
  };

  const formatButterfly = () => {
    $('.ButterflyChart-right > .ChartRow > .ChartRow-barLabel').remove();
    $('.ButterflyChart-right > .ChartRow > .u-dottedLine').remove();
    $('.ButterflyChart').css('width', '100%');
  };

  return (
    <div>
      <h3>Compare career profiles</h3>
      <span className="lead">
        Compere profile with other reference profiles to help you make career
        choices based on your competency
      </span>

      <div className="row">
        <div className="column medium-3">&nbsp;</div>
        <div className="column medium-3">
          {profile1 ? (
            <div className="profile_badge_page">
              <img
                src={profile1.image[0] ? profile1.image[0].url : user_icon}
                width="120px"
              />
              <Link
                to={`/framework/bioexcel/2.0/profile/view/${profile1.id}/alias`}
              >
                <h5>{profile1.job_title}</h5>
              </Link>
            </div>
          ) : (
            'loading profiles'
          )}
        </div>

        <div className="column medium-3">
          {profile2 ? (
            <div className="profile_badge_page">
              <img
                src={profile2.image[0] ? profile2.image[0].url : user_icon}
                width="120px"
              />
              <Link
                to={`/framework/bioexcel/2.0/profile/view/${profile2.id}/alias`}
              >
                <h5>{profile2.job_title}</h5>
              </Link>
            </div>
          ) : (
            'loading profiles'
          )}
        </div>
        <div className="column medium-3" />
      </div>

      <div className="row">
        <div className="column medium-12">
          <div className="legend-inline-wrapper">
            <strong>Rating levels </strong>{' '}
            <ul className="legend-inline">{expertise_levels_legend}</ul>
          </div>
        </div>
      </div>
      <p />

      {profile1 && profile2 ? (
        <ProfilesCompareButterfly
          frameworkName={frameworkName}
          frameworkVersion={frameworkVersion}
          profile1Id={profile1Id}
          profile2Id={profile2Id}
          profile1={profile1}
          profile2={profile2}
          framework={framework}
          frameworkInfo={frameworkInfo}
        />
      ) : (
        ''
      )}
    </div>
  );
};

export default ProfilesCompare;
