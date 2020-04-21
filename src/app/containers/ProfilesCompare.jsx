import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';

import { apiUrl } from '../services/http/http';

import { Link, Redirect } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import ProfilesCompareTable from './ProfilesCompareTable';
import ProfilesCompareGraph from './ProfilesCompareGraph';
import user_icon from './user_icon.png';

const $ = window.$;

export const ProfilesCompare = props => {
  const frameworkName = props.location.pathname.split('/')[2];
  const frameworkVersion = props.location.pathname.split('/')[3];
  const profile1Id = props.location.pathname.split('/')[6];
  const profile2Id = props.location.pathname.split('/')[7];
  var expertise_levels = [];
  var expertise_levels_legend = [];

  const [profile1, setProfile1] = useState();
  const [profile2, setProfile2] = useState();
  const [framework, setFramework] = useState();
  const [frameworkInfo, setFrameworkInfo] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetch(
          `${apiUrl}/api/profiles?_format=json&id=${profile1Id}&timestamp=${Date.now()}`
        )
          .then(Response => Response.json())
          .then(findresponse => {
            setProfile1(findresponse);
          });

        await fetch(
          `${apiUrl}/api/profiles?_format=json&id=${profile2Id}&timestamp=${Date.now()}`
        )
          .then(Response => Response.json())
          .then(findresponse => {
            setProfile2(findresponse);
          });

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
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  if (frameworkInfo) {
    frameworkInfo.map(info => {
      if (info.title.toLowerCase() === frameworkName) {
        info.expertise_levels.map(
          level => (expertise_levels[level.id] = level.title)
        );
      }
    });
  }

  let index = 0;
  expertise_levels.map((level, key) => {
    expertise_levels_legend.push(
      <li>
        {index} - {level}
      </li>
    );
    index++;
  });

  const clickGraphTab = () => {
    setTimeout(formatRadarChart, 2000);
  };

  // I hate this anti-pattern

  const formatRadarChart = () => {
    $('svg').css('width', '50%');
    $('svg')
      .parent()
      .css('text-align', 'center');
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

    $('text').each(function(key, value) {
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

  return (
    <div>
      <h4>Compare reference profiles</h4>
      <div className="profileMeta">
        {profile1 ? (
          <div>
            <img
              src={profile1.image[0] ? profile1.image[0].url : user_icon}
              width="120px"
            />
            <h5>{profile1.title}</h5>
            {profile1.job_title}
          </div>
        ) : (
          'loading profiles'
        )}
        <div>Vs</div>
        {profile2 ? (
          <div>
            <img
              src={profile2.image[0] ? profile2.image[0].url : user_icon}
              width="120px"
            />
            <h5>{profile2.title}</h5>
            {profile2.job_title}
          </div>
        ) : (
          ''
        )}
      </div>
      <div>
        <ul className="legend-inline">{expertise_levels_legend}</ul>
      </div>
      <Tabs>
        <TabList>
          <Tab>Tabular comparison</Tab>
          <Tab onClick={e => clickGraphTab(e)}>Graphical comparison</Tab>
        </TabList>

        <TabPanel>
          <ProfilesCompareTable
            frameworkName={frameworkName}
            frameworkVersion={frameworkVersion}
            profile1Id={profile1Id}
            profile2Id={profile2Id}
            profile1={profile1}
            profile2={profile2}
            framework={framework}
            frameworkInfo={frameworkInfo}
          />
        </TabPanel>
        <TabPanel>
          <ProfilesCompareGraph
            frameworkName={frameworkName}
            frameworkVersion={frameworkVersion}
            profile1Id={profile1Id}
            profile2Id={profile2Id}
            profile1={profile1}
            profile2={profile2}
            framework={framework}
            frameworkInfo={frameworkInfo}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export const sendRoute = () => (
  <Switch>
    <Route
      exact
      path="/framework/:framework/:version/profiles/compare/:profile1/:profile2"
      component={ProfilesCompare}
    />
  </Switch>
);

export default sendRoute;
