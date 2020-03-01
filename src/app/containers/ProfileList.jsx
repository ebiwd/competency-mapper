import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import Parser from 'html-react-parser';
import { Link } from 'react-router-dom';

import { apiUrl } from '../services/http/http';
import './Profile.css';
import user_icon from './user_icon.png';

const ProfileList = props => {
  const [profiles, setProfiles] = useState();
  const [framework, setFramework] = useState();
  const [userRole, setUserRole] = useState();

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

  return (
    <div>
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
                              to={`/framework/bioexel/2.0/profile/view/${
                                profile.nid[0].value
                              }${profile.path[0].alias}`}
                            >
                              View profile{' '}
                            </Link>
                          </div>
                          <div className="column medium-6">
                            <Link className="readmore" to={`#`}>
                              Compare profile{' '}
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
                      <p>
                        [{profile.field_publishing_status[0].value}]
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
                            to={`/framework/bioexel/2.0/profile/view/${
                              profile.nid[0].value
                            }${profile.path[0].alias}`}
                          >
                            View profile{' '}
                          </Link>
                        </div>
                        <div className="column medium-6">
                          <Link className="readmore" to={`#`}>
                            Compare profile{' '}
                          </Link>
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
