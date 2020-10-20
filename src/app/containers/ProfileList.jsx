import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Link } from 'react-router-dom';

import { apiUrl } from '../services/http/http';
import './Profile.css';
import user_icon from './user_icon.png';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const ProfileList = props => {
  let history = useHistory();

  const frameworkName = props.framework;
  const frameworkVersion = props.version;
  const [guestProfile, setGuestProfile] = useState();
  const [profiles, setProfiles] = useState();
  const [framework, setFramework] = useState();
  //const [userRole, setUserRole] = useState();

  var profilesToCompare = [];

  useEffect(() => {
    const fetchData = async () => {
      await setGuestProfile(JSON.parse(localStorage.getItem('guestProfile')));

      await fetch(
        `${apiUrl}/api/${frameworkName}/${frameworkVersion}/profiles/?_format=json&timestamp=${Date.now()}`
      )
        .then(Response => Response.json())
        .then(findresponse => {
          setProfiles(findresponse);
        });
    };
    fetchData();
  }, [framework, frameworkVersion, frameworkName]);

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
        return value !== e.target.getAttribute('data-profileid');
      });
    }
  };

  const redirectToCompare = e => {
    e.preventDefault();
    if (profilesToCompare.length !== 2) {
      alert('You have to select two profiles to compare.');
      return;
    } else {
      history.push(
        `/framework/${frameworkName}/${frameworkVersion}/profiles/compare/${
          profilesToCompare[0]
        }/${profilesToCompare[1]}`
      );
    }
  };

  const handleDelete = e => {
    e.preventDefault();
    confirmAlert({
      //   title: 'Delete my profile',
      //   message: 'Are you sure you want to delete your profile? This action cannot be undone!!',
      //   buttons: [
      //     {
      //       label: 'Yes',
      //       onClick: () => localStorage.removeItem('guestProfile')
      //     },
      //     {
      //       label: 'No',
      //       onClick: () => alert('Profile not deleted')
      //     }
      //   ]
      // });

      customUI: ({ onClose }) => {
        return (
          <div className="react-confirm-alert-body">
            <h2>Delete my profile</h2>
            <p>
              Are you sure you want to delete your profile? This action cannot
              be undone!!
            </p>
            <div className="react-confirm-alert-button-group">
              <button onClick={onClose}>No</button>
              <button
                onClick={() => {
                  localStorage.removeItem('guestProfile');
                  alert('Profile deleted');
                  window.location.reload(false);
                  onClose();
                }}
              >
                Yes, Delete it!
              </button>
            </div>
          </div>
        );
      }
    });
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
              You can explore career profiles for professionals in Biomolecular
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
              Compare your profile with other reference profiles to help you
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
                    to={`/framework/${frameworkName}/${frameworkVersion}/profile/create/`}
                  >
                    {' '}
                    Create reference profile{' '}
                    <i className="icon icon-common icon-user-plus" />
                  </Link>
                  <Link
                    onClick={e => redirectToCompare(e)}
                    className="button secondary small action-buttons"
                    to={`/framework/${frameworkName}/${frameworkVersion}/profiles/compare/${
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
                    to={`/framework/${frameworkName}/${frameworkVersion}/profiles/compare/${
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
            {guestProfile ? (
              <div class="profile_badge">
                <span class="compare_checkbox">
                  <label>
                    <input
                      type="checkbox"
                      onClick={e => setProfilesToCompare(e)}
                      data-profileid="guest"
                    />
                    Click to compare
                  </label>
                  <span className="cm_badge">Your profile</span>
                </span>

                <p>
                  <div>
                    <img
                      alt="profile"
                      src={
                        guestProfile.image[0]
                          ? guestProfile.image[0].url
                          : user_icon
                      }
                      class="profile_img"
                    />
                  </div>
                </p>
                <div class="row action-buttons-row my-profile-card">
                  <div class="column medium-12">
                    <h4>{guestProfile.job_title}</h4>
                    <Link
                      style={{ marginRight: '20px' }}
                      to={`/framework/${guestProfile.frameworkName}/${
                        guestProfile.versionNumber
                      }/profile/view/guest`}
                    >
                      View profile{' '}
                      <i class="icon icon-common icon-angle-right" />
                    </Link>

                    <Link onClick={e => handleDelete(e)} to={`#`}>
                      Delete profile{' '}
                      <i class="icon icon-common icon-trash-alt" />
                    </Link>

                    <p
                      style={{
                        color: '#999',
                        bottom: '-15px',
                        position: 'relative'
                      }}
                    >
                      {guestProfile.frameworkName} -{' '}
                      {guestProfile.versionNumber}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
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
                  <span className="cm_badge">Your profile</span>
                </span>
                <p>
                  <div>
                    <img alt="profile" src={user_icon} class="profile_img" />
                  </div>
                </p>
                <div class="row action-buttons-row my-profile-card">
                  <div class="column medium-12">
                    <h4>[Your job title]</h4>
                    <Link
                      to={`/framework/${frameworkName}/${frameworkVersion}/profile/create/guest`}
                    >
                      Create your profile{' '}
                      <i class="icon icon-common icon-user-plus" />
                    </Link>
                    <p>&nbsp;</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          {profiles
            ? profiles.map(profile => {
                if (!checkUserAccess()) {
                  if (profile.publishing_status === 'Live') {
                    return (
                      <div className="column medium-4">
                        <div className="profile_badge">
                          <span class="compare_checkbox">
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
                                  alt="profile"
                                  src={profile.image[0].url}
                                  className="profile_img"
                                />
                              </div>
                            ) : (
                              <img
                                alt="profile"
                                src={user_icon}
                                className="profile_img"
                              />
                            )}
                          </p>

                          <div className="row action-buttons-row my-profile-card">
                            <div className="column medium-12">
                              <h4>
                                {profile.job_title
                                  ? profile.job_title
                                  : 'Job title'}
                              </h4>
                              <Link
                                to={`/framework/${frameworkName}/${frameworkVersion}/profile/view/${
                                  profile.id
                                }${profile.url_alias}`}
                              >
                                View profile{' '}
                                <i class="icon icon-common icon-angle-right" />
                              </Link>
                              <p>&nbsp;</p>
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
                              data-profileid={profile.id}
                            />
                            Click to compare
                          </label>
                        </span>
                        <p className={profile.publishing_status}>
                          {profile.image[0] ? (
                            <img
                              alt="profile"
                              src={profile.image[0].url}
                              className="profile_img"
                            />
                          ) : (
                            <img
                              alt="profile"
                              src={user_icon}
                              className="profile_img"
                            />
                          )}
                        </p>

                        <div className="row action-buttons-row my-profile-card">
                          <div className="column medium-12">
                            <h4>
                              {profile.job_title
                                ? profile.job_title
                                : 'Job title'}
                            </h4>
                            <Link
                              to={`/framework/${frameworkName}/${frameworkVersion}/profile/view/${
                                profile.id
                              }${profile.url_alias}`}
                            >
                              View profile{' '}
                              <i class="icon icon-common icon-angle-right" />
                            </Link>
                            <p>&nbsp;</p>
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
