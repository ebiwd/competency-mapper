import React, { useState, useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import Parser from 'html-react-parser';
import { Link, Redirect } from 'react-router-dom';

import { apiUrl } from '../services/http/http';
import './Profile.css';
import user_icon from './user_icon.png';

const ProfileList = props => {
  let history = useHistory();
  const [profiles, setProfiles] = useState();
  const [framework, setFramework] = useState();
  const [userRole, setUserRole] = useState();

  var profilesToCompare = [];

  useEffect(() => {
    const fetchData = async () => {
      await fetch(`${apiUrl}/api/list_profiles/?_format=json`)
        .then(Response => Response.json())
        .then(findresponse => {
          setProfiles(findresponse);
        });
    };
    fetchData();
  }, [framework]);

  const checkUserAccess = () => {
    if (localStorage.getItem('roles')) {
      //console.log('roles '+localStorage.getItem('roles'))
      return true;
    } else {
      //console.log('roles '+localStorage.getItem('roles'))
      return false;
    }
    //console.log('access called')
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
        `/framework/bioexcel/2.0/profiles/compare/${profilesToCompare[0]}/${
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
              <i class="icon icon-common icon-search-document" /> Discover and
              explore{' '}
            </h5>
            <p>
              You can explore career profiles for professionals in Biomoecular
              Modelling and Simulation
            </p>
          </div>
          <div className="column medium-6 item">
            <h5>
              <i class="icon icon-common icon-user-plus" /> Create your own
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
              <i class="icon icon-common icon-compare" /> Compare profiles
            </h5>
            <p>
              Compere your profile with other reference profiles to help you
              make career choices based on your competency
            </p>
          </div>
          <div className="column medium-6 item">
            <h5>
              <i class="icon icon-common icon-tutorial" /> Identify training
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
                    to={`/framework/bioexcel/2.0/profile/create/`}
                  >
                    {' '}
                    Create reference profile{' '}
                    <i className="icon icon-common icon-user-plus" />
                  </Link>
                  <Link
                    onClick={e => redirectToCompare(e)}
                    className="button secondary small action-buttons"
                    to={`/framework/bioexcel/2.0/profiles/compare/${
                      profilesToCompare[0]
                    }/${profilesToCompare[1]}`}
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
                    to={`/framework/bioexcel/2.0/profiles/compare/${
                      profilesToCompare[0]
                    }/${profilesToCompare[1]}`}
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
            <div class="profile_badge">
              <span class="compare_checkbox">
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
                  <img src={user_icon} class="profile_img" />
                </div>
              </p>
              <div class="row action-buttons-row secondary-background white-color">
                <div class="column medium-12">
                  <h4>Your profile</h4>
                  <Link
                    className="readmore"
                    to={`/framework/bioexcel/2.0/profile/create`}
                  >
                    <i class="icon icon-common icon-user-plus" /> Create your
                    profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {profiles
            ? profiles.map(profile => {
                if (!checkUserAccess()) {
                  if (profile.field_publishing_status[0].value == 'Live') {
                    return (
                      <div className="column medium-4">
                        <div className="profile_badge">
                          <span class="compare_checkbox">
                            <label>
                              <input
                                type="checkbox"
                                onClick={e => setProfilesToCompare(e)}
                                data-profileid={profile.nid[0].value}
                              />
                              Click to compare
                            </label>
                          </span>
                          <p>
                            {profile.field_image[0] ? (
                              <div
                                className={
                                  profile.field_publishing_status[0].value
                                }
                              >
                                <img
                                  src={profile.field_image[0].url}
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
                                {profile.field_job_title[0]
                                  ? profile.field_job_title[0].value
                                  : 'Job title'}
                              </h4>
                              <Link
                                className="readmore"
                                to={`/framework/bioexcel/2.0/profile/view/${
                                  profile.nid[0].value
                                }${profile.path[0].alias}`}
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
                        <span class="compare_checkbox">
                          <label>
                            <input
                              type="checkbox"
                              onClick={e => setProfilesToCompare(e)}
                              data-profileid={profile.nid[0].value}
                            />
                            Click to compare
                          </label>
                        </span>
                        <p>
                          {profile.field_image[0] ? (
                            <div
                              className={
                                profile.field_publishing_status[0].value
                              }
                            >
                              <img
                                src={profile.field_image[0].url}
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
                              {profile.field_job_title[0]
                                ? profile.field_job_title[0].value
                                : 'Job title'}
                            </h4>
                            <Link
                              className="readmore"
                              to={`/framework/bioexcel/2.0/profile/view/${
                                profile.nid[0].value
                              }${profile.path[0].alias}`}
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
