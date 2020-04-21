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
      <div className="row">
        <div className="column medium-12">
          <span style={{ float: 'right' }}>
            {localStorage.getItem('roles') ? (
              <span>
                <Link
                  to={`/framework/bioexcel/2.0/profile/create`}
                  className="button secondary small action-buttons"
                >
                  {' '}
                  Create reference profile{' '}
                  <i className="icon icon-common icon-plus" />
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
                  to={`/framework/bioexcel/2.0/profile/create`}
                  className="button secondary small action-buttons"
                >
                  {' '}
                  Create your profile{' '}
                  <i className="icon icon-common icon-plus" />
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
            )}
          </span>
        </div>
      </div>
      <div className="row">
        {profiles
          ? profiles.map(profile => {
              if (!checkUserAccess()) {
                if (profile.field_publishing_status[0].value == 'Live') {
                  return (
                    <div className="column medium-4">
                      <div className="profile_badge">
                        <p>
                          {profile.field_image[0] ? (
                            <img
                              src={profile.field_image[0].url}
                              className="profile_img"
                            />
                          ) : (
                            <img src={user_icon} className="profile_img" />
                          )}
                        </p>

                        <p>
                          {profile.field_job_title[0]
                            ? profile.field_job_title[0].value
                            : 'Job title'}
                        </p>

                        <div className="row">
                          <div className="column medium-6">
                            <Link
                              className="readmore"
                              to={`/framework/bioexcel/2.0/profile/view/${
                                profile.nid[0].value
                              }${profile.path[0].alias}`}
                            >
                              View profile{' '}
                            </Link>
                          </div>
                          <div className="column medium-6">
                            <span className="compare_checkbox">
                              <label>
                                <input
                                  type="checkbox"
                                  onClick={e => setProfilesToCompare(e)}
                                  data-profileid={profile.nid[0].value}
                                />
                                Compare profile{' '}
                              </label>
                            </span>
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
                      <p>
                        {profile.field_image[0] ? (
                          <div
                            className={profile.field_publishing_status[0].value}
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

                      <p>
                        {profile.field_job_title[0]
                          ? profile.field_job_title[0].value
                          : 'Job title'}
                      </p>

                      <div className="row">
                        <div className="column medium-6">
                          <Link
                            className="readmore"
                            to={`/framework/bioexcel/2.0/profile/view/${
                              profile.nid[0].value
                            }${profile.path[0].alias}`}
                          >
                            View profile{' '}
                          </Link>
                        </div>
                        <div className="column medium-6">
                          <input
                            type="checkbox"
                            onClick={e => setProfilesToCompare(e)}
                            data-profileid={profile.nid[0].value}
                          />
                          Compare profile{' '}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })
          : ''}
      </div>
    </div>
  );
};

export default ProfileList;
