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
          You may fill the Create/Edit Profile form in order to create your own
          user profile. The profile will be saved in your browser.
        </p>

        <h4>Map competencies to your profile</h4>
        <p className="lead">
          After creating your profile, the next step is to map it with the
          competencies. In the mapping form, you may select the level of
          expertise from the dropdown and choose the attributes that are
          applicable in your case.
        </p>

        <h4>Compare your profile</h4>
        <p className="lead">
          After creating your profile and mapping it to competencies. You can
          compare your profile with another reference profile and see the
          summary of differences between the two.
        </p>

        <h4>Save / download your profile</h4>
        <p className="lead">
          After creating your profile and mapping it to competencies, you may
          click the print button and download the profile in your desired
          format.
        </p>
      </ReactModal>
    </div>
  );
};

export default GuestHelp;
