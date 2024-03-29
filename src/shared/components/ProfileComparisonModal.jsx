import React, { useState } from 'react';
import ReactModal from 'react-modal';
import masterList from '../../app/containers/masterList.json';

const customStyles = {
  content: {
    position: 'absolute',
    top: '40px',
    left: '40px',
    right: '40px',
    bottom: '40px',
    border: '1px solid #ccc',
    background: '#fff',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '4px',
    outline: 'none',
    padding: '20px',
    width: '500px',
    height: '250px',
    margin: 'auto'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.75)'
  }
};

export const ProfileComparisonModal = props => {
  const includeGuestProfile = props.includeGuestProfile;
  const [showModal, setShowModal] = useState(false);
  const currentProfile = props.profile;
  const profiles = props.profiles;

  return (
    <div>
      {props.linkVariant ? (
        <button
          className="vf-button vf-button--link"
          onClick={() => {
            setShowModal(true);
          }}
        >
          Compare another profile
        </button>
      ) : (
        <button
          className="vf-button vf-button--primary vf-button--sm"
          onClick={() => {
            setShowModal(true);
          }}
        >
          Compare profile
        </button>
      )}
      {currentProfile ? (
        <>
          <div>
            <ReactModal
              isOpen={showModal}
              contentLabel="Example Modal"
              className="Modal"
              overlayClassName="Overlay"
              style={customStyles}
              onRequestClose={() => {
                setShowModal(false);
              }}
            >
              <h2>
                Compare profile{' '}
                <span
                  style={{
                    float: 'right',
                    cursor: 'pointer',
                    fontWeight: 'normal'
                  }}
                  onClick={() => {
                    setShowModal(false);
                  }}
                >
                  X
                </span>
              </h2>
              {currentProfile.id ? (
                ''
              ) : (
                <p>
                  This profile has been created in the{' '}
                  {
                    masterList.filter(
                      item => item.title === currentProfile.frameworkName
                    )[0].desc
                  }{' '}
                  {console.log(currentProfile)}
                  framework.
                </p>
              )}
              <p>
                Select a framework profile to compare{' '}
                <strong>{currentProfile.job_title} with:</strong>
              </p>

              <form>
                <select
                  className="vf-form__select"
                  id="vf-form__select"
                  onChange={e => {
                    props.setSelectedProfileId(e.target.value);
                  }}
                >
                  <option value="0">Select profile</option>
                  {localStorage.getItem('guestProfile') &&
                  includeGuestProfile ? (
                    <option value={'guest'}>
                      {
                        JSON.parse(localStorage.getItem('guestProfile'))
                          .job_title
                      }
                    </option>
                  ) : (
                    ''
                  )}
                  {profiles
                    ? profiles.map((profile, index) => {
                        return (
                          <React.Fragment key={index}>
                            <option key={index} value={profile.id}>
                              {profile.job_title}
                            </option>
                          </React.Fragment>
                        );
                      })
                    : ''}
                </select>
                <span style={{ color: 'red' }}>{props.comparisonError}</span>
              </form>
              <div className="vf-u-margin__top--200" />
              <button
                className="vf-button vf-button--primary vf-button--sm"
                onClick={e => {
                  setShowModal(false);
                  props.redirectToCompare(e);
                }}
              >
                Compare
              </button>
            </ReactModal>
          </div>
        </>
      ) : (
        ''
      )}
    </div>
  );
};
