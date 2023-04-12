import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Link } from 'react-router-dom';

import { apiUrl } from '../services/http/http';
import './Profile.css';
import user_icon from './user_icon.png';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import auth from '../services/util/auth';

const ProfileList = props => {
  let history = useHistory();

  const frameworkName = props.framework;
  const frameworkVersion = props.version;
  const [guestProfile, setGuestProfile] = useState();
  const [profiles, setProfiles] = useState();
  const [userFrameworks, setUserFrameworks] = useState([]);

  var profilesToCompare = [];
  const needTimeStamp = auth.currently_logged_in_user.is_logged_in
    ? '&timestamp=' + Date.now()
    : '';

  var userName = auth.currently_logged_in_user.username;

  useEffect(() => {
    const fetchData = async () => {
      try {
        let tempguestProfile = JSON.parse(localStorage.getItem('guestProfile'));
        setGuestProfile(tempguestProfile ? tempguestProfile : '');
        await fetch(
          `${apiUrl}/api/${frameworkName}/${frameworkVersion}/profiles/?_format=json&source=competencyhub&timestamp=${needTimeStamp}`
        )
          .then(Response => Response.json())
          .then(findresponse => {
            setProfiles(findresponse);
          });
        if (userName) {
          await fetch(`${apiUrl}/api/authorisation/${userName}?_format=json`, {
            method: 'GET',
            credentials: 'include'
          })
            .then(Response => Response.json())
            .then(findresponse => {
              setUserFrameworks(findresponse);
            });
        }
      } catch (e) {
        console.log(e.message);
      }
    };

    fetchData();
  }, [frameworkVersion, frameworkName, userName]);

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

  const checkFMAccess = () => {
    var temp = [];
    if (userFrameworks.length > 0) {
      userFrameworks.forEach(item => {
        temp.push(item.toLowerCase().replace(/ /g, ''));
      });
      if (temp.includes(frameworkName)) {
        return true;
      }
      return false;
    }
  };
  return (
    <div>
      <div className="introduction">
        <div className="vf-grid vf-grid__col-2">
          <div>
            <h4>
              <i className="icon icon-common icon-search-document" /> Discover
              and explore{' '}
            </h4>
            <p>Explore career profiles within this competency framework</p>
          </div>
          <div>
            <h4>
              <i className="icon icon-common icon-user-plus" /> Create your own
              profile
            </h4>
            <p>
              Create your own profile and assess yourself against the
              competencies
            </p>
          </div>
        </div>
      </div>
      <div className="wrapper">
        <div className="vf-grid vf-grid__col-2">
          <div>
            <h3>Career profiles</h3>
          </div>
          <div>
            <span style={{ float: 'right' }}>
              {auth.currently_logged_in_user.roles.length > 0 &&
              checkFMAccess() ? (
                <span>
                  <Link
                    className="vf-button vf-button--primary vf-button--sm"
                    to={`/framework/${frameworkName}/${frameworkVersion}/profile/create/`}
                  >
                    {' '}
                    Create reference profile{' '}
                    <i className="icon icon-common icon-user-plus" />
                  </Link>
                  {/* <Link
                    onClick={e => redirectToCompare(e)}
                    className="vf-button vf-button--tertiary vf-button--sm"
                    to={`/framework/${frameworkName}/${frameworkVersion}/profiles/compare/${
                      profilesToCompare[0]
                    }/${profilesToCompare[1]}`}
                  >
                    {' '}
                    Compare selected profiles{' '}
                    <i className="icon icon-common icon-compare" />
                  </Link> */}
                </span>
              ) : (
                <span>
                  {/* <Link
                    onClick={e => redirectToCompare(e)}
                    className="vf-button vf-button--tertiary vf-button--sm"
                    to={`/framework/${frameworkName}/${frameworkVersion}/profiles/compare/${
                      profilesToCompare[0]
                    }/${profilesToCompare[1]}`}
                  >
                    {' '}
                    Compare selected profiles{' '}
                    <i className="icon icon-common icon-compare" />
                  </Link> */}
                </span>
              )}
            </span>
          </div>
        </div>
        <hr />
        <div className="vf-grid vf-grid__col-3">
          {guestProfile ? (
            <div className="vf-profile vf-profile--very-easy vf-profile--small vf-profile--block">
              <img
                alt=""
                src={
                  guestProfile.image[0] ? guestProfile.image[0].url : user_icon
                }
                className="vf-profile__image"
                width={'auto'}
                height={'auto'}
                loading="lazy"
              />
              <div>
                <h4 className="vf-profile__title">
                  <Link
                    className="vf-profile__link"
                    to={`/framework/${guestProfile.frameworkName}/${
                      guestProfile.versionNumber
                    }/profile/view/guest`}
                  >
                    {guestProfile.job_title}
                  </Link>
                </h4>

                {/*<span>*/}
                {/*  <label>*/}
                {/*    <input*/}
                {/*      type="checkbox"*/}
                {/*      onClick={e => setProfilesToCompare(e)}*/}
                {/*      data-profileid="guest"*/}
                {/*    />*/}
                {/*    Click to compare*/}
                {/*  </label>*/}
                {/*</span>*/}

                <div
                  style={{
                    color: '#999',
                    bottom: '-15px',
                    position: 'relative'
                  }}
                >
                  <span>
                    <hr className="vf-divider | vf-u-fullbleed" />
                    {/* Your profile {guestProfile.frameworkName} -{' '}
                    {guestProfile.versionNumber} */}
                  </span>

                  <Link onClick={e => handleDelete(e)} to={`#`}>
                    Delete your profile{' '}
                    <i className="icon icon-common icon-trash-alt" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <article className="vf-profile vf-profile--very-easy vf-profile--small vf-profile--inline">
              <img
                alt=""
                src={user_icon}
                className="vf-profile__image"
                width={'auto'}
                height={'auto'}
                loading="lazy"
              />

              <Link
                className="vf-button vf-button--primary vf-button--sm"
                to={`/framework/${frameworkName}/${frameworkVersion}/profile/create/guest`}
              >
                Add your profile{' '}
              </Link>
            </article>
          )}
          {/* </div> */}
          {profiles
            ? profiles.map((profile, index) => {
                if (!auth.currently_logged_in_user.is_logged_in) {
                  if (profile.publishing_status === 'Live') {
                    return (
                      <div key={index}>
                        <article className="vf-profile vf-profile--very-easy vf-profile--small vf-profile--inline">
                          {profile.image[0] ? (
                            <img
                              alt=""
                              src={profile.image[0].url}
                              className="vf-profile__image"
                              width={'auto'}
                              height={'auto'}
                              loading="lazy"
                            />
                          ) : (
                            <img
                              alt=""
                              src={user_icon}
                              className="vf-profile__image"
                            />
                          )}
                          <h4 className="vf-profile__title">
                            {profile.job_title ? (
                              <Link
                                className="vf-profile__link"
                                to={`/framework/${frameworkName}/${frameworkVersion}/profile/view/${
                                  profile.id
                                }${profile.url_alias}`}
                              >
                                {profile.job_title}
                              </Link>
                            ) : (
                              'Job title'
                            )}
                          </h4>
                        </article>
                      </div>
                    );
                  }
                } else {
                  return (
                    <div>
                      <div className="profile_badge">
                        {/*<span>*/}
                        {/*  <label>*/}
                        {/*    <input*/}
                        {/*      type="checkbox"*/}
                        {/*      onClick={e => setProfilesToCompare(e)}*/}
                        {/*      data-profileid={profile.id}*/}
                        {/*    />*/}
                        {/*    Click to compare*/}
                        {/*  </label>*/}
                        {/*</span>*/}
                        <p className={profile.publishing_status}>
                          {profile.image[0] ? (
                            <img
                              alt=""
                              src={profile.image[0].url}
                              className="profile_img"
                            />
                          ) : (
                            <img
                              alt=""
                              src={user_icon}
                              className="profile_img"
                            />
                          )}
                        </p>

                        <div className="row action-buttons-row my-profile-card">
                          <div>
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
                              <i className="icon icon-common icon-angle-right" />
                            </Link>
                            <p>&nbsp;</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })
            : ''}
        </div>
      </div>
    </div>
  );
};

export default ProfileList;
