import React from 'react';
import ReactModal from 'react-modal';

const GuestHelp = props => {
  const modalOpen = props.modalOpen;

  const closeModal = e => {
    //e.preventDefault(e);
    props.closeModal();
  };

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '70%',
      backgroundColor: '#f1f1f1'
    }
  };

  return (
    <div>
      <ReactModal isOpen={modalOpen} style={customStyles}>
        <button style={{ float: 'right' }} onClick={e => closeModal(e)}>
          <i className="icon icon-common icon-window-close" />
        </button>
        <h2>Help</h2>
        <h4>Create/edit your profile</h4>
        <p className="lead">
          Fill the Create/Edit Profile form in order to create your own user
          profile. The profile will be saved in your browser so that you can
          print it or compare it with other profiles.
        </p>

        <h4>Map competencies to your profile</h4>
        <p className="lead">
          In the second step, select your level of expertise in each competency
          and choose the knowledge, skills and attitudes that are applicable to
          you.
        </p>

        <h4>Compare your profile</h4>
        <p className="lead">
          Compare the profile that you created with one of the reference
          profiles in the site.
        </p>

        <h4>Download your profile</h4>
        <p className="lead">Click the print button and download the profile</p>
      </ReactModal>
    </div>
  );
};

export default GuestHelp;
