import React from 'react';
import ErrorLoading from '../components/error-loading/ErrorLoading';
import FrameworkVersions from '../containers/framework-versions/FrameworkVersions';
import VersionControls from '../containers/version-controls/VersionControls';

import { withSnackbar } from 'notistack';
import CompetencyService from '../services/competency/competency';
import ActiveRequestsService from '../services/active-requests/active-requests';

import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import ManageDomains from './ManageDomains';

class ManageData extends React.Component {
  activeRequests = new ActiveRequestsService();
  competencyService = new CompetencyService();
  constructor(props) {
    super(props);
    this.state = {
      framework: '',
      frameworkName: '',
      frameworkData: [],
      frameworkVersion: '',
      frameworkVersionId: '',
      frameworkStatus: '',
      frameworkDef: [],
      versions: [],
      loadingError: false,
      editable: false,
      showModal: false,
      showModalPosition: false,
      newDomains: '',
      parent: ''
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.saveDomains = this.saveDomains.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  OpenModalPosition(e) {
    this.setState({ showModalPosition: true });
  }

  closeModalPosition() {
    this.setState({ showModalPosition: false });
  }

  setDomains(e) {
    this.setState({ newDomains: e.target.value });
  }

  async saveDomains(e) {
    const { framework, frameworkData, newDomains } = this.state;

    let parentID = frameworkData[0].nid;
    let versionID = frameworkData[0].version_id;
    let newData = newDomains;
    let type = 'domain';
    let addtional = '';
    e.preventDefault();

    try {
      this.activeRequests.startRequest();
      await this.competencyService.createBulkData(
        parentID,
        versionID,
        newData,
        type,
        addtional
      );
      await this.loadData(framework);
      this.props.enqueueSnackbar('Domains created', {
        variant: 'success'
      });
    } catch (e) {
      this.props.enqueueSnackbar('Unable to perform the request', {
        variant: 'error'
      });
    } finally {
      this.activeRequests.finishRequest();
    }

    this.handleCloseModal();
  }

  static getDerivedStateFromProps(props, state) {
    const { framework } = props.match.params;
    if (framework !== state.framework) {
      return {
        framework,
        frameworkData: [],
        loadingError: false
      };
    }

    // No state update necessary
    return null;
  }

  async componentDidMount() {
    const { framework, domainId } = this.props.match.params;
    await this.loadData(framework);

    if (domainId) {
      setTimeout(() => {
        const ref = this.refs[domainId];
        if (ref) {
          ref.scrollIntoView();
        }
      }, 100);
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    const { framework, frameworkData, loadingError } = this.state;
    if (framework !== prevState.framework) {
      if (frameworkData.length === 0 && !loadingError) {
        this.loadData(framework);
      }
    }
  }

  async loadData(framework) {
    try {
      this.activeRequests.startRequest();
      await this.fetchVersions(framework);
      await this.fetchFramework(framework);
    } catch (error) {
      this.setState({ loadingError: true });
      alert(`Error: ${error}`);
    } finally {
      this.activeRequests.finishRequest();
    }
  }

  async fetchVersions(framework) {
    const allFrameworks = await this.competencyService.getAllVersionedFrameworks();
    const currentFramework = allFrameworks.filter(
      fw => fw.title.toLowerCase().replace(/\s+/g, '') === framework
    );
    if (currentFramework.length > 0) {
      this.setState({ versions: currentFramework[0].versions.reverse() });
      this.setState({ frameworkDef: currentFramework[0].attribute_types });
    }
  }

  async fetchFramework(framework) {
    const { versions } = this.state;
    const liveVersion = versions.filter(version => version.status === 'live');
    const draftVersion = versions.filter(version => version.status === 'draft');
    let frameworkData = [];
    let editable = false;

    if (draftVersion.length) {
      frameworkData = await this.competencyService.getVersionedDraftFramework(
        framework
      );
      this.setState({ frameworkVersionId: draftVersion[0].id });
      editable = true;
      console.log(frameworkData);
    } else {
      if (liveVersion.length) {
        frameworkData = await this.competencyService.getVersionedFramework(
          framework,
          liveVersion[0].number
        );
      }
    }

    if (frameworkData.length) {
      const competencyTypes = frameworkData[0].domains.map(domain => ({
        description: domain.title,
        uuid: domain.uuid
      }));
      this.setState({
        frameworkName: frameworkData[0].title,
        frameworkData: frameworkData,
        frameworkVersion: frameworkData[0].version,
        frameworkStatus: frameworkData[0].status,
        competencyTypes,
        editable
      });
    }
  }

  releaseNewVersion = async (version, notes) => {
    const { framework } = this.state;
    try {
      this.activeRequests.startRequest();
      await this.competencyService.publishFramework(framework, version, notes);
      this.loadData(framework);
    } catch (e) {
      this.props.enqueueSnackbar('Unable to perform the request', {
        variant: 'error'
      });
    } finally {
      this.activeRequests.finishRequest();
    }
  };

  updateNotes = async notes => {
    const { framework, frameworkVersionId } = this.state;
    try {
      this.activeRequests.startRequest();
      await this.competencyService.updateReleaseNotes(
        notes,
        frameworkVersionId
      );
      this.loadData(framework);
    } catch (e) {
      this.props.enqueueSnackbar('Unable to perform the request', {
        variant: 'error'
      });
    } finally {
      this.activeRequests.finishRequest();
    }
  };

  createDraft = async () => {
    const { framework } = this.state;
    try {
      this.activeRequests.startRequest();
      await this.competencyService.createDraftFramework(framework);
      this.loadData(framework);
    } catch (e) {
      this.props.enqueueSnackbar('Unable to perform the request', {
        variant: 'error'
      });
    } finally {
      this.activeRequests.finishRequest();
    }
  };

  render() {
    const {
      framework,
      frameworkName,
      frameworkData,
      frameworkVersion,
      frameworkStatus,
      frameworkDef,
      //competencyTypes,
      versions,
      loadingError,
      editable
    } = this.state;

    if (loadingError) {
      return <ErrorLoading />;
    }

    if (frameworkData.length === 0) {
      return null;
    }

    return (
      <div className="row">
        <h2>Manage framework data</h2>
        <h4>{frameworkName}</h4>
        <p>
          <span className="tag">{frameworkVersion}</span>
          <span className="tag secondary-background">
            {frameworkStatus === '' ? 'draft' : frameworkStatus}
          </span>
        </p>
        <div className="row">
          <div className="column medium-9">
            <VersionControls
              editable={editable}
              createDraft={this.createDraft}
              versions={versions}
              release={this.releaseNewVersion}
              updateNotes={this.updateNotes}
            />
          </div>
          <div className="column medium-3">
            {editable === true ? (
              <button
                href="#"
                className="addButton"
                onClick={this.handleOpenModal}
              >
                {' '}
                <i className="icon icon-common icon-plus-circle" /> Add domains{' '}
              </button>
            ) : (
              ''
            )}
          </div>
        </div>

        <ManageDomains
          editableFrm={editable}
          framework={framework}
          frameworkData={frameworkData}
          frameworkDef={frameworkDef}
          loadData={this.loadData}
        />

        <FrameworkVersions framework={framework} versions={versions} />

        {/* Modal for adding domains */}

        <Modal
          open={this.state.showModal}
          onClose={this.handleCloseModal}
          center
          classNames={{
            overlay: 'customOverlay',
            modal: 'customModal'
          }}
        >
          <h2>Add domain(s) </h2>
          <h3>Please enter one domain per line</h3>
          <form>
            <textarea
              id="domain_txt_area"
              rows="5"
              onChange={e => this.setDomains(e)}
              required
            />
            <button className="button" onClick={e => this.saveDomains(e)}>
              Save
            </button>
          </form>
        </Modal>
      </div>
    );
  }
}

export default withSnackbar(ManageData);
