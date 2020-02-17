import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

class ItemVersions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false
    };

    this.openModal = this.openModal.bind(this);
    // this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  // afterOpenModal() {
  //   // references are now sync'd and can be accessed.
  //   this.subtitle.style.color = '#f00';
  // }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  render() {
    return (
      <span>
        <button onClick={this.openModal}>
          {' '}
          <i className={'fa fa-question-circle'} />{' '}
        </button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <button className={'float-right'} onClick={this.closeModal}>
            <i className={'fa fa-window-close'} />
          </button>
          <p />
          <div className={'callout'}>
            This item is deprecated in the latest version of this framework.
            Please see the
            <Link
              to={`/framework/${this.props.framework.toLowerCase()}/${
                this.props.version
              }`}
            >
              {' '}
              release notes
            </Link>
          </div>
        </Modal>
      </span>
    );
  }
}

export default ItemVersions;
