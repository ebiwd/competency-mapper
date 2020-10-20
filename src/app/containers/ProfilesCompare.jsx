import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';

import { apiUrl } from '../services/http/http';

import { Link, Redirect } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
//import ProfilesCompareTable from './ProfilesCompareTable';
//import ProfilesCompareGraph from './ProfilesCompareGraph';
import ProfilesCompareButterfly from './ProfilesCompareButterfly';
import user_icon from './user_icon.png';
import Stars from './Stars';
import ReactTooltip from 'react-tooltip';

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
  const [isGuestProfile, setIsGuestProfile] = useState();
  const [frameworkInfo, setFrameworkInfo] = useState();
  const [link1, setLink1] = useState();
  const [link2, setLink2] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (profile1Id == 'guest') {
          await setProfile1(JSON.parse(localStorage.getItem('guestProfile')));
          setIsGuestProfile(1);
          setLink1(
            `/framework/${frameworkName}/${frameworkVersion}/profile/view/guest`
          );
        } else {
          setLink1(
            `/framework/${frameworkName}/${frameworkVersion}/profile/view/${profile1Id}/alias`
          );
          await fetch(
            `${apiUrl}/api/${frameworkName}/${frameworkVersion}/profiles?_format=json&id=${profile1Id}&timestamp=${Date.now()}`
          )
            .then(Response => Response.json())
            .then(findresponse => {
              setProfile1(findresponse);
            });
        }

        if (profile2Id == 'guest') {
          await setProfile2(JSON.parse(localStorage.getItem('guestProfile')));
          setIsGuestProfile(1);
          setLink2(
            `/framework/${frameworkName}/${frameworkVersion}/profile/view/guest`
          );
        } else {
          setLink2(
            `/framework/${frameworkName}/${frameworkVersion}/profile/view/${profile2Id}/alias`
          );
          await fetch(
            `${apiUrl}/api/${frameworkName}/${frameworkVersion}/profiles?_format=json&id=${profile2Id}&timestamp=${Date.now()}`
          )
            .then(Response => Response.json())
            .then(findresponse => {
              setProfile2(findresponse);
            });
        }

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
        info.expertise_levels.map(level =>
          expertise_levels_legend.push(
            <li style={{ textAlign: 'center' }}>
              <div
                data-tip={level.description ? level.description : 'NA'}
                data-html={true}
                data-type="info"
                data-multiline={true}
              >
                <span className="badge secondary"> {level.rating_level} </span>{' '}
                <span> {level.title}</span>
              </div>
              <ReactTooltip class="tooltip-custom" />
            </li>
          )
        );
      }
    });
  }

  return (
    <div>
      <h3>Compare career profiles</h3>
      <span className="lead">
        Compere profile with other reference profiles to help you make career
        choices based on your competency
        {console.log(isGuestProfile)}
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
              <Link to={link1}>
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
              <Link to={link2}>
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
          isGuestProfile={isGuestProfile}
        />
      ) : (
        ''
      )}
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
