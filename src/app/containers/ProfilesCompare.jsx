import React, { useState, useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';

import { apiUrl } from '../services/http/http';

import { Link } from 'react-router-dom';
import 'react-tabs/style/react-tabs.css';
import ProfilesCompareButterfly from './ProfilesCompareButterfly';
import user_icon from './user_icon.png';
import ReactTooltip from 'react-tooltip';
import { ProfileComparisonModal } from '../../shared/components/ProfileComparisonModal';

export const ProfilesCompare = props => {
  let history = useHistory();
  const frameworkName = props.location.pathname.split('/')[2];
  const frameworkVersion = props.location.pathname.split('/')[3];
  const profile1Id = props.location.pathname.split('/')[6];
  const profile2Id = props.location.pathname.split('/')[7];
  //var expertise_levels = [];
  var expertise_levels_legend = [];

  const [profile1, setProfile1] = useState();
  const [profile2, setProfile2] = useState();
  const [profiles, setProfiles] = useState();
  const [selectedProfileId, setSelectedProfileId] = useState();
  const [comparisonError, setComparisonError] = useState(null);
  const [framework, setFramework] = useState();
  const [isGuestProfile, setIsGuestProfile] = useState();
  const [frameworkInfo, setFrameworkInfo] = useState();
  const [link1, setLink1] = useState();
  const [link2, setLink2] = useState();

  const redirectToCompare = e => {
    if (selectedProfileId) {
      history.push(
        `/framework/${frameworkName}/${frameworkVersion}/profiles/compare/${
          profile1.id
        }/${selectedProfileId}`
      );
    } else {
      setComparisonError('Select a role to compare');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (profile1Id === 'guest') {
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
            `${apiUrl}/api/${frameworkName}/${frameworkVersion}/profiles?_format=json&id=${profile1Id}&source=competencyhub`
          )
            .then(Response => Response.json())
            .then(findresponse => {
              setProfile1(findresponse);
            });
        }

        if (profile2Id === 'guest') {
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
            `${apiUrl}/api/${frameworkName}/${frameworkVersion}/profiles?_format=json&id=${profile2Id}&source=competencyhub`
          )
            .then(Response => Response.json())
            .then(findresponse => {
              setProfile2(findresponse);
            });
        }

        await fetch(
          `${apiUrl}/api/${frameworkName}/${frameworkVersion}/profiles/?_format=json&source=competencyhub`
        )
          .then(Response => Response.json())
          .then(findresponse => {
            const profilesExcludingCurrentProfile = findresponse.filter(
              p =>
                p.id !== props.match.params.profile1 &&
                p.publishing_status === 'Live'
            );
            setProfiles(profilesExcludingCurrentProfile);
          });

        await fetch(
          `${apiUrl}/api/version_manager?_format=json&source=competencyhub`
        )
          .then(Response => Response.json())
          .then(findresponse => {
            setFrameworkInfo(findresponse);
          });

        await fetch(
          `${apiUrl}/api/${frameworkName}/${frameworkVersion}?_format=json&source=competencyhub`
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
  }, [frameworkName, frameworkVersion, profile1Id, profile2Id]);

  if (frameworkInfo) {
    frameworkInfo.forEach((info, index) => {
      if (info.title.toLowerCase() === frameworkName) {
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
              <ReactTooltip className="tooltip-custom" />
            </li>
          )
        );
      }
    });
  }

  return (
    <div>
      <h1>Compare career profiles</h1>
      <span className="lead">
        Compare profile with other reference profiles to help you make career
        choices based on your competency
      </span>

      <div className="vf-grid">
        <div />
        <div>
          <div className="vf-u-margin__bottom--1200" />
          {profile1 ? (
            <div className="vf-profile">
              <img
                alt="profile1"
                src={profile1.image[0] ? profile1.image[0].url : user_icon}
                width="120px"
                className="vf-profile__image"
              />
              <Link to={link1 ? link1 : '#'}>
                <h2>{profile1.job_title}</h2>
              </Link>
            </div>
          ) : (
            'loading profiles'
          )}
        </div>

        <div>
          <div className="vf-u-margin__bottom--1200" />
          {profile2 ? (
            <div className="vf-profile">
              <img
                alt="profile2"
                src={profile2.image[0] ? profile2.image[0].url : user_icon}
                width="120px"
                className="vf-profile__image"
              />
              <Link to={link2}>
                <h2>{profile2.job_title}</h2>
              </Link>

              {/*<a*/}
              {/*  href="JavaScript:Void(0);"*/}
              {/*  className="vf-button vf-button--link"*/}
              {/*>*/}
              {/*  Compare another profile*/}
              {/*</a>*/}
              <ProfileComparisonModal
                profiles={profiles}
                profile={profile1}
                comparisonError={comparisonError}
                linkVariant={true}
                setSelectedProfileId={id => {
                  setSelectedProfileId(id);
                }}
                redirectToCompare={() => {
                  redirectToCompare();
                }}
              />
            </div>
          ) : (
            'loading profiles'
          )}
        </div>
        <div />
      </div>

      <div>
        <div className="vf-u-margin__bottom--600" />
        <div className="legend-inline-wrapper">
          <strong>Rating levels </strong>{' '}
          <ul className="vf-list legend-inline">{expertise_levels_legend}</ul>
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
