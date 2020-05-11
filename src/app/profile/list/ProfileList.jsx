import React, { useState, useEffect } from 'react';

import { useHistory, useRouteMatch } from 'react-router-dom';
import { Link } from 'react-router-dom';

import ProfileService from '../../services/profile/profile';
import ActiveRequestsService from '../../services/active-requests/active-requests';

import './ProfileList.css';
import user_icon from '../../../assets/user_icon.png';

const profileService = new ProfileService();
const activeRequests = new ActiveRequestsService();

const ProfileList = props => {
  const history = useHistory();
  const match = useRouteMatch();

  const { framework, version } = props;

  const [profiles, setProfiles] = useState();

  var profilesToCompare = [];

  useEffect(() => {
    const fetchData = async () => {
      const profiles = await profileService.getProfiles(framework, version);
      setProfiles(profiles);
    };

    try {
      activeRequests.startRequest();
      fetchData();
    } finally {
      activeRequests.finishRequest();
    }
  }, [framework, version]);

  const checkUserAccess = () => {
    if (localStorage.getItem('roles')) {
      return true;
    } else {
      return false;
    }
  };

  const setProfilesToCompare = e => {
    if (profilesToCompare.length > 2) {
      alert('You have to select two profiles to compare.');
      return;
    }

    if (e.target.checked) {
      profilesToCompare.push(e.target.getAttribute('data-profileid'));
    } else {
      profilesToCompare = profilesToCompare.filter(function(value, index, arr) {
        return value != e.target.getAttribute('data-profileid');
      });
    }
  };

  const redirectToCompare = e => {
    e.preventDefault();
    if (profilesToCompare.length != 2) {
      alert('You have to select two profiles to compare.');
      return;
    } else {
      history.push(
        `${match.url}/profile/compare/${profilesToCompare[0]}/${
          profilesToCompare[1]
        }`
      );
    }
  };

  return (
    <div>
      <div className="introduction">
        <div className="row">
          <div className="column medium-6 item">
            <h5>
              <i className="icon icon-common icon-search-document" /> Discover
              and explore{' '}
            </h5>
            <p>
              You can explore career profiles for professionals in Biomoecular
              Modelling and Simulation
            </p>
          </div>
          <div className="column medium-6 item">
            <h5>
              <i className="icon icon-common icon-user-plus" /> Create your own
              profile
            </h5>
            <p>
              You can create your personal profile and choose your competencies{' '}
            </p>
          </div>
        </div>
        <div className="row">
          <div className="column medium-6 item">
            <h5>
              <i className="icon icon-common icon-compare" /> Compare profiles
            </h5>
            <p>
              Compere your profile with other reference profiles to help you
              make career choices based on your competency
            </p>
          </div>
          <div className="column medium-6 item">
            <h5>
              <i className="icon icon-common icon-tutorial" /> Identify training
              oportunities
            </h5>
            <p>
              Training oportunities will help boost a career in Biomoecular
              Modelling and Simulation
            </p>
          </div>
        </div>
      </div>
      <div className="wrapper">
        <div className="row">
          <div className="column medium-6">
            <h5 className="warpperLabel">Career profiles</h5>
          </div>
          <div className="column medium-6">
            <span style={{ float: 'right' }}>
              {localStorage.getItem('roles') ? (
                <span>
                  <Link
                    className="button secondary small action-buttons"
                    to={`${match.url}/profile/create/`}
                  >
                    {' '}
                    Create reference profile{' '}
                    <i className="icon icon-common icon-user-plus" />
                  </Link>
                  <Link
                    onClick={e => redirectToCompare(e)}
                    className="button secondary small action-buttons"
                    to={`${match.url}/profile/compare/${profilesToCompare[0]}/${
                      profilesToCompare[1]
                    }`}
                  >
                    {' '}
                    Compare selected profiles{' '}
                    <i className="icon icon-common icon-compare" />
                  </Link>
                </span>
              ) : (
                <span>
                  <Link
                    onClick={e => redirectToCompare(e)}
                    className="button secondary small action-buttons"
                    to={`${match.url}/profile/compare/${profilesToCompare[0]}/${
                      profilesToCompare[1]
                    }`}
                  >
                    {' '}
                    Compare selected profiles{' '}
                    <i className="icon icon-common icon-compare" />
                  </Link>
                </span>
              )}
            </span>
          </div>
          <hr />
        </div>
        <div className="row">
          <div className="column medium-4">
            <div className="profile_badge">
              <span className="compare_checkbox">
                <label>
                  <input
                    type="checkbox"
                    disabled="disabled"
                    onClick={e => setProfilesToCompare(e)}
                    data-profileid="guest"
                  />
                  Click to compare
                </label>
              </span>
              <p>
                <div>
                  <img src={user_icon} className="profile_img" />
                </div>
              </p>
              <div className="row action-buttons-row secondary-background white-color">
                <div className="column medium-12">
                  <h4>Your profile</h4>
                  <Link
                    className="readmore"
                    to={`${match.url}/profile/create/guest`}
                  >
                    <i className="icon icon-common icon-user-plus" /> Create
                    your profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {profiles
            ? profiles.map(profile => {
                if (!checkUserAccess()) {
                  if (profile.publishing_status == 'Live') {
                    return (
                      <div className="column medium-4">
                        <div className="profile_badge">
                          <span className="compare_checkbox">
                            <label>
                              <input
                                type="checkbox"
                                onClick={e => setProfilesToCompare(e)}
                                data-profileid={profile.id}
                              />
                              Click to compare
                            </label>
                          </span>
                          <p>
                            {profile.image[0] ? (
                              <div className={profile.publishing_status}>
                                <img
                                  src={profile.image[0].url}
                                  className="profile_img"
                                />
                              </div>
                            ) : (
                              <img src={user_icon} className="profile_img" />
                            )}
                          </p>

                          <div className="row action-buttons-row secondary-background white-color">
                            <div className="column medium-12">
                              <h4>
                                {profile.job_title
                                  ? profile.job_title
                                  : 'Job title'}
                              </h4>
                              <Link
                                className="readmore"
                                to={`${match.url}/profile/view/${profile.id}${
                                  profile.url_alias
                                }`}
                              >
                                View profile{' '}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                } else {
                  return (
                    <div className="column medium-4">
                      <div className="profile_badge">
                        <span className="compare_checkbox">
                          <label>
                            <input
                              type="checkbox"
                              onClick={e => setProfilesToCompare(e)}
                              data-profileid={profile.id}
                            />
                            Click to compare
                          </label>
                        </span>
                        <p className={profile.publishing_status}>
                          {profile.image[0] ? (
                            <img
                              src={profile.image[0].url}
                              className="profile_img"
                            />
                          ) : (
                            <img src={user_icon} className="profile_img" />
                          )}
                        </p>

                        <div className="row action-buttons-row secondary-background white-color">
                          <div className="column medium-12">
                            <h4>
                              {profile.job_title
                                ? profile.job_title
                                : 'Job title'}
                            </h4>
                            <Link
                              className="readmore"
                              to={`${match.url}/profile/view/${profile.id}${
                                profile.url_alias
                              }`}
                            >
                              View profile{' '}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              })
            : ''}

          <div className="column medium-4">&nbsp;</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileList;
